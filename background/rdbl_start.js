
if(!window["rdbl.state"]) {
    window["rdbl.state"] = {};

    let js = document.createElement("script");
    document.body.appendChild(js);
    js.src = chrome.runtime.getURL("main/rdbl.js");

    let css = document.createElement("link");
    document.head.appendChild(css);
    css.rel = "stylesheet"
    css.href = chrome.runtime.getURL("main/rdbl.css");
}
else {
    window.location.reload();
}
