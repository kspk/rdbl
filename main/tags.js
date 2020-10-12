
let selectContentTags = (root, pageTagFilter) => {
    let ctags = "noscript, div, p, section, article, span, em, h1, h2, h3, h4, h5, h6, img, svg, figure, figcaption, table, ul, ol, code";
    let itags = ["IMG", "SVG"];
    let ictags = ["H1", "H2", "H3", "H4", "H5", "H6", "TABLE", "FIGURE", "FIGCAPTION", "UL", "OL"]

    let tags = [...root.querySelectorAll(ctags)].filter((x) => {
        if (x.style.display === "none" || x.style.visibility === "hidden" || x.getAttribute("aria-hidden") === "true") {
            return false;
        }

        let xi = "";
        let xci = "";
        [...x.childNodes].forEach((cn) => {
            if (cn.nodeType === 3) xi += cn.textContent.trim();
            else if (cn.nodeType === 1) xci += cn.textContent.trim();
        });

        return itags.indexOf(x.nodeName) >= 0
            || (ictags.indexOf(x.nodeName) >= 0 && xci !== "")
            || xi !== "";
    });

    // Call custom tagfilter for the page
    if (typeof pageTagFilter === 'function') 
        tags.forEach(pageTagFilter);

    tags.forEach((t) => { t.setAttribute("data-selected", "true"); t.id = ""; t.className = ""; t.style = ""; });
    tags = tags.filter((x) => {
        return x.parentNode.closest("[data-selected='true']") === null;
    });

    return tags;
}

export { selectContentTags }