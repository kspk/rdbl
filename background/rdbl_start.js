/**
 * Handle multiple clicks of the rdbl button (either from the extensions bar, or the context menu).
 * First click, render rdbl, and on the second click just refresh the page.
 * The rdbl script makes irrecoverable DOM changes to the source page,
 * as a result it's better to just reload and get fresh content.
 * 
 * Create a window level object 'rdbl.state' to keep track of whether the rdbl script has run on the page. 
 * If the object is present, just refresh, otherwise load the js and css for rdbl.
 */
if(!window["rdbl.state"]) {
    window["rdbl.state"] = {};

    let js = document.createElement("script");
    document.body.appendChild(js);
    js.type = "module";
    js.src = chrome.runtime.getURL("main/rdbl.js");

    let css = document.createElement("link");
    document.head.appendChild(css);
    css.rel = "stylesheet"
    css.href = chrome.runtime.getURL("main/rdbl.css");
}
else {
    window.location.reload();
}
