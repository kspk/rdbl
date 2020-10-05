'use strict';

import { 
    Settings, 
    fonts,
    getLocalSettings
} from "../common/objects.js";

let options = new Settings();
let fetch_settings_call_rdbl = (tab) => {
    getLocalSettings(options, (result) => {
        options = result;
        rdbl_invoke(tab);
    })
}

let rdbl_invoke = (tab) => {
    chrome.tabs.executeScript({
        file: "background/rdbl_start.js"
    });

    let cssUrl = fonts[options.fidx].cssUrl;
    chrome.tabs.insertCSS({
        file: cssUrl
    });
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        "id": "rdbl.context",
        "title": "Read."
    });
});

chrome.browserAction.onClicked.addListener((tab) => fetch_settings_call_rdbl(tab));
chrome.contextMenus.onClicked.addListener((info, tab) => fetch_settings_call_rdbl(tab));


