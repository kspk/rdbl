
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
            "filter": (root) => { },
            "postrdbl": (root) => { }
        };
    }
    */
    "mdm": () => {
        return {
            "root": document.querySelector("#root").querySelector("article"),
            "filter": (root) => { },
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
    "atd": () => {
        return {
            "root": document.querySelector("#container"),
            "filter": (root) => { },
            "postrdbl": (root) => { }
        };
    },
    "wpda": () => {
        return {
            "root": document.querySelector("#content"),
            "filter": (root) => { },
            "postrdbl": (root) => { }
        };
    },
    "mdn": () => {
        return {
            "root": document.querySelector("main"),
            "filter": (root) => { },
            "postrdbl": (root) => { }
        };
    },
    "def": () => {
        return {
            "root": document.body,
            "filter": (root) => { },
            "postrdbl": (root) => { }
        }
    }
}

let getPageHandler = () => {
    let hid = "def";
    let i = 0;
    while(hid === "def" && i < checkers.length)
        hid = checkers[i++]();

    return handlers[hid]();
}

export { getPageHandler }