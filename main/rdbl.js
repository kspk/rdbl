/**
 * @file rdbl.js
 * Main content script loaded into the dom and creates the new rdbl elements
 */

import { getPageHandler } from "./page-handlers.js";
import { selectContentTags } from "./tags.js";

/**
 * @function updateClasses updates the class list of an element
 * 
 * @param {DOMElement} elem element whose classes are to be updated 
 * @param {string} addClass classe to add to the classList 
 * @param {Array} removeClass classes to remove from the classList
 */
let updateClasses = (elem, addClass, removeClass) => {
    elem.classList.remove(...removeClass);
    elem.classList.add(addClass);
}

/**
 * @function changeWidth udpate the width of the reader page
 * 
 * @param {DOMElement} rdblElem element for the reader page
 * @param {string} widthClass class for reader page element to update width
 */
let changeWidth = (rdblElem, widthClass) => {
    updateClasses(rdblElem, widthClass, ["sml", "med", "lrg"])
}

/**
 * @function changeMode update the mode of the reader page
 * 
 * @param {DOMElement} rdblElem element for the reader page
 * @param {string} modeClass class for reader page element to update light or dark mode
 */
let changeMode = (rdblElem, modeClass) => {
    updateClasses(rdblElem, modeClass, ["light", "dark"]);
}

/**
 * @function changeFontSize update the font size of the reader page
 * 
 * @param {DOMElement} rdblElem element for the reader page
 * @param {number} fntIdx font class index for reader page element to change font size
 */
let changeFontSize = (rdblElem, fntIdx) => {
    let fontClasses = ["fnt0", "fnt1", "fnt2", "fnt3", "fnt4"];
    updateClasses(rdblElem, fontClasses[fntIdx], fontClasses);
}

/**
 * @function createUI creates the main ui for the reader page, 
 * hookup event handlers, filter content tags and update reader page
 * 
 * @param {object} pageHandler handler specific to the current webpage
 */
let createUI = (pageHandler) => {
    // Get all content nodes, include any page specific special tags, and apply specific filters. 
    let nodes = selectContentTags(
        pageHandler.root, 
        pageHandler.includeTags, 
        pageHandler.filter);

    // Set up the root element for readable content, apply id and class, and append to body.
    let rdblElem = document.createElement("div")
    document.body.appendChild(rdblElem);
    rdblElem.id = "rdblroot";
    rdblElem.className = "rdblroot";
    // Do this extra attribute to set middle of the font size list. 
    // This could arguably be handled in font change logic, but just to be explicit here. 
    rdblElem.setAttribute("data-fi", "2");
    
    // Add the magic markup for creating the base element and content controls.
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

    // Define the font size handler, and attach to font anchors.
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

    // Define the page width handler, and attach to width anchors.
    let widthClick = (evt) => {
        changeWidth(rdblElem, evt.target.getAttribute("data-width"));

        evt.preventDefault();
        return false;
    };
    headerElem.querySelectorAll(".colw > *").forEach((a) => {
        a.addEventListener("click", widthClick);
    });

    // Define the mode [dark|light] handler, and attach to mode anchors. 
    // NOTE: The CSS auto adapts the page to user's selected preference of mode, 
    //       but we give users a choice to toggle as well, 
    //       because some content look better on lighter or darker backgrounds.
    let uimodeClick = (evt) => {
        changeMode(rdblElem, evt.target.innerText.toLowerCase().trim());

        evt.preventDefault();
        return false;
    };
    headerElem.querySelectorAll(".ld > *").forEach((a) => {
        a.addEventListener("click", uimodeClick);
    });

    // Now that we have layout setup, and all controls hooked up, add all selected content nodes here. 
    nodes.forEach((t) => {
        // This is the special case of recent practice of lazy loading of images, 
        // wherein, a NOSCRIPT tag sits as a sibling of IMG, and has the correct image URL. 
        // The IMG tag only has a blurred small size thumbnail, and onscroll, correct image is loaded, 
        // when the containing parent comes within the viewport. 
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

/**
 * @function rdbl main content script for reader 
 */
let rdbl = () => {
    // Get the page handler, and setup readable ui
    let ph = getPageHandler();
    let rdblroot = createUI(ph);

    // Call any page specific post render processor
    ph.postrdbl(rdblroot);

    // Apply this last class to hide every other element beyond the rdbl
    updateClasses(document.body, "rdbld", []);
}
rdbl();