/**
 * @file tags.js
 * Content handler script for the webapge. Defines logic to select and filter tags with content, 
 * remove existing styles to normalize and apply consistent styling across pages. 
 */

 /**
  * @function selectContentTags This is the core content selection logic based on 'gut-feeling' hueristics. 
  * Here's the basic algorithm:
  *  • Select all handpicked content tags from the specified root - we receive root from the handler, default is document.body.
  *  • Call filter to get a page specific list of tags we want to remove, and set them to display: none.
  *  • Filter tags that are not visible in DOM - display: none, visibility: hidden, or aria-hidden: true.
  *  • Filter tags that do not have any displayable content within them:
  *     • Tags who's individual textContent is empty - child nodes may have content, but they'd already be included in query.
  *     • Few tags are semantic tags, and they shouldn't be removed if they have any child content.
  *     • Few tags may not have textContent but represent visual content, and should't be removed.
  *  • Once the list is filtered, we remove core attributes like id, class & style, and add a custom data attribute to mark it selected.
  *  • Now we iterate one more time, to keep the topmost parent that has selected data attribute, since it will include all selected children tags.
  * 
  * @param {DOMElement} root element that is considered root of the content, defaults to document.body if not specified. 
  * @param {Array} includeTags page specific tags to be included in the select tag's query.
  * @param {function} pageTagFilter filter implementation for excluding page specific non-content elements.
  */
let selectContentTags = (root, includeTags, pageTagFilter) => {
    // Hand crafted list of all tags that usually contain text. 
    let ctags = [ "div", "p", "section", "article", "span", "em", "h1", "h2", "h3", "h4", "h5", "h6", 
        "img", "svg", "figure", "figcaption", "table", "ul", "ol", "code", "blockquote", "noscript" ];
    
    // Inline content tags, that may not have textContent.
    let itags =  [ "IMG", "SVG" ];

    // List of semantic tags, that must be selected to maintain the intended structure of the webpage.
    let ictags = [ "H1", "H2", "H3", "H4", "H5", "H6", "TABLE", "FIGURE", "FIGCAPTION", "UL", "OL", "BLOCKQUOTE" ]

    // Ensure the root is initialized, and select all tags with the default selector list + page specifc selector list.
    root = root ?? document.body;
    let nodes = [...root.querySelectorAll([...ctags, ...includeTags])];

    // First call custom tagfilter for the page to exclude nodes,
    // then set all nodes to exclude as display: none. This will take them out 
    // of visible DOM, and exclude them later in the big filter logic. 
    if (typeof pageTagFilter === 'function') {
        let fnodes = nodes.filter(pageTagFilter);
        fnodes.forEach((f) => { f.style.display = 'none'; });
    }

    nodes = nodes.filter((x) => {
        // Filter nodes that are not within the visible DOM hierarchy. The nodes that have display: none, set above, will result in offsetParent being null. 
        if (x.offsetParent === null || x.style.display === "none" || x.style.visibility === "hidden" || x.getAttribute("aria-hidden") === "true") {
            return false;
        }

        // Now iterate over the nodes and check their textContent. 
        // Create the text content of this node, and textContent of its children. 
        let xi = "";    // trimmed textContent of the current node.
        let xci = "";   // trimmed textContent of child element nodes of current node.
        [...x.childNodes].forEach((cn) => {
            if (cn.nodeType === 3) xi += cn.textContent.trim();
            else if (cn.nodeType === 1) xci += cn.textContent.trim();
        });

        // Keep this node if 
        // - it is one of the inline content node
        // - it has nodes under itself, that do not have empty textContent
        // - it has some of its own textContent
        return itags.indexOf(x.nodeName) >= 0
            || (ictags.indexOf(x.nodeName) >= 0 && xci !== "")
            || xi !== "";
    });

    // Once we have our list of nodes, let's clear out styling information, and mark it selected. 
    // Use this selection mark, to filter out those redundant child nodes who have their parent in the list as well. 
    nodes.forEach((n) => { n.setAttribute("data-selected", "true"); n.id = ""; n.className = ""; n.style = ""; });
    nodes = nodes.filter((x) => {
        return x.parentNode.closest("[data-selected='true']") === null;
    });

    return nodes;
}

export { selectContentTags }