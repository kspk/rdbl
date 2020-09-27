
let fonts = [
    ["Bebas Neue + Libre Baskerville", "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Libre+Baskerville&display=swap" ]
];

let checkMedium = () => {
    return [...document.getElementsByTagName("script")].find((s) => s.src.indexOf("medium.com") > 0) 
        ? [document.getElementById("root").querySelector("article"), "medium"]
        : [document.body, ""];
}

let checkAtd = () => {
    return document.domain === "www.allthingsdistributed.com" 
        ? [document.getElementById("container"), "atd"]
        : [document.body, ""];
}

let checkWp = () => {
    return window.location.hostname.indexOf("wikipedia") >= 0
        ? [document.getElementById("content"), "wp"]
        : [document.body, ""];
}

let determinePage = () => {
    let [root, site] = [document.body, ""];

    if (site === "") [root, site] = checkMedium();
    if (site === "") [root, site] = checkAtd();
    if (site === "") [root, site] = checkWp();

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
 
let createUI = (root) => {
    changeFont(0);

    let tags = selectContentTags(root);

    let readElem = document.createElement("div")
    document.body.appendChild(readElem);
    document.body.style = "overflow: hidden; height: 100vh; font-size: 18px;";
    readElem.id = "readerroot";
    readElem.className = "readerroot";
    readElem.setAttribute("data-fi", "2");
    
    readElem.innerHTML = `
        <div id="readerheader" class="readerhf">
            <span class="rdbl">RDBL</span>
            <span>
                <span class="fns">
                    <a href="#" class="dec" data-size="dec">A</a><a href="#" class="inc" data-size="inc">A</a>
                </span>
                <span class="colw">
                    <a href="#" class="cws" data-width="640">S</a><a href="#" class="cwm" data-width="800">M</a><a href="#" class="cwl" data-width="960">L</a>
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
    let headerElem = readElem.querySelector("#readerheader");
    let contentElem = readElem.querySelector("#readercontent");

    let fsizes = [12, 16, 18, 22, 24];
    headerElem.querySelectorAll(".fns > *").forEach((a) => {
        a.addEventListener("click", (evt) => {
            let id = a.getAttribute("data-size");
            let idx = readElem.getAttribute("data-fi") ?? 2;
            if(id === "inc" && idx < 4) {
                idx++;
                readElem.style.fontSize = fsizes[idx] + "px";
            }
            else if(id === "dec" && idx > 0) {
                idx--;
                readElem.style.fontSize = fsizes[idx] + "px";
            }

            readElem.setAttribute("data-fi", idx);
            evt.preventDefault();
            return false;
        });
    });

    headerElem.querySelectorAll(".colw > *").forEach((a) => {
        a.addEventListener("click", (evt) => {
            headerElem.style.maxWidth = a.getAttribute("data-width") + "px";
            contentElem.style.maxWidth = a.getAttribute("data-width") + "px";

            evt.preventDefault();
            return false;
        });
    });

    headerElem.querySelectorAll(".ld > *").forEach((a) => {
        a.addEventListener("click", (evt) => {
            if(a.innerText.toLowerCase() === "dark") {
                readElem.classList.add("dark");
            }
            else {
                readElem.classList.remove("dark");
            }

            evt.preventDefault();
            return false;
        });
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
    return readElem;
}

let readit = () => {
    let [root, site] = determinePage();
    let readroot = createUI(root);

    pageSpecificStuff(readroot, site);
}
readit();