import { 
    Settings, 
    fonts,
    getLocalSettings,
    setLocalSettings
} from "../common/objects.js";

let settings = new Settings();
let handleFontChange = (evt) => {
    let select = evt.target;
    settings.fidx = select.selectedIndex;
    setLocalSettings(settings);

    updateUI();
}

let updateUI = () => {
    document.querySelector(".preview .title").style.fontFamily = fonts[settings.fidx].title;
    document.querySelector(".preview .text").style.fontFamily = fonts[settings.fidx].text;
}

let initCallback = (result) => {
    settings = result;

    let select = document.querySelector("select#font-options");
    fonts.forEach((o) => {
        let opt = document.createElement("option");
        opt.value = opt.text = o.name;
        select.add(opt);
    });
    select.selectedIndex = settings.fidx;
    select.addEventListener("change", handleFontChange);

    updateUI();
}

let init = () => {
    getLocalSettings(settings, initCallback);
}

window.onload = init;