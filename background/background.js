'use strict';

import { 
    Settings, 
    fonts,
    getLocalSettings
} from "../common/objects.js";

let options = new Settings();
let fetchSettingsCallRdbl = (tab) => {
    getLocalSettings(options, (result) => {
        options = result;
        rdbl_invoke(tab);
    });
}

let rdbl_invoke = (tab) => {    
    chrome.tabs.executeScript ({
        code: `window["rdbl.checkers"] = !(${options.checkerCode}) ? [] : ${options.checkerCode}; 
               window["rdbl.handlers"] = !(${options.handlerCode})? {} : ${options.handlerCode};`
    });

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

chrome.browserAction.onClicked.addListener((tab) => fetchSettingsCallRdbl(tab));
chrome.contextMenus.onClicked.addListener((info, tab) => fetchSettingsCallRdbl(tab));


