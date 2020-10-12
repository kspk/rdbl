
import { getPageHandler } from "./page-handlers.js";
import { selectContentTags } from "./tags.js";

let updateRdblClasses = (rdblElem, addClass, removeClass) => {
    rdblElem.classList.remove(...removeClass);
    rdblElem.classList.add(addClass);
}

let changeWidth = (rdblElem, widthClass) => {
    updateRdblClasses(rdblElem, widthClass, ["sml", "med", "lrg"])
}

let changeMode = (rdblElem, modeClass) => {
    updateRdblClasses(rdblElem, modeClass, ["light", "dark"]);
}

let changeFontSize = (rdblElem, fntIdx) => {
    let fontClasses = ["fnt0", "fnt1", "fnt2", "fnt3", "fnt4"];
    updateRdblClasses(rdblElem, fontClasses[fntIdx], ["fnt0", "fnt1", "fnt2", "fnt3", "fnt4"]);
}

let createUI = (pageHandler) => {
    let tags = selectContentTags(pageHandler.root, pageHandler.filter);

    let rdblElem = document.createElement("div")
    document.body.appendChild(rdblElem);
    document.body.style = "overflow: hidden; height: 100vh; font-size: 18px;";
    rdblElem.id = "rdblroot";
    rdblElem.className = "rdblroot";
    rdblElem.setAttribute("data-fi", "2");
    
    rdblElem.innerHTML = `
        <div id="readerheader" class="rdblhf">
            <span class="rdbl">RDBL</span>
            <span>
                <span class="fns">
                    <a href="#" class="dec" data-size="dec">A</a><a href="#" class="inc" data-size="inc">A</a>
                </span>
                <span class="colw">
                    <a href="#" class="cws" data-width="sml">S</a><a href="#" class="cwm" data-width="med">M</a><a href="#" class="cwl" data-width="lrg">L</a>
                </span>
                <span class="ld">
                    <a href="#" class="ldl">Light</a><a href="#" class="ldd">Dark</a>
                </span>
            </span>
        </div>
        <div id="rdblcontent" class="rdblcontent">
        </div>
        <div id="readerfooter" class="rdblhf">
        </div>
    `;
    let headerElem = rdblElem.querySelector("#readerheader");
    let contentElem = rdblElem.querySelector("#rdblcontent");

    let fontSizeClick = (evt) => {
        let id = evt.target.getAttribute("data-size");
        let idx = +rdblElem.getAttribute("data-fi") ?? 2;
        idx = (id === "inc" && idx < 4)
            ? idx + 1
            : (id === "dec" && idx > 0)
                ? idx - 1
                : idx;

        changeFontSize(rdblElem, idx);
        rdblElem.setAttribute("data-fi", idx);

        evt.preventDefault();
        return false;
    }
    headerElem.querySelectorAll(".fns > *").forEach((a) => {
        a.addEventListener("click", fontSizeClick);
    });

    let widthClick = (evt) => {
        changeWidth(rdblElem, evt.target.getAttribute("data-width"));

        evt.preventDefault();
        return false;
    };
    headerElem.querySelectorAll(".colw > *").forEach((a) => {
        a.addEventListener("click", widthClick);
    });

    let uimodeClick = (evt) => {
        changeMode(rdblElem, evt.target.innerText.toLowerCase().trim());

        evt.preventDefault();
        return false;
    };
    headerElem.querySelectorAll(".ld > *").forEach((a) => {
        a.addEventListener("click", uimodeClick);
    });

    tags.forEach((t) => {
        if(t.nodeName === "NOSCRIPT") {
            let e = document.createElement("div");
            contentElem.appendChild(e);
            e.innerHTML = t.innerText;
        }
        else {
            contentElem.appendChild(t);
        }
    });
    
    return rdblElem;
}

let rdbl = () => {
    let ph = getPageHandler();
    let rdblroot = createUI(ph);

    ph.postrdbl(rdblroot);
}
rdbl();