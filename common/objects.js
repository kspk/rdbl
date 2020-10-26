
class Settings {
    fidx = 0;
    checkerCode = "";
    handlerCode = "";
}

let fonts = [
    {
        "name": "Libre Baskerville & Bebas Neue",
        "title": "Bebas Neue",
        "text": "Libre Baskerville",
        "cssUrl": "main/font1.css"
    },
    {
        "name": "DM & Open Sans",
        "title": "DM Serif Display",
        "text": "Open Sans",
        "cssUrl": "main/font2.css"
    },
    {
        "name": "Comic Zine & Patrick Hand",
        "title": "Comic Zine OT",
        "text": "Patrick Hand",
        "cssUrl": "main/font3.css"
    }
];


let getLocalSettings = (obj, callback) => {
    chrome.storage.local.get(obj, (result) => {
        if (callback) callback(result);
    });
}

let setLocalSettings = (obj, callback) => {
    chrome.storage.local.set(obj, (result) => {
        if (callback) callback(result);
    });
}

export { 
    Settings, 
    fonts,
    getLocalSettings,
    setLocalSettings
}