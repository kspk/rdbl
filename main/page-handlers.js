
let checkers = [
    () => { return [...document.getElementsByTagName("script")].find((s) => s.src.indexOf("medium.com") > 0) ? "mdm" : "def"; },
    () => { return document.domain.indexOf(".allthingsdistributed.com") >= 0 ? "atd" : "def"; },
    () => { return document.domain.indexOf(".wikipedia.") >= 0 ? "wpda" : "def" },
    () => { return document.domain.indexOf("developer.mozilla.org") >= 0 ? "mdn" : "def" },
    () => { return document.domain.indexOf(".businessinsider.com") >= 0 ? "bi" : "def" },
    () => { return document.domain.indexOf("techcrunch.com") >= 0 ? "tc" : "def" }
];

let handlers = {
    /* 
    "site": () => {
        return {
            "root": document.querySelector(""),
            "includeTags": [],
            "pageCss": "",
            "filter": (node) => { },
            "prerdbl": (root) => { },
            "postrdbl": (root) => { }
        };
    }
    */
    "mdm" /* medium.com */: () => {
        return {
            "root": document.querySelector("#root").querySelector("article"),
            "postrdbl": (root) => {
                root.querySelectorAll("img").forEach((i) => {
                    if (!i.src || i.src === "") {
                        i.parentNode.innerHTML = i.nextSibling.innerText;
                    }
                });
                root.querySelectorAll("img").forEach((i) => {
                    i.id = ""; i.className = ""; i.style = "";
                    i.removeAttribute("width");
                    i.removeAttribute("height");
                });
            }
        };
    },
    "atd" /* allthingsdistributed.com */ : () => {
        return {
            "root": document.querySelector("#container")
        };
    },
    "wpda" /* wikipedia.* */ : () => {
        return {
            "root": document.querySelector("#content"),
            "filter": (node) => { 
                return node.id === "siteNotice"
                    || node.classList.contains("mw-editsection");
             }
        };
    },
    "mdn" /* developer.mozilla.org" */ : () => {
        return {
            "root": document.querySelector("main")
        };
    },
    "bi" /* businessinsider.com */: () => {
        return {
            "root": document.querySelector("section#l-content"),
            "filter": (node) => {
                return node.hasAttribute("data-bi-ad")
                    || node.id === "l-rightrail"
                    || node.classList.contains("post-content-more")
                    || node.classList.contains("post-content-category")
                    || node.classList.contains("post-content-bottom")
                    || node.classList.contains("mobile-sticky-container");
            },
            "postrdbl": (root) => { 
                [...root.querySelectorAll("div.lazy-holder")].forEach((d) => {
                    d.className = ""; 
                    d.style = "";
                });
            }
        }
    },
    "tc" /* techcrunch.com */: () => {
        return {
            "root": document.querySelector("article.article-container"),
            "filter": (node) => {
                return node.classList.contains("newsletter-signup-block")
                    || node.classList.contains("article-footer")
                    || node.classList.contains("article__related-links")
                    || node.classList.contains("screen-reader-text");
            }
        }
    },
    "def": () => {
        return {
            "root": document.body,
            "includeTags": [],
            "css": "",
            "filter": (node) => { },
            "prerdbl": (root) => { },
            "postrdbl": (root) => { }
        }
    }
}

let getPageHandler = () => {
    let [checkersExt, handlersExt] = getPageHandlerExtensions();
    let c = [...checkersExt, ...checkers];
    let h = {...handlers, ...handlersExt};

    let hid = "def";
    let i = 0;
    while(hid === "def" && i < c.length)
        hid = c[i++]();

    return { "id": hid, ...(h["def"]()), ...(h[hid]()) };
}

let getPageHandlerExtensions = () => {
    return [!(window["rdbl.checkers"]) ? [] : window["rdbl.checkers"], 
        !(window["rdbl.handlers"]) ? {} : window["rdbl.handlers"]];
}

export { getPageHandler }