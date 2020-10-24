
let checkers = [
    () => { return [...document.getElementsByTagName("script")].find((s) => s.src.indexOf("medium.com") > 0) ? "mdm" : "def"; },
    () => { return document.domain.indexOf(".allthingsdistributed.com") >= 0 ? "atd" : "def"; },
    () => { return document.domain.indexOf(".wikipedia.") >= 0 ? "wpda" : "def" },
    () => { return document.domain.indexOf("developer.mozilla.org") >= 0 ? "mdn" : "def" }
];

let handlers = {
    /* 
    "site": () => {
        return {
            "root": document.querySelector(""),
            "includeTags": [],
            "filter": (node) => { },
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
    "def": () => {
        return {
            "root": document.body,
            "includeTags": [],
            "filter": (node) => { },
            "postrdbl": (root) => { }
        }
    }
}

let getPageHandler = () => {
    let hid = "def";
    let i = 0;
    while(hid === "def" && i < checkers.length)
        hid = checkers[i++]();

    return { ...(handlers["def"]()), ...(handlers[hid]()) };
}

export { getPageHandler }