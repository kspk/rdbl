'use strict';

let rdbl_invoke = (tab) => {
    chrome.tabs.executeScript({
        file: "rdbl.js"
    });
    chrome.tabs.insertCSS({
        file: "rdbl.css"
    });
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        "id": "sampleContextMenu",
        "title": "Read."
    });
});

chrome.browserAction.onClicked.addListener((tab) => rdbl_invoke(tab));
chrome.contextMenus.onClicked.addListener((info, tab) => rdbl_invoke(tab));


