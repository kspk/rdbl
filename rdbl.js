
let fonts = [
    ["Bebas Neue + Libre Baskerville", "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Libre+Baskerville&display=swap" ]
];

let checkFb = () => {
    return document.domain.indexOf("facebook") >= 0
    ? [document.body, "fb"]
    : [document.body, ""];
}

let checkMdm = () => {
    return [...document.getElementsByTagName("script")].find((s) => s.src.indexOf("medium.com") > 0) 
        ? [document.getElementById("root").querySelector("article"), "mdm"]
        : [document.body, ""];
}

let checkAtd = () => {
    return document.domain.indexOf(".allthingsdistributed.") >= 0
        ? [document.getElementById("container"), "atd"]
        : [document.body, ""];
}

let checkWp = () => {
    return document.domain.indexOf(".wikipedia.") >= 0
        ? [document.getElementById("content"), "wp"]
        : [document.body, ""];
}

let determinePage = () => {
    let [root, site] = [document.body, ""];

    if (!site) [root, site] = checkFb();
    if (!site) [root, site] = checkMdm();
    if (!site) [root, site] = checkAtd();
    if (!site) [root, site] = checkWp();

    return [root, site];
}

let pageSpecificStuff = (root, site) => {
    switch(site) {
        case "medium": 
            root.querySelectorAll("img").forEach((i) => {
                if(!i.src || i.src === "") {
                    i.parentNode.innerHTML = i.nextSibling.innerText;
                }
            });
            root.querySelectorAll("img").forEach((i) => {
                i.id = ""; i.className = ""; i.style = "";
                i.removeAttribute("width");
                i.removeAttribute("height");
            });
            break;
        case "atd":
            break;
        case "wp":
            break;
    }
}

let selectContentTags = (root) => {
    let ctags = "noscript, div, p, section, article, span, em, h1, h2, h3, h4, h5, h6, img, svg, figure, figcaption, table, ul, ol";
    let itags = ["IMG", "SVG"];
    let ictags = ["H1", "H2", "H3", "H4", "H5", "H6", "TABLE", "FIGURE", "FIGCAPTION", "UL", "OL"]
    
    let tags = [...root.querySelectorAll(ctags)].filter((x) => { 
        if (x.style.display === "none" || x.style.visibility === "hidden") {
            return false;
        }

        let xi = "";
        let xci = "";
        [...x.childNodes].forEach((cn) => { 
            if (cn.nodeType === 3) xi += cn.textContent.trim();
            else if(cn.nodeType === 1) xci += cn.textContent.trim();
        });

        return itags.indexOf(x.nodeName) >= 0
            || (ictags.indexOf(x.nodeName) >= 0 && xci !== "")
            || xi !== "";
    });
    tags.forEach((t) => { t.setAttribute("data-selected", "true"); t.id = ""; t.className = ""; t.style = ""; });
    tags = tags.filter((x) => {
        return x.parentNode.closest("[data-selected='true']") === null;
    });
    
    return tags;
}

let changeFont = (idx) => {
    let key = "font" + idx;
    if(!document.getElementById(key)) {
        let f = fonts[idx];
        let link = document.createElement("link");
        document.head.appendChild(link);
        link.id = key;
        link.rel = "stylesheet"
        link.href = f[1];
    }
}

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

let createUI = (root) => {
    changeFont(0);

    let tags = selectContentTags(root);

    let rdblElem = document.createElement("div")
    document.body.appendChild(rdblElem);
    document.body.style = "overflow: hidden; height: 100vh; font-size: 18px;";
    rdblElem.id = "readerroot";
    rdblElem.className = "readerroot";
    rdblElem.setAttribute("data-fi", "2");
    
    rdblElem.innerHTML = `
        <div id="readerheader" class="readerhf">
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
        <div id="readercontent" class="readercontent">
        </div>
        <div id="readerfooter" class="readerhf">
        </div>
    `;
    let headerElem = rdblElem.querySelector("#readerheader");
    let contentElem = rdblElem.querySelector("#readercontent");

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
    let [root, site] = determinePage();
    let rdblroot = createUI(root);

    pageSpecificStuff(rdblroot, site);
}
rdbl();