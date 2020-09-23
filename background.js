'use strict';

chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        "id": "sampleContextMenu",
        "title": "Read it"
    });
});

chrome.browserAction.onClicked.addListener(function(tab){
    chrome.tabs.executeScript({
        file: "readit.js"
    });
    chrome.tabs.insertCSS({
        file: "readit.css"
    });
});



