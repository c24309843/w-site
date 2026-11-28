
/* general */

let currentPage = null;
let currentOverlay = null;
let activeMainLink = null;
let activeSubLink = null;
let activeBottomSubLink = null;
let activePrintSubLink = null;
let activeMirrorSubLink = null;
let activePrintOverlayLink = null;
let activeWTumblrOverlayLink = null;
let o18PlantDataPromise = null;
let o18PlantAnimation = null;
let o17PlantDataPromise = null;
// Plant characters are 5px wide in the source image; the menu "o" is 8px wide
const O18_GRAPH_SCALE = 8 / 5;
let twitchPlayerLoader = null;
let sequentialImageLoading = false;
let sequentialImageQueue = [];
const appBasePath = new URL(".", document.currentScript.src).pathname;
const scrollPositions = new Map();
const overlayStates = new Map();
const mirrorImages = [
    "20251224_114358.jpg",
    "20251129_130420.jpg",
    "20251212_172744.jpg",
    "20260113_121413.jpg",
    "20260103_133520.jpg",
    "20260113_112119.jpg",
    "20260116_150303.jpg",
    "20251229_132203.jpg",
    "20251229_131853.jpg",
    "20251201_140952.jpg",
    "20260123_111302.jpg",
    "20251213_123014.jpg",
    "20260113_155721.jpg",
    "20251229_130328.jpg",
    "20260104_211012.jpg",
    "20251224_125401.jpg",
    "20251129_130441.jpg",
    "20260120_153935.jpg",
    "20251212_170746.jpg",
    "20250918_184414.jpg",
    "20251209_153858.jpg",
    "20251224_114834.jpg",
    "20251123_113154.jpg",
    "20251228_135902.jpg",
    "20251215_215514 (1).jpg",
    "20251208_140551.jpg",
    "20260105_115907.jpg",
    "20251227_162033.jpg",
    "20250916_172331.jpg",
    "20260116_131353.jpg",
    "20251213_125321.jpg",
    "20251215_153601.jpg",
    "20260103_133447.jpg",
    "20251226_163008.jpg",
    "20251129_160345.jpg",
    "20251229_125315.jpg",
    "20251129_141835.jpg",
    "20260113_162452.jpg",
    "20260103_133207.jpg",
    "20251227_141320.jpg",
    "20251226_170305.jpg",
    "20251229_123406.jpg",
    "20251123_114539.jpg",
    "20260120_131933.jpg",
    "20251224_132316.jpg",
    "20250918_184401.jpg",
    "20251224_122616.jpg",
    "20260122_145156.jpg",
    "20251215_160606 (1).jpg"
];
const mirrorImageSketch = [
    "       ....         .....       ...",
    "     .......      .........   ........",
    "     .......      ........     ........",
    "     .......      .........    ........   ....",
    "      ......       .......      .......  ......",
    "         ...          ...         .... ........",
    "           .           ..           .. ........",
    "            .          .             .  .......",
    "            ..    ......            .    ....",
    "            ..   ..   .        .    .     .",
    "            .        .          ....      .",
    "   ....  ......       .  ...       .      .",
    "   .     ..    .      ...          .     ..",
    "        ..           ..            .     .",
    "       ..       ...  .             .     .",
    "       ..     ...   ..     .....  .      .. ...",
    "        .           ..    .     ...       .",
    "  .. .....          ..         .. .       .",
    " ..      ...        ..         ..          .",
    "         .          ..          .     ......",
    "          ..        .   ...     ..   ..   ..",
    "         ...        ...          .         .",
    "         .         ..            .         .",
    "         .       ..              .       .....",
    "   .    ..       .         .    .      ..",
    "   ......        .         .....       ..",
    "   ..  ..    .......           ..       ..",
    "        .    .     ..           ..       .",
    "        ..          .            ..        .",
    " ...     ..          ..           ..    .....     ..",
    "    .. . ..            .    ...... ..        .. ..",
    "       .....          ..          ...        ...",
    "         ....     .........        .. ...    ..",
    "            ..  . .   .             .        ..",
    "            ...      ..             .        .",
    "           .. .      ..             .        ..",
    "            ..       ...            .        . ......",
    "          .... . .... ...     .    . ..... ... .. ..."
];
const o5TextOptions = ["gnome ...", "yyyyyyyyyyyyyy", "chome."];
const eroticsTextOptions = [
    "not yet\n:::::::::::::::::::::",
    "but i have many unrealized ideas for erotics\n:::::::::::::::::::::",
    "if you want to collab, please contact me\n:::::::::::::::::::::"
];

function startSequentialImageLoading(root = document) {
    const images = Array.from(root.querySelectorAll("img[data-sequential-src]"));

    images.forEach((image) => {
        if (!sequentialImageQueue.includes(image)) {
            sequentialImageQueue.push(image);
        }
    });

    if (sequentialImageLoading) {
        return;
    }

    sequentialImageLoading = true;

    const loadNext = () => {
        let image = sequentialImageQueue.shift();

        while (image && (!image.isConnected || image.src)) {
            image = sequentialImageQueue.shift();
        }

        if (!image) {
            sequentialImageLoading = false;
            // Dispatch event when all sequential images are loaded
            window.dispatchEvent(new CustomEvent("sequentialImagesLoaded"));
            return;
        }

        const onLoaded = () => {
            image.classList.remove("sequential-image-loading");
            loadNext();
        };

        image.addEventListener("load", onLoaded, { once: true });
        image.addEventListener("error", onLoaded, { once: true });
        image.src = image.dataset.sequentialSrc;
    };

    loadNext();
}

function restoreMirrorOverlayStates(content) {
    // Restore mirror overlay states
    requestAnimationFrame(() => {
        content.querySelectorAll(".mirror-item").forEach((item) => {
            const filename = item.dataset.imageFilename;
            const description = item.querySelector(".image-description");
            const savedState = overlayStates.get(filename);
            
            if (description && savedState && savedState.type === "mirror") {
                const revealedLines = savedState.revealedLines || 0;
                description.dataset.revealedLines = String(revealedLines);
                
                // Restore visible lines
                const lines = item.querySelectorAll(".mirror-image-overlay-line");
                for (let i = 0; i < revealedLines && i < lines.length; i++) {
                    const lineIndex = lines.length - i - 1;
                    if (lineIndex >= 0) {
                        lines[lineIndex].hidden = false;
                    }
                }
            }
        });
    });
}

function restorePrintOverlayStates(content) {
    // Restore print overlay states
    requestAnimationFrame(() => {
        content.querySelectorAll(".print-item").forEach((item) => {
            const filename = item.dataset.imageFilename;
            const savedState = overlayStates.get(filename);
            
            if (savedState && savedState.type === "print" && savedState.duplicateCount > 0) {
                const firstDescription = item.querySelector(".image-description");
                if (firstDescription) {
                    // Recreate the duplicates that existed before
                    for (let i = 0; i < savedState.duplicateCount; i++) {
                        const duplicate = firstDescription.cloneNode(true);
                        duplicate.classList.remove("flash-red");
                        firstDescription.insertAdjacentElement("afterend", duplicate);
                    }
                    updatePrintDescriptionEndings(item);
                }
            }
        });
    });
}

function saveOverlayStatesToStorage() {
    // Convert Map to object for JSON serialization
    const stateObj = {};
    overlayStates.forEach((value, key) => {
        stateObj[key] = value;
    });
    try {
        localStorage.setItem("overlayInteractionStates", JSON.stringify(stateObj));
    } catch (e) {
        console.warn("Failed to save overlay states to localStorage:", e);
    }
}

function loadOverlayStatesFromStorage() {
    try {
        const stored = localStorage.getItem("overlayInteractionStates");
        if (stored) {
            const stateObj = JSON.parse(stored);
            Object.entries(stateObj).forEach(([key, value]) => {
                overlayStates.set(key, value);
            });
        }
    } catch (e) {
        console.warn("Failed to load overlay states from localStorage:", e);
    }
}

function saveOverlayState(filename, state) {
    overlayStates.set(filename, state);
    saveOverlayStatesToStorage();
}

function restoreScrollAfterLoading(content, page, savedScroll) {
    if (savedScroll === undefined) {
        return;
    }

    const restoreScroll = () => {
        // The page scrolls on the window, not on the content element
        window.scrollTo(0, savedScroll);
    };

    // For pages with sequential images, wait for images to load
    if (["w", "sd", "side-mirror"].includes(page)) {
        // Multiple attempts to restore scroll at different times
        // This handles various timing scenarios (cached images, slow loading, etc.)
        setTimeout(restoreScroll, 10);
        setTimeout(restoreScroll, 50);
        setTimeout(restoreScroll, 100);
        
        // Also listen for the event when images finish loading
        const handleImagesLoaded = () => {
            // After images load, restore the scroll position
            restoreScroll();
        };
        
        // Add listener with a small delay to ensure it's registered before event fires
        setTimeout(() => {
            window.addEventListener("sequentialImagesLoaded", handleImagesLoaded, { once: true });
        }, 0);
    } else {
        // For pages without images, restore with small delay
        setTimeout(restoreScroll, 50);
    }
}

function cycleEroticsText(element) {
    const nextIndex = (Number(element.dataset.index) + 1) % eroticsTextOptions.length;
    element.classList.remove("flash-red");
    void element.offsetWidth;
    element.classList.add("flash-red");
    element.dataset.index = String(nextIndex);
    element.textContent = eroticsTextOptions[nextIndex];
}

function syncMobileViewport() {
    const viewport = window.visualViewport;

    if (!viewport) {
        return;
    }

    const centerX = viewport.offsetLeft + (viewport.width / 2);
    const centerY = viewport.offsetTop + (viewport.height / 2);

    document.documentElement.style.setProperty("--viewport-center-x", `${centerX}px`);
    document.documentElement.style.setProperty("--viewport-center-y", `${centerY}px`);
    document.documentElement.style.setProperty("--viewport-offset-x", `${viewport.offsetLeft}px`);
    document.documentElement.style.setProperty("--viewport-offset-y", `${viewport.offsetTop}px`);
    document.documentElement.style.setProperty("--viewport-width", `${viewport.width}px`);
    document.documentElement.style.setProperty("--viewport-right", `${viewport.offsetLeft + viewport.width}px`);

}

if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", syncMobileViewport);
    window.visualViewport.addEventListener("scroll", syncMobileViewport);
}

window.addEventListener("resize", syncMobileViewport);
window.addEventListener("orientationchange", syncMobileViewport);
window.addEventListener("scroll", syncMobileViewport, { passive: true });

syncMobileViewport();


function togglePrintText(link) {
    if (link.dataset.originalText === undefined) {
        link.dataset.originalText = link.innerHTML;
        link.style.width = `${link.getBoundingClientRect().width}px`;
    }
    if (link.dataset.altText === undefined) {
        link.dataset.altText = `
                oooooooo------------cks.<br>
                ooooooooooooooonow.<br>
                coc..ooooooooooooook<br>
                oooooooooo-------ck fuck`;
    }
    if (link.dataset.thirdText === undefined) {
        link.dataset.thirdText = `
                yyyyyyyyyyyyyy------cks.<br>
                yyyyyyyyyyyyyyyyyyyyw.<br>
                cyyyyyyyyyyyyyyyyyyyyk<br>
                yyyyyyyyyyyyyyyyyyyck fuck`;
    }

    const textOptions = [
        link.dataset.originalText,
        link.dataset.altText,
        link.dataset.thirdText
    ];
    const currentIndex = Number(link.dataset.graphIndex || 0);
    const nextIndex = (currentIndex + 1) % textOptions.length;
    link.classList.remove("flash-red");
    void link.offsetWidth;
    link.classList.add("flash-red");
    link.innerHTML = textOptions[nextIndex];
    link.dataset.graphIndex = String(nextIndex);
}


function renderO5Text(text, index) {
    text.textContent = `${o5TextOptions[index]}\n${":".repeat(60)}`;
    text.dataset.graphIndex = String(index);
}


function toggleO5Text(text) {
    const currentIndex = Number(text.dataset.graphIndex || 0);
    renderO5Text(text, (currentIndex + 1) % o5TextOptions.length);
}


function clearPrintSubcategory() {
    closePrintTumblrOverlay();

    if (activePrintSubLink) {
        activePrintSubLink.classList.remove("active");
        activePrintSubLink = null;
    }

    document.getElementById("print-sub-nav").hidden = true;
}


function showPrintSubcategory(category, link, updateUrl = true) {
    if (currentPage !== "sd") {
        return;
    }

    closePrintTumblrOverlay();

    if (activePrintSubLink === link) {
        // Save current subcategory scroll position before closing
        const content = document.getElementById("content");
        if (activePrintSubLink) {
            const subcategoryKey = `sd-${activePrintSubLink.id.replace('print-', '')}`;
            scrollPositions.set(subcategoryKey, content.scrollTop);
            // Save overlay states before closing
            saveOverlayStatesToStorage();
        }

        activePrintSubLink.classList.remove("active");
        activePrintSubLink = null;
        content.innerHTML = "";

        if (updateUrl) {
            updatePageUrl("sd");
        }
        return;
    }

    const content = document.getElementById("content");

    // Save current subcategory scroll position before switching
    if (activePrintSubLink) {
        const subcategoryKey = `sd-${activePrintSubLink.id.replace('print-', '')}`;
        scrollPositions.set(subcategoryKey, content.scrollTop);
        // Save overlay states before switching
        saveOverlayStatesToStorage();
    }

    if (activePrintSubLink) {
        activePrintSubLink.classList.remove("active");
    }

    activePrintSubLink = link;
    activePrintSubLink.classList.add("active");

    if (category === "lohne") {
        content.innerHTML = renderLohneContent();
        startSequentialImageLoading(content);
        // Restore print overlay states
        restorePrintOverlayStates(content);
    } else {
        content.innerHTML = "";
    }

    // Restore subcategory scroll position
    const subcategoryKey = `sd-${category}`;
    const savedScroll = scrollPositions.get(subcategoryKey);
    restoreScrollAfterLoading(content, "sd", savedScroll);

    if (updateUrl) {
        updatePageUrl(`sd/${category}`);
    }
}

function clearMirrorSubcategory() {
    if (activeMirrorSubLink) {
        activeMirrorSubLink.classList.remove("active");
        activeMirrorSubLink = null;
    }

    document.getElementById("mirror-sub-nav").hidden = true;
}

function showMirrorSubcategory(category, link, updateUrl = true) {
    if (currentPage !== "side-mirror") {
        return;
    }

    const content = document.getElementById("content");
    const wasActive = activeMirrorSubLink === link;
    if (activeMirrorSubLink) {
        scrollPositions.set(`side-mirror-${activeMirrorSubLink.id.slice("mirror-".length)}`, window.scrollY);
        activeMirrorSubLink.classList.remove("active");
    }

    activeMirrorSubLink = wasActive ? null : link;
    content.innerHTML = "";

    if (activeMirrorSubLink) {
        activeMirrorSubLink.classList.add("active");
        if (category === "1") {
            content.innerHTML = renderMirrorContent();
            startSequentialImageLoading(content);
            restoreMirrorOverlayStates(content);
        }
        restoreScrollAfterLoading(content, "side-mirror", scrollPositions.get(`side-mirror-${category}`));
    }

    if (updateUrl) {
        updatePageUrl(wasActive ? "side-mirror" : `side-mirror/${category}`);
    }
}

function renderPrintTumblrPost() {
    return renderTumblrPost(
        "https://embed.tumblr.com/embed/post/t:GBq4BHiVEj-zFU_vhdq0nA/812469883359084544/v2",
        "Tumblr print post",
        700
    );
}

function renderWTumblrPost() {
    return renderTumblrPost(
        "https://embed.tumblr.com/embed/post/t:GBq4BHiVEj-zFU_vhdq0nA/811620224681050112/v2",
        "Tumblr W post",
        580
    );
}

function renderTumblrPost(src, title, height) {
    return `
<div class="tumblr-post-container">
    <iframe
        class="tumblr-embed"
        src="${src}"
        width="540"
        height="${height}"
        frameborder="0"
        title="${title}">
    </iframe>
</div>`;
}

function togglePrintTumblrOverlay(link, updateUrl = true) {
    if (currentPage !== "sd" || !activePrintSubLink) {
        return;
    }

    const subcategory = activePrintSubLink.id.slice("print-".length);
    if (activePrintOverlayLink === link) {
        closePrintTumblrOverlay();
        if (updateUrl) {
            updatePageUrl(`sd/${subcategory}`);
        }
        return;
    }

    closePrintTumblrOverlay();
    activePrintOverlayLink = link;
    activePrintOverlayLink.classList.add("active");

    const overlay = document.getElementById("print-tumblr-overlay");
    overlay.innerHTML = renderPrintTumblrPost();
    overlay.hidden = false;
    overlay.onclick = (event) => {
        if (event.target !== overlay) {
            return;
        }

        const activeSubcategory = activePrintSubLink?.id.slice("print-".length);
        closePrintTumblrOverlay();
        if (activeSubcategory) {
            updatePageUrl(`sd/${activeSubcategory}`);
        }
    };

    if (updateUrl) {
        updatePageUrl(`sd/${subcategory}/o`);
    }
}

function closePrintTumblrOverlay() {
    const overlay = document.getElementById("print-tumblr-overlay");
    if (overlay) {
        overlay.hidden = true;
        overlay.innerHTML = "";
    }

    if (activePrintOverlayLink) {
        activePrintOverlayLink.classList.remove("active");
        activePrintOverlayLink = null;
    }
}

function toggleWTumblrOverlay(link, updateUrl = true) {
    if (currentPage !== "w") {
        return;
    }

    if (activeWTumblrOverlayLink === link) {
        closeWTumblrOverlay();
        if (updateUrl) {
            updatePageUrl("w");
        }
        return;
    }

    closeWTumblrOverlay();
    activeWTumblrOverlayLink = link;
    activeWTumblrOverlayLink.classList.add("active");

    const overlay = document.getElementById("w-tumblr-overlay");
    overlay.innerHTML = renderWTumblrPost();
    overlay.hidden = false;
    overlay.onclick = (event) => {
        if (event.target !== overlay) {
            return;
        }

        closeWTumblrOverlay();
        updatePageUrl("w");
    };

    if (updateUrl) {
        updatePageUrl("w/o");
    }
}

function closeWTumblrOverlay() {
    const overlay = document.getElementById("w-tumblr-overlay");
    if (overlay) {
        overlay.hidden = true;
        overlay.innerHTML = "";
    }

    if (activeWTumblrOverlayLink) {
        activeWTumblrOverlayLink.classList.remove("active");
        activeWTumblrOverlayLink = null;
    }
}

function updatePrintDescriptionEndings(item) {
    const descriptions = item.querySelectorAll(".image-description");
    const milestoneEndings = ["c:::", "o:::", "c:::", "k:::"];
    descriptions.forEach((text, index) => {
        text.querySelector(".image-description-last-line").textContent =
            milestoneEndings[index - 24] || ":::::";
    });
}

function duplicatePrintDescription(description) {
    const item = description.parentElement;
    const duplicate = description.cloneNode(true);
    duplicate.classList.remove("flash-red");
    description.insertAdjacentElement("afterend", duplicate);

    updatePrintDescriptionEndings(item);
    const descriptions = item.querySelectorAll(".image-description");
    descriptions.forEach((text) => text.classList.remove("flash-red"));
    void description.offsetWidth;
    descriptions.forEach((text) => text.classList.add("flash-red"));
    
    // Save overlay state for prints
    const filename = item.dataset.imageFilename;
    if (filename) {
        saveOverlayState(filename, {
            duplicateCount: descriptions.length - 1,
            type: "print"
        });
    }
}

function duplicateImageDescription(description) {
    const item = description.parentElement;
    const duplicate = description.cloneNode(true);
    duplicate.classList.remove("flash-red");
    description.insertAdjacentElement("afterend", duplicate);

    const descriptions = item.querySelectorAll(".image-description");
    const milestoneEndings = ["c:::", "o:::", "c:::", "k:::"];
    descriptions.forEach((text, index) => {
        text.querySelector(".image-description-last-line").textContent =
            milestoneEndings[index - 24] || ":::::";
    });
    descriptions.forEach((text) => text.classList.remove("flash-red"));
    void description.offsetWidth;
    descriptions.forEach((text) => text.classList.add("flash-red"));
}

function revealMirrorImageLine(description) {
    const item = description.closest(".mirror-item");
    const lines = item.querySelectorAll(".mirror-image-overlay-line");
    const revealedLines = Number(description.dataset.revealedLines || 0);
    const nextLineIndex = lines.length - revealedLines - 1;

    description.classList.remove("flash-red");
    void description.offsetWidth;
    description.classList.add("flash-red");

    if (nextLineIndex < 0) {
        return;
    }

    const line = lines[nextLineIndex];
    line.hidden = false;
    line.classList.remove("flash-red");
    void line.offsetWidth;
    line.classList.add("flash-red");
    description.dataset.revealedLines = String(revealedLines + 1);
    
    // Save overlay state for mirror
    const filename = item.dataset.imageFilename;
    if (filename) {
        saveOverlayState(filename, {
            revealedLines: revealedLines + 1,
            type: "mirror"
        });
    }
}

function renderImageDescription(onClick = "duplicateImageDescription(this)") {
    return `
<button type="button" class="image-description" onclick="${onClick}">
    :::::<br>
    :::::<br>
    :::::<br>
    :::::<br>
    :::::<br>
    <span class="image-description-last-line">:::::</span>
</button>`;
}


function renderLohneContent() {
    const printImage = (filename) =>
        `${appBasePath}pic/print/${encodeURIComponent(filename)}`;

    return `
<div class="print-item" data-image-filename="Scan_20260119 (2).jpg">
    <a href="${printImage("Scan_20260119 (2).jpg")}" target="_blank">
        <img data-sequential-src="${printImage("Scan_20260119 (2).jpg")}" width="1251" height="1807" class="sequential-image-loading">
    </a>
    ${renderImageDescription("duplicatePrintDescription(this)")}
</div>

<div class="print-item" data-image-filename="Scan_20260119.jpg">
    <a href="${printImage("Scan_20260119.jpg")}" target="_blank">
        <img data-sequential-src="${printImage("Scan_20260119.jpg")}" width="3327" height="2125" class="sequential-image-loading">
    </a>
    ${renderImageDescription("duplicatePrintDescription(this)")}
</div>

<div class="print-item" data-image-filename="Scan_20260119 (20).jpg">
    <a href="${printImage("Scan_20260119 (20).jpg")}" target="_blank">
        <img data-sequential-src="${printImage("Scan_20260119 (20).jpg")}" width="3252" height="2112" class="sequential-image-loading">
    </a>
    ${renderImageDescription("duplicatePrintDescription(this)")}
</div>

<a id="print-text" class="graph-text" href="#" onclick="togglePrintText(this); return false;">
    abo--------------------------cks.<br>
    gnow gnow gnow gnow.<br>
    coc.........................fuck<br>
    nig-----------------------ck fuck
</a>
`;
}

function renderMirrorContent() {
    const mirrorImage = (filename) =>
        `${appBasePath}pic/mirror/left1/${encodeURIComponent(filename)}`;

    const shuffledMirrorImages = [...mirrorImages];
    for (let index = shuffledMirrorImages.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [shuffledMirrorImages[index], shuffledMirrorImages[randomIndex]] =
            [shuffledMirrorImages[randomIndex], shuffledMirrorImages[index]];
    }

    return shuffledMirrorImages.map((filename) => {
        const image = mirrorImage(filename);
        return `
<div class="mirror-item" data-image-filename="${filename}">
    <div class="mirror-image-link">
        <img data-sequential-src="${image}" width="600" decoding="async" class="sequential-image-loading">
        <div class="mirror-image-overlay" aria-hidden="true">
            ${mirrorImageSketch.map((line) => `<span class="mirror-image-overlay-line" hidden>${line.replace(/\./g, "o")}</span>`).join("")}
        </div>
    </div>
    ${renderImageDescription("revealMirrorImageLine(this)")}
</div>`;
    }).join("");
}

function renderWContent() {
    const wImages = [
        "20250601_210641.jpg",
        "20250329_001636.jpg",
        "P1322318 (1).JPG",
        "20250518_195425.jpg",
        "20240509_234712.jpg",
        "20240605_013611.jpg",
        "20240605_014712.jpg",
        "20240422_002550.jpg",
        "20240425_230426.jpg",
        "20240605_012735.jpg",
        "20240608_223025.jpg",
        "20240725_232142.jpg",
        "20241121_022416.jpg",
        "20250211_214418.jpg",
        "20250220_215338.jpg",
        "20250220_223023.jpg",
        "20250314_213700.jpg",
        "20250314_225400.jpg",
        "20250405_022816.jpg",
        "20250409_223136.jpg",
        "20250428_001046.jpg",
        "20250504_001335.jpg",
        "20250506_232944.jpg",
        "20250507_004140.jpg",
        "20250518_233200.jpg",
        "20250525_220553.jpg",
        "20250601_210220.jpg",
        "20250602_000623.jpg",
        "20250609_014849.jpg",
        "20250609_014852.jpg",
        "20250609_041050.jpg",
        "20250616_212118.jpg",
        "20250622_211727.jpg",
        "20250806_110341.jpg",
        "20250526_010739.jpg",
        "20260111_192024.jpg"
    ];
    const wImage = (filename) =>
        `${appBasePath}pic/w/${filename.split("/").map(encodeURIComponent).join("/")}`;
    
    // Map filename to special features (overlays, accents, grids)
    const wImageSpecialFeatures = new Map([
        // Flower overlay
        ["20250329_001636.jpg", { flowerOverlay: true }],
        // O number overlay
        ["20250518_195425.jpg", { oNumberOverlay: true }],
        // Three O accents that move down and left
        ["P1322318 (1).JPG", { threeOAccent: true, accentPosition: "center-right", threeMovingOs: true }],
        ["20240605_014712.jpg", { threeOAccent: true, threeMovingOs: true }],
        ["20250211_214418.jpg", { threeOAccent: true, accentPosition: "center-right", threeMovingOs: true }],
        ["20250220_223023.jpg", { threeOAccent: true, threeMovingOs: true }],
        ["20250314_225400.jpg", { threeOAccent: true, accentPosition: "center-right", threeMovingOs: true }],
        ["20250314_213700.jpg", { threeOAccent: true, threeMovingOs: true }],
        ["20250405_022816.jpg", { threeOAccent: true, threeMovingOs: true }],
        ["20250409_223136.jpg", { threeOAccent: true, threeMovingOs: true }],
        ["20250428_001046.jpg", { threeOAccent: true, threeMovingOs: true }],
        ["20250507_004140.jpg", { threeOAccent: true, threeMovingOs: true }],
        ["20250518_233200.jpg", { threeOAccent: true, threeMovingOs: true }],
        ["20250601_210220.jpg", { threeOAccent: true, threeMovingOs: true }],
        ["20250601_210641.jpg", { threeOAccent: true, threeMovingOs: true }],
        // Circle of o's that drifts down and re-enters from the top
        ["20240422_002550.jpg", { movingCircle: true }],
        ["20250622_211727.jpg", { threeOAccent: true, accentPosition: "right", singleMovingO: true }],
        ["20250616_212118.jpg", { threeOAccent: true, threeMovingOs: true }],
        // Three moving o's on last image
        ["20260111_192024.jpg", { threeMovingOs: true }]
    ]);
    const wImageOneBorder = (thickness) => {
        const horizontal = Array.from(
            { length: thickness },
            () => "1 ".repeat(60)
        ).join("\n");
        const vertical = `${Array.from({ length: thickness }, () => "1").join(" ")}\n`.repeat(100);
        const borderClass = thickness > 1 ? ` thick thick-${thickness}` : "";

        return `<span class="w-image-one-border${borderClass}" aria-hidden="true"><span class="top">${horizontal}</span><span class="right">${vertical}</span><span class="bottom">${horizontal}</span><span class="left">${vertical}</span></span>`;
    };
    const wImageSymbolBorder = (
        symbol,
        bottomRows = 1,
        withThreeOAccent = false,
        accentPosition,
        withMovingOAccent = false,
        withSingleMovingO = false,
        withThreeMovingOs = false,
        withCircle = false
    ) => {
        const horizontal = `${symbol} `.repeat(60);
        const vertical = `${symbol}\n`.repeat(100);
        const bottom = Array.from({ length: bottomRows }, () => horizontal).join("\n");
        const borderClass = bottomRows > 1 ? " bottom-heavy" : "";
        const threeOs = "<span>o</span><span>o</span><span>o</span>";
        const accentClass = `symbol-accent${accentPosition ? ` symbol-accent--${accentPosition}` : ""}${withMovingOAccent ? " symbol-accent--moving" : ""}${withSingleMovingO ? " symbol-accent--single-moving" : ""}${withThreeMovingOs ? " symbol-accent--triple-moving" : ""}`;
        const threeOAccent = (withThreeOAccent || withThreeMovingOs)
            ? `<span class="${accentClass}">${withSingleMovingO ? "<span>o</span>" : threeOs}</span>`
            : "";
        return `<span class="w-image-one-border w-image-symbol-border${borderClass}" aria-hidden="true">${threeOAccent}${withCircle ? wCircleMarkup() : ""}<span class="top">${horizontal}</span><span class="right">${vertical}</span><span class="bottom">${bottom}</span><span class="left">${vertical}</span></span>`;
    };

    return wImages.map((filename, index) => {
        const image = `<img data-sequential-src="${wImage(filename)}" width="600" class="sequential-image-loading">`;
        const features = wImageSpecialFeatures.get(filename) || {};
        const isFlowerOverlay = features.flowerOverlay || false;
        const isONumberOverlay = features.oNumberOverlay || false;
        const isSecondImage = filename === "P1322318 (1).JPG";
        const hasThreeOAccent = features.threeOAccent || false;
        const hasSingleMovingO = features.singleMovingO || false;
        const hasThreeMovingOs = features.threeMovingOs || false;
        const hasMovingOAccent = hasSingleMovingO || hasThreeMovingOs;
        const withSingleMovingO = hasSingleMovingO;
        const withThreeMovingOs = hasThreeMovingOs;
        const accentPosition = features.accentPosition || null;
        const isNumberOutline = !isFlowerOverlay && !isONumberOverlay;
        const hasOverlay = isFlowerOverlay || isONumberOverlay || isSecondImage || isNumberOutline;
        const overlayMarkup = isFlowerOverlay
            ? `<div class="w-image-ones" data-mode="fill" aria-hidden="true"
        onclick="toggleWImageFromText(this)">
    <span class="w-image-overlay-fill" aria-hidden="true">${"❀ ".repeat(2500)}</span>
    ${wImageOneBorder(1)}
</div>`
            : isONumberOverlay
                ? `<div class="w-image-ones" data-mode="fill" aria-hidden="true"
        onclick="toggleWImageFromText(this)">
    <span class="w-image-overlay-fill" aria-hidden="true">${"o ".repeat(2500)}</span>
    ${wImageOneBorder(2)}
 </div>`
                : isSecondImage
                    ? `<div class="w-image-ones show-one-border"
        onclick="toggleWImageFromText(this)"
        data-symbol="1" data-base-symbol="1" data-alt-symbol="o" aria-hidden="true">
    ${wImageSymbolBorder(
        "1",
        5,
        hasThreeOAccent,
        accentPosition,
        false,
        withSingleMovingO,
        withThreeMovingOs
    )}
 </div>`
                    : isNumberOutline
        ? `<div class="w-image-ones show-one-border"
        onclick="toggleWImageFromText(this)"
        data-symbol="1" data-base-symbol="1" data-alt-symbol="o" aria-hidden="true">
    ${wImageSymbolBorder(
        "1",
        1,
        hasThreeOAccent,
        accentPosition,
        hasMovingOAccent,
        withSingleMovingO,
        withThreeMovingOs,
        features.movingCircle || false
    )}
 </div>`
                        : "";
        const imageMarkup = hasOverlay
            ? `<div class="w-image-covered${isFlowerOverlay ? " w-image-covered-flowers" : ""}">
    ${image}
    ${overlayMarkup}
</div>`
            : image;

        const outlinePost = index === 2 ? `
<div class="w-item" data-image-filename="w-o-outline">
    <div class="w-image-covered w-image-covered-empty">
        <div class="w-image-ones show-one-border" data-mode="border" aria-hidden="true"
            onclick="toggleWImageFromText(this)">
            <span class="w-image-overlay-fill" aria-hidden="true">${"o ".repeat(2500)}</span>
            ${wImageSymbolBorder("o")}
        </div>
    </div>
    ${renderImageDescription("toggleWImageFromDescription(this)")}
</div>` : "";

        const shortOutlinePost = index === 23 ? `
<div class="w-item" data-image-filename="w-o-outline-short">
    <div class="w-image-covered w-image-covered-empty w-image-covered-short">
        <div class="w-image-ones show-one-border" data-mode="border" aria-hidden="true"
            onclick="toggleWImageFromText(this)">
            <span class="w-image-overlay-fill" aria-hidden="true">${"o ".repeat(2500)}</span>
            ${wImageSymbolBorder("o")}
        </div>
    </div>
    ${renderImageDescription("toggleWImageFromDescription(this)")}
</div>` : "";

        const eightRowPost = index === 11 ? `
<div class="w-item" data-image-filename="w-o-outline-8-rows">
    <div class="w-image-covered w-image-covered-empty w-image-covered-eight-rows">
        <div class="w-image-ones show-one-border" data-mode="border" aria-hidden="true"
            onclick="toggleWImageFromText(this)">
            <span class="w-image-overlay-fill" aria-hidden="true">${"o ".repeat(2500)}</span>
            ${wImageSymbolBorder("o")}
        </div>
    </div>
    ${renderImageDescription("toggleWImageFromDescription(this)")}
</div>` : "";

        return `
<div class="w-item" data-image-number="${index + 1}" data-image-filename="${filename}">
    ${imageMarkup}
    ${renderImageDescription("toggleWImageFromDescription(this)")}
    </div>${eightRowPost}${outlinePost}${shortOutlinePost}`;
    }).join("");
}

function toggleWImageFromDescription(description) {
    const overlay = description.parentElement.querySelector(".w-image-ones");
    toggleWImageFromText(overlay);
}

function wCircleMarkup() {
    const size = 18;
    const center = (size - 1) / 2;
    const half = size % 2 ? 0 : 0.5;
    const cells = new Set();
    // Midpoint-style circle: walk the flatter arcs along one axis so every step adds exactly one cell
    const limit = center / Math.SQRT2;
    for (let along = 0; along < size; along++) {
        const offset = along - center;
        if (Math.abs(offset) > limit) {
            continue;
        }
        const across = Math.round(Math.sqrt(center * center - offset * offset) - half) + half;
        for (const sign of [-1, 1]) {
            const other = Math.round(center + sign * across);
            cells.add(`${other},${along}`);
            cells.add(`${along},${other}`);
        }
    }
    const markup = [...cells].map((cell) => {
        const [row, col] = cell.split(",").map(Number);
        return `<i style="grid-area:${row + 1}/${col + 1}">o</i>`;
    }).join("");
    return `<span class="symbol-circle-clip"><span class="symbol-circle" data-line="0">${markup}</span></span>`;
}

// The circle is 18x18 square cells. Its centre starts 11 cells from the picture's right edge and 13 cells
// from its top. It drifts down one row per click and left one column every
// 3 rows, and re-enters from the top at its starting column.
function setWCircleLine(circle, line) {
    const size = 18;
    const clip = circle.parentElement;
    const lineHeight = parseFloat(getComputedStyle(clip).fontSize) * 1.15;
    const rows = Math.max(1, Math.round(clip.clientHeight / lineHeight));
    const cols = Math.max(size, Math.round(clip.clientWidth / lineHeight));
    const cycle = rows + size;
    const startRow = 13 - size / 2;
    const startColumn = cols - 11 - size / 2;
    const entryOffset = startRow + size;
    const position = line + entryOffset;
    const step = position % cycle;
    const shift = position < cycle ? line : step;
    const column = startColumn - Math.floor(shift / 3);
    circle.dataset.line = String(line);
    circle.style.top = `${(step - size) * 1.15}em`;
    circle.style.left = `${column * 1.15}em`;
}

function setWMovingAccentLine(movingAccent, line) {
    if (movingAccent.classList.contains("symbol-circle")) {
        setWCircleLine(movingAccent, line);
        return;
    }
    const overlay = movingAccent.closest(".w-image-ones");
    const lineHeight = parseFloat(getComputedStyle(overlay).fontSize) * 1.15;
    const rows = Math.max(1, Math.round(overlay.clientHeight / lineHeight));
    const startRow = 6;
    // Loops like the circle: re-enters from the top at its starting column
    const cycle = rows + 1;
    const position = line + startRow + 1;
    const step = position % cycle;
    const shift = position < cycle ? line : step;
    movingAccent.dataset.line = String(line);
    movingAccent.style.top = `${(step - 1) * 1.15}em`;
    movingAccent.style.transform = `translateX(-${Math.floor(shift / 5)}em)`;
}

function toggleWImageFromText(overlay) {
    const description = overlay.closest(".w-item").querySelector(".image-description");
    description.classList.remove("flash-red");
    void description.offsetWidth;
    description.classList.add("flash-red");

    const movingAccent = overlay.querySelector(".symbol-accent--moving, .symbol-accent--single-moving, .symbol-accent--triple-moving, .symbol-circle");
    if (movingAccent) {
        const nextLine = Number(movingAccent.dataset.line || 0) + 1;
        setWMovingAccentLine(movingAccent, nextLine);
        const filename = overlay.closest(".w-item").dataset.imageFilename;
        saveOverlayState(filename, {
            ...overlayStates.get(filename),
            movingLine: nextLine
        });
    }

    if (overlay.dataset.symbol !== undefined) {
        toggleWImageSymbol(overlay);
    } else {
        toggleWImageOverlay(overlay);
    }
}

function toggleWImageOverlay(overlay) {
    if (overlay.classList.contains("flash-red")) {
        return;
    }

    const filename = overlay.closest(".w-item").dataset.imageFilename;
    const nextMode = overlay.dataset.mode === "border" ? "fill" : "border";
    saveOverlayState(filename, {
        ...overlayStates.get(filename),
        symbol: overlay.dataset.symbol,
        mode: nextMode
    });
    overlay.classList.add("flash-red");
    overlay.addEventListener("animationend", () => {
        overlay.dataset.mode = nextMode;
        overlay.classList.toggle("show-one-border", nextMode === "border");
        overlay.classList.remove("flash-red");
        
        // Save overlay state
        saveOverlayState(filename, {
            ...overlayStates.get(filename),
            symbol: overlay.dataset.symbol,
            mode: nextMode
        });
    }, { once: true });
}

function toggleWImageSymbol(overlay) {
    if (overlay.classList.contains("flash-red")) {
        return;
    }

    const filename = overlay.closest(".w-item").dataset.imageFilename;
    const nextSymbol = overlay.dataset.symbol === overlay.dataset.baseSymbol
        ? overlay.dataset.altSymbol
        : overlay.dataset.baseSymbol;
    saveOverlayState(filename, {
        ...overlayStates.get(filename),
        symbol: nextSymbol,
        mode: overlay.dataset.mode
    });
    overlay.classList.add("flash-red");
    overlay.addEventListener("animationend", () => {
        const border = overlay.querySelector(".w-image-symbol-border");
        const horizontal = `${nextSymbol} `.repeat(60);
        const vertical = `${nextSymbol}\n`.repeat(100);

        border.querySelector(".top").textContent = horizontal;
        border.querySelector(".right").textContent = vertical;
        border.querySelector(".left").textContent = vertical;
        border.querySelector(".bottom").textContent = border.classList.contains("bottom-heavy")
            ? Array.from({ length: 5 }, () => horizontal).join("\n")
            : horizontal;
        overlay.querySelectorAll(".symbol-accent")
            .forEach((accent) => {
                // Keep moving accents (single or triple) always visible
                const isMovingAccent = accent.classList.contains("symbol-accent--moving") 
                    || accent.classList.contains("symbol-accent--single-moving")
                    || accent.classList.contains("symbol-accent--triple-moving");
                // Hide non-moving accents only when symbol is not baseSymbol
                accent.hidden = !isMovingAccent && nextSymbol !== overlay.dataset.baseSymbol;
            });
        overlay.dataset.symbol = nextSymbol;
        overlay.classList.remove("flash-red");
        
        // Save overlay state
        saveOverlayState(filename, {
            ...overlayStates.get(filename),
            symbol: nextSymbol,
            mode: overlay.dataset.mode
        });
    }, { once: true });
}


function loadO18PlantData() {
    if (!o18PlantDataPromise) {
        o18PlantDataPromise = new Promise((resolve, reject) => {
            if (typeof o18PlantNodes === "undefined" || !o18PlantNodes.length) {
                reject(new Error("Plant growth data is missing."));
                return;
            }
            const image = new Image();
            image.onload = () => {
                if (image.naturalWidth !== 815 || image.naturalHeight !== 688) {
                    reject(new Error("Plant image dimensions do not match its growth data."));
                    return;
                }
                resolve({
                    image,
                    nodes: o18PlantNodes,
                    maxDepth: o18PlantNodes[o18PlantNodes.length - 1][4],
                    width: 815,
                    height: 688
                });
            };
            image.onerror = () => reject(new Error("Could not load the plant image."));
            image.src = `${appBasePath}pic/rnd/o18-plant.png`;
        }).catch((error) => {
            o18PlantDataPromise = null;
            throw error;
        });
    }

    return o18PlantDataPromise;
}

// Drawn at the same source size as the o18 image and scaled by O18_GRAPH_SCALE so the characters look identical.
// The glyph bitmaps (alpha values) are copied from the characters in o18-plant.png.
const O17_CELL_WIDTH = 6;
const O17_CELL_HEIGHT = 6;
const O17_GLYPH_ALPHA = {
    o: { dx: 0, dy: 0, rows: [[0, 0, 42, 0, 0], [63, 150, 72, 174, 15], [234, 60, 0, 111, 195], [252, 33, 0, 72, 240], [78, 150, 66, 171, 45], [0, 48, 75, 54, 0]] },
    ".": { dx: 2, dy: 4, rows: [[147, 81], [60, 9]] }
};
const O17_GLYPHS = {};
Object.entries(O17_GLYPH_ALPHA).forEach(([character, { dx, dy, rows }]) => {
    const canvas = document.createElement("canvas");
    canvas.width = rows[0].length;
    canvas.height = rows.length;
    const imageData = canvas.getContext("2d").createImageData(canvas.width, canvas.height);
    rows.forEach((line, y) => line.forEach((alpha, x) => {
        const index = (y * canvas.width + x) * 4;
        imageData.data.set([0x55, 0x1A, 0x8B, alpha], index);
    }));
    canvas.getContext("2d").putImageData(imageData, 0, 0);
    O17_GLYPHS[character] = { canvas, dx, dy };
});

function getO17PlantGeometry() {
    const rows = o17PlantArt.length;
    const columns = Math.max(...o17PlantArt.map((line) => line.length));
    const rootRow = rows - 1;
    const rootColumn = o17PlantArt[rootRow].search(/\S/);
    return {
        width: columns * O17_CELL_WIDTH,
        height: rows * O17_CELL_HEIGHT,
        anchorX: (rootColumn + 0.5) * O17_CELL_WIDTH
    };
}

// Characters that touch each other (including diagonally) grow one by one: first the tree from its root,
// then one last branch at the top right, then the surrounding groups, and finally the loose characters at once.
function buildO17PlantData() {
    const { width, height } = getO17PlantGeometry();
    const rows = o17PlantArt.length;
    const columns = Math.round(width / O17_CELL_WIDTH);
    const has = (row, column) => row >= 0 && row < rows && column >= 0
        && (o17PlantArt[row][column] || " ") !== " ";
    const neighbors = (row, column, gap = 1, allowed = () => true) => {
        const found = [];
        for (let dy = -gap; dy <= gap; dy++) {
            for (let dx = -gap; dx <= gap; dx++) {
                if ((dy || dx) && has(row + dy, column + dx) && allowed(row + dy, column + dx)) {
                    found.push([row + dy, column + dx]);
                }
            }
        }
        return found;
    };

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    context.fillStyle = "#551A8B";
    context.font = `10px "Times New Roman"`;
    context.textAlign = "center";
    context.textBaseline = "middle";

    const depths = new Map();
    const order = [];
    const key = (row, column) => `${row},${column}`;

    // Grows outward one character per depth step from the given starting characters
    const grow = (seeds, startDepth, gap = 1, allowed = () => true) => {
        const queue = [];
        seeds.forEach(([row, column]) => {
            if (!depths.has(key(row, column))) {
                depths.set(key(row, column), startDepth);
                queue.push([row, column]);
            }
        });
        for (let index = 0; index < queue.length; index++) {
            const [row, column] = queue[index];
            neighbors(row, column, gap, allowed).forEach(([nextRow, nextColumn]) => {
                if (!depths.has(key(nextRow, nextColumn))) {
                    depths.set(key(nextRow, nextColumn), depths.get(key(row, column)) + 1);
                    queue.push([nextRow, nextColumn]);
                }
            });
        }
        order.push(...queue);
        return queue.length ? depths.get(key(...queue[queue.length - 1])) : startDepth - 1;
    };
    const unvisited = () => {
        const found = [];
        for (let row = rows - 1; row >= 0; row--) {
            for (let column = 0; column < columns; column++) {
                if (has(row, column) && !depths.has(key(row, column))) {
                    found.push([row, column]);
                }
            }
        }
        return found;
    };

    // 1. The tree grows from the lowest character
    const rootRow = rows - 1;
    const rootColumn = o17PlantArt[rootRow].search(/\S/);
    let lastDepth = grow([[rootRow, rootColumn]], 0);

    // 2. One last branch at the top right, bridging the small gaps that separate it from the tree
    const inTopRight = (row, column) => row <= 20 && column >= 95;
    const branchSeeds = unvisited().filter(([row, column]) => inTopRight(row, column)
        && neighbors(row, column, 3, (r, c) => depths.has(key(r, c))).length);
    lastDepth = Math.max(lastDepth, grow(branchSeeds, lastDepth + 1, 3, inTopRight));

    // 3. The surrounding groups of touching characters grow from their lowest character
    const groupSeeds = [];
    const groupSeen = new Set();
    unvisited().forEach(([row, column]) => {
        if (groupSeen.has(key(row, column))) {
            return;
        }
        groupSeen.add(key(row, column));
        if (!neighbors(row, column).length) {
            return;
        }
        groupSeeds.push([row, column]);
        const stack = [[row, column]];
        while (stack.length) {
            const [r, c] = stack.pop();
            neighbors(r, c).forEach(([nr, nc]) => {
                if (!groupSeen.has(key(nr, nc))) {
                    groupSeen.add(key(nr, nc));
                    stack.push([nr, nc]);
                }
            });
        }
    });
    lastDepth = Math.max(lastDepth, grow(groupSeeds, lastDepth + 1));

    // 4. Characters touching nothing appear all at once at the very end
    const finalDepth = lastDepth + 1;
    unvisited().forEach(([row, column]) => {
        depths.set(key(row, column), finalDepth);
        order.push([row, column]);
    });

    const nodes = order
        .map(([row, column]) => [
            column * O17_CELL_WIDTH,
            row * O17_CELL_HEIGHT,
            O17_CELL_WIDTH,
            O17_CELL_HEIGHT,
            depths.get(key(row, column))
        ])
        .sort((a, b) => a[4] - b[4]);

    nodes.forEach(([x, y]) => {
        const row = y / O17_CELL_HEIGHT;
        const column = x / O17_CELL_WIDTH;
        const glyph = O17_GLYPHS[o17PlantArt[row][column]];
        if (glyph) {
            context.drawImage(glyph.canvas, x + glyph.dx, y + glyph.dy);
        }
    });

    return { image: canvas, nodes, maxDepth: finalDepth, width, height };
}

function loadO17PlantData() {
    if (!o17PlantDataPromise) {
        o17PlantDataPromise = Promise.resolve().then(buildO17PlantData);
    }
    return o17PlantDataPromise;
}

function animateO18Plant(animation, target, updateUrl = true) {
    cancelAnimationFrame(animation.frame);
    animation.target = target;
    const initialProgress = animation.progress;
    const start = performance.now();

    const step = (now) => {
        if (!animation.graph.isConnected) {
            return;
        }

        const change = (now - start) / 2200;
        animation.progress = target
            ? Math.min(target, initialProgress + change)
            : Math.max(target, initialProgress - change);
        const threshold = animation.progress * animation.data.maxDepth;
        const nodes = animation.data.nodes;
        const context = animation.context;
        let changed = false;

        while (animation.progress > 0 && animation.visible < nodes.length
            && nodes[animation.visible][4] <= threshold) {
            const [x, y, width, height] = nodes[animation.visible];
            context.drawImage(animation.data.image, x, y, width, height, x, y, width, height);
            animation.visible++;
            changed = true;
        }
        while (animation.visible > 0 && (animation.progress === 0
            || nodes[animation.visible - 1][4] > threshold)) {
            animation.visible--;
            const [x, y, width, height] = nodes[animation.visible];
            context.clearRect(x, y, width, height);
            changed = true;
        }
        if (changed) {
            context.globalCompositeOperation = "source-in";
            context.fillStyle = "#551A8B";
            context.fillRect(0, 0, animation.data.width, animation.data.height);
            context.globalCompositeOperation = "source-over";
        }

        if (animation.progress !== target) {
            animation.frame = requestAnimationFrame(step);
        } else if (target === 0 && currentOverlay === animation.page) {
            animation.graph.closest("#overlay").remove();
            currentOverlay = null;
            if (activeSubLink) {
                activeSubLink.classList.remove("active");
                activeSubLink = null;
            }
            if (updateUrl) {
                updatePageUrl(currentPage);
            }
        }
    };

    animation.frame = requestAnimationFrame(step);
}

function positionO18Graph() {
    const graph = document.querySelector("#overlay .o18-graph");
    if (!graph) {
        return;
    }

    const page = graph.dataset.plantPage;
    const link = document.getElementById(page).getBoundingClientRect();
    const anchorX = link.left + link.width / 2;
    let width = 815;
    let height = 688;
    let rootX = 590.5;
    let scale = O18_GRAPH_SCALE;
    if (page === "o17") {
        ({ width, height, anchorX: rootX } = getO17PlantGeometry());
    }

    graph.style.width = `${width * scale}px`;
    graph.style.height = `${height * scale}px`;
    graph.style.left = `${anchorX - rootX * scale}px`;
    graph.style.top = `${link.top - height * scale}px`;
}


function renderVideoOverlay(overlay, videoId, videoHeight) {
    overlay.innerHTML = `
        <div class="video-side-text left">
        ------------------------------------<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;o<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;o<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;o<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;o<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;o<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;o<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;o<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;o<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;o<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;o<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;o<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;o<br>
        </div>

        <iframe
            src="https://www.youtube.com/embed/${videoId}?controls=0&modestbranding=1&rel=0"
            width="550"
            height="${videoHeight}"
            allow="autoplay; encrypted-media"
            allowfullscreen>
        </iframe>

        <div class="video-side-text right">
        ------------------------------------<br>
        o<br>
        o<br>
        o<br>
        o<br>
        </div>
    `;
}


function loadTwitchPlayerApi() {
    if (window.Twitch && window.Twitch.Player) {
        return Promise.resolve();
    }

    if (!twitchPlayerLoader) {
        twitchPlayerLoader = new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://player.twitch.tv/js/embed/v1.js";
            script.async = true;
            script.onload = resolve;
            script.onerror = () => {
                twitchPlayerLoader = null;
                reject(new Error("Failed to load the Twitch player API."));
            };
            document.head.appendChild(script);
        });
    }

    return twitchPlayerLoader;
}


function initializeTwitchPlayer() {
    loadTwitchPlayerApi()
        .then(() => {
            const playerContainer = document.getElementById("twitch-embed");

            if (!playerContainer || playerContainer.dataset.initialized === "true") {
                return;
            }

            if (!window.Twitch || !window.Twitch.Player) {
                throw new Error("The Twitch player API loaded without exposing Twitch.Player.");
            }

            playerContainer.dataset.initialized = "true";
            new window.Twitch.Player("twitch-embed", {
                video: "1127190974",
                width: 540,
                height: 304,
                parent: ["c24309843.github.io"],
                autoplay: false
            });
        })
        .catch((error) => {
            console.error("Could not initialize the Twitch player:", error);
        });
}


function activateBottomSubLink(link, updateUrl = true) {
    if (activeBottomSubLink === link) {
        activeBottomSubLink.classList.remove("active");
        activeBottomSubLink = null;
        if (updateUrl) {
            updatePageUrl(null);
        }
        return;
    }

    if (activeBottomSubLink) {
        activeBottomSubLink.classList.remove("active");
    }

    activeBottomSubLink = link;
    activeBottomSubLink.classList.add("active");
    if (updateUrl) {
        updatePageUrl(link.id);
    }
}


function fitSubNavigation() {
    const subNavs = document.querySelectorAll("#sub-nav, #bottom-sub-nav");
    const viewportWidth = window.visualViewport
        ? Math.min(window.innerWidth, window.visualViewport.width)
        : window.innerWidth;

    subNavs.forEach((subNav) => {
        if (window.getComputedStyle(subNav).display === "none") {
            return;
        }

        const links = Array.from(subNav.querySelectorAll("a"));

        if (!links.length) {
            return;
        }

        links.forEach((link) => {
            if (link.dataset.originalMargin === undefined) {
                link.dataset.originalMargin = window.parseFloat(link.style.marginLeft) || 0;
            }

            link.style.marginLeft = `${link.dataset.originalMargin}px`;
        });

        const subNavLeft = subNav.getBoundingClientRect().left;
        const availableWidth = Math.max(0, viewportWidth - subNavLeft - 80);
        const linksWidth = links.reduce(
            (total, link) => total + link.getBoundingClientRect().width,
            0
        );
        const gapsWidth = Math.max(0, links.length - 1) * 10;
        const originalMarginsWidth = links.reduce(
            (total, link) => total + window.parseFloat(link.dataset.originalMargin),
            0
        );

        let fitFactor = 1;
        const naturalWidth = linksWidth + originalMarginsWidth + gapsWidth;

        if (naturalWidth > availableWidth) {
            fitFactor = Math.max(
                0,
                (availableWidth - linksWidth - gapsWidth) / originalMarginsWidth
            );
        }

        links.forEach((link) => {
            const originalMargin = window.parseFloat(link.dataset.originalMargin);
            link.style.marginLeft = `${originalMargin * fitFactor}px`;
        });
    });

    positionO18Graph();
}


function updatePageUrl(page, replace = false) {
    if (window.location.protocol === "file:") {
        return;
    }

    const url = new URL(window.location.href);
    const numberedOPage = /^o([1-9]|1\d|20)$/.exec(page || "");
    const route = page === "sd"
        ? "prints"
        : page && page.startsWith("sd/")
            ? `prints/${page.slice(3)}`
            : numberedOPage
                ? "o".repeat(Number(numberedOPage[1]))
                : page;
    const routePath = route
        ? route.split("/").map((segment) => encodeURIComponent(segment)).join("/")
        : "";
    url.pathname = `${appBasePath}${routePath}`;
    url.search = "";
    url.hash = "";

    if (window.location.href === url.href) {
        return;
    }

    const state = { page: page || null };
    if (replace) {
        window.history.replaceState(state, "", url);
    } else {
        window.history.pushState(state, "", url);
    }
}


function getPageFromUrl() {
    if (!window.location.pathname.startsWith(appBasePath)) {
        return "";
    }

    const queryPage = new URLSearchParams(window.location.search).get("page");
    if (queryPage) {
        return queryPage;
    }

    const route = window.location.pathname.slice(appBasePath.length).split("/").filter(Boolean);

    if (route[0] === "prints") {
        if (!route[1]) {
            return "sd";
        }
        if (route[1] === "o" && !route[2]) {
            return "sd/lohne/o";
        }
        return `sd/${route.slice(1).join("/")}`;
    }

    if (route[0] === "w") {
        return route[1] === "o" && !route[2] ? "w/o" : "w";
    }

    if (route[0] === "side-mirror") {
        return route.length > 1 ? `side-mirror/${route.slice(1).join("/")}` : "side-mirror";
    }

    return /^o{1,20}$/.test(route[0] || "")
        ? `o${route[0].length}`
        : route[0] || "";
}


function findPageLink(page) {
    return Array.from(document.querySelectorAll("a[onclick]")).find((link) => {
        const handler = link.getAttribute("onclick") || "";
        return handler.includes(`showPage('${page}', this)`)
            || (link.id === page && handler.includes("activateBottomSubLink"));
    });
}


function clearPageState() {
    document.getElementById("overlay")?.remove();
    document.getElementById("content").innerHTML = "";
    clearPrintSubcategory();
    clearMirrorSubcategory();
    closeWTumblrOverlay();
    document.getElementById("w-sub-nav").hidden = true;

    if (activeMainLink) {
        activeMainLink.classList.remove("active");
        activeMainLink = null;
    }
    if (activeSubLink) {
        activeSubLink.classList.remove("active");
        activeSubLink = null;
    }
    if (activeBottomSubLink) {
        activeBottomSubLink.classList.remove("active");
        activeBottomSubLink = null;
    }

    currentPage = null;
    currentOverlay = null;
}


function restorePageFromUrl() {
    const page = getPageFromUrl();
    const wTumblrOverlay = page === "w/o";
    const mirrorRoute = page.startsWith("side-mirror/") ? page.slice("side-mirror/".length) : null;
    const locationRoute = window.location.pathname.slice(appBasePath.length).split("/").filter(Boolean);
    const parsedPrintRoute = page.startsWith("sd/") ? page.slice(3).split("/") : [];
    const legacyPrintTumblrRoute = parsedPrintRoute.length === 1 && parsedPrintRoute[0] === "o";
    const printRoute = legacyPrintTumblrRoute ? ["lohne", "o"] : parsedPrintRoute;
    const printSubcategory = printRoute[0] || null;
    const printTumblrOverlay = printRoute[1] === "o" && printRoute.length === 2;
    const invalidPrintRoute = printRoute.length > 1 && !printTumblrOverlay;
    const legacyPrintTumblrPath = locationRoute[0] === "prints"
        && locationRoute[1] === "o"
        && !locationRoute[2];
    const mainPage = printSubcategory ? "sd" : wTumblrOverlay ? "w" : mirrorRoute !== null ? "side-mirror" : page;
    const link = mainPage ? findPageLink(mainPage) : null;
    const hasLegacyPageQuery = new URLSearchParams(window.location.search).has("page");

    clearPageState();

    if (!page) {
        return;
    }

    if (!link) {
        updatePageUrl(null, true);
        return;
    }

    if ((link.getAttribute("onclick") || "").includes("activateBottomSubLink")) {
        activateBottomSubLink(link, false);
        return;
    }

    fitSubNavigation();
    showPage(mainPage, link, false);

    if (printSubcategory) {
        const subLink = document.getElementById(`print-${printSubcategory}`);
        if (!subLink) {
            updatePageUrl("sd", true);
            return;
        }

        if (activePrintSubLink !== subLink) {
            showPrintSubcategory(printSubcategory, subLink, false);
        }

        if (printTumblrOverlay) {
            togglePrintTumblrOverlay(document.getElementById("print-o"), false);
        }
    }

    if (wTumblrOverlay) {
        toggleWTumblrOverlay(document.getElementById("w-o"), false);
    }

    if (mirrorRoute !== null) {
        const subLink = /^[1-4]$/.test(mirrorRoute) ? document.getElementById(`mirror-${mirrorRoute}`) : null;
        if (!subLink) {
            updatePageUrl("side-mirror", true);
            return;
        }
        if (activeMirrorSubLink !== subLink) {
            showMirrorSubcategory(mirrorRoute, subLink, false);
        }
    }

    if (hasLegacyPageQuery || legacyPrintTumblrRoute || legacyPrintTumblrPath || invalidPrintRoute) {
        const canonicalPageRoute = wTumblrOverlay
            ? "w/o"
            : printTumblrOverlay
                ? `sd/${printSubcategory}/o`
                : printSubcategory
                    ? `sd/${printSubcategory}`
                    : mirrorRoute !== null
                        ? `side-mirror/${mirrorRoute}`
                        : mainPage;
        updatePageUrl(canonicalPageRoute, true);
    }
}


window.addEventListener("resize", fitSubNavigation);
window.addEventListener("orientationchange", fitSubNavigation);

if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", fitSubNavigation);
}

loadOverlayStatesFromStorage();

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        fitSubNavigation();
    });
} else {
    fitSubNavigation();
}


/* page navigation */

function showPage(page, link, updateUrl = true) {
    closeWTumblrOverlay();
    const content = document.getElementById("content");
    let overlay = document.getElementById("overlay");

    const overlayPages = [
        "o1", "o2", "o3", "o4", "o5",
        "o6", "o7", "o8", "o9", "o10", "o13", "o17", "o18"
    ];


    /* main navigation */

    if (!overlayPages.includes(page)) {

        overlay?.remove();
        currentOverlay = null;
        clearPrintSubcategory();
        clearMirrorSubcategory();

        if (activeSubLink) {
            activeSubLink.classList.remove("active");
            activeSubLink = null;
        }
        if (activeBottomSubLink) {
            activeBottomSubLink.classList.remove("active");
            activeBottomSubLink = null;
        }

        // clicking the active main category closes it
        if (currentPage === page) {
            if (currentPage) {
                scrollPositions.set(currentPage, window.scrollY);
                // Save overlay interaction states before closing
                saveOverlayStatesToStorage();
            }
            content.innerHTML = "";
            currentPage = null;

            if (activeMainLink) {
                activeMainLink.classList.remove("active");
                activeMainLink = null;
            }
            document.getElementById("w-sub-nav").hidden = true;
            if (updateUrl) {
                updatePageUrl(null);
            }
            return;
        }

        // switch main category - save scroll position of previous page
        if (currentPage) {
            scrollPositions.set(currentPage, window.scrollY);
            // Save overlay interaction states before switching
            saveOverlayStatesToStorage();
        }

        if (activeMainLink) {
            activeMainLink.classList.remove("active");
        }

        activeMainLink = link;
        activeMainLink.classList.add("active");

        currentPage = page;
        document.getElementById("print-sub-nav").hidden = page !== "sd";
        document.getElementById("mirror-sub-nav").hidden = page !== "side-mirror";
        document.getElementById("w-sub-nav").hidden = page !== "w";
        if (updateUrl) {
            updatePageUrl(page === "sd" ? "sd/lohne" : page === "side-mirror" ? "side-mirror/1" : page);
        }


        /* prints (sd) */

        if (page === "sd") {
            content.innerHTML = "";
            showPrintSubcategory("lohne", document.getElementById("print-lohne"), false);
            startSequentialImageLoading(content);
        }

        if (page === "c------") {
            content.innerHTML = "";
        }


        /* w */

        if (page === "w") {
            content.innerHTML = renderWContent();
            startSequentialImageLoading(content);
            
            // Restore overlay states for w page
            requestAnimationFrame(() => {
                content.querySelectorAll(".w-item").forEach((item) => {
                    const filename = item.dataset.imageFilename;
                    const overlay = item.querySelector(".w-image-ones");
                    const savedState = overlayStates.get(filename);

                    const circle = overlay && overlay.querySelector(".symbol-circle, .symbol-accent--moving, .symbol-accent--single-moving, .symbol-accent--triple-moving");
                    if (circle) {
                        const placeCircle = () => setWMovingAccentLine(
                            circle,
                            Number((overlayStates.get(filename) || {}).movingLine || 0)
                        );
                        placeCircle();
                        const circleImage = item.querySelector("img");
                        if (circleImage) {
                            circleImage.addEventListener("load", placeCircle);
                        }
                    }
                    
                    if (overlay && savedState) {
                        const movingAccent = overlay.querySelector(".symbol-accent--moving, .symbol-accent--single-moving, .symbol-accent--triple-moving");
                        if (movingAccent && savedState.movingLine !== undefined) {
                            setWMovingAccentLine(movingAccent, savedState.movingLine);
                        }

                        // Restore symbol state
                        if (savedState.symbol !== undefined && overlay.dataset.symbol !== savedState.symbol) {
                            overlay.dataset.symbol = savedState.symbol;
                            const border = overlay.querySelector(".w-image-symbol-border");
                            if (border) {
                                const symbol = savedState.symbol;
                                const horizontal = `${symbol} `.repeat(60);
                                const vertical = `${symbol}\n`.repeat(100);
                                border.querySelector(".top").textContent = horizontal;
                                border.querySelector(".right").textContent = vertical;
                                border.querySelector(".left").textContent = vertical;
                                border.querySelector(".bottom").textContent = border.classList.contains("bottom-heavy")
                                    ? Array.from({ length: 5 }, () => horizontal).join("\n")
                                    : horizontal;
                                overlay.querySelectorAll(".symbol-accent")
                                    .forEach((accent) => {
                                        accent.hidden = !accent.classList.contains("symbol-accent--moving")
                                            && symbol !== overlay.dataset.baseSymbol;
                                    });
                            }
                        }
                        
                        // Restore mode state
                        if (savedState.mode !== undefined && overlay.dataset.mode !== savedState.mode) {
                            overlay.dataset.mode = savedState.mode;
                            overlay.classList.toggle("show-one-border", savedState.mode === "border");
                        }
                    }
                });
            });
        }


        /* e */

        if (page === "e") {
            content.innerHTML = `<button type="button" class="erotics-text" data-index="0"
                onclick="cycleEroticsText(this)">${eroticsTextOptions[0]}</button>`;
        }


        /* m */

        if (page === "m") {
            content.innerHTML = "";
        }


        /* flower-press */

        if (page === "flower-press") {
            content.innerHTML = `
            <a id="flower-press-text" class="graph-text" href="#" onclick="togglePrintText(this); return false;"
                data-alt-text="
                    ----------sdfsdfsdff--------.<br>
                    ------sdfdsfsdfdsf------------.<br>
                    --------sdfsdffds----------<br>
                    ----------sdfsdfsdfsdf--------"
                data-third-text="
                    yysdfsdfdsf------yyyyyyyyyyy------cks.<br>
                    yyyyyysdfsdfsdf---------------yyyyyyyyyyyw.<br>
                    cyyyyyysdfdsfsfd---------------yyyyyyyyyyyyk<br>
                    yyyyyyyysdfdsf---------------yyyyyyyyyck fuck">
                :::::::::::::::::::::::::::: <br>
                ::::::::::::::::::::::::::::<br>
                ::::::::::::::::::::::::::::fuck<br>
                ::::::::::::::::::::::::::::
            </a>
        `;
        }


        /* side-mirror */

        if (page === "side-mirror") {
            showMirrorSubcategory("1", document.getElementById("mirror-1"), false);
        }


        /* links */

        if (page === "links") {
            content.innerHTML = "";
        }


        /* cock */

        if (page === "cock") {
            content.innerHTML = "";
        }

        // Restore scroll position after rendering new content
        const savedScroll = scrollPositions.get(page);
        restoreScrollAfterLoading(content, page, savedScroll);

        return;
    }


    /* sub navigation */

    if (overlayPages.includes(page)) {

        // close the currently open sub-menu if clicked again
        if (currentOverlay === page) {
            if (page === "o17" || page === "o18") {
                if (o18PlantAnimation && o18PlantAnimation.data) {
                    animateO18Plant(o18PlantAnimation, o18PlantAnimation.target ? 0 : 1, updateUrl);
                } else {
                    overlay.remove();
                    currentOverlay = null;
                    activeSubLink.classList.remove("active");
                    activeSubLink = null;
                    if (updateUrl) {
                        updatePageUrl(currentPage);
                    }
                }
                return;
            }

            overlay?.remove();
            currentOverlay = null;

            if (activeSubLink) {
                activeSubLink.classList.remove("active");
                activeSubLink = null;
            }
            if (updateUrl) {
                updatePageUrl(currentPage);
            }
            return;
        }

        // remove previous sub-menu active colour
        if (activeSubLink) {
            activeSubLink.classList.remove("active");
        }

        if (activeBottomSubLink) {
            activeBottomSubLink.classList.remove("active");
            activeBottomSubLink = null;
        }

        activeSubLink = link;
        activeSubLink.classList.add("active");

        if (!overlay) {
            overlay = document.createElement("div");
            overlay.id = "overlay";

            overlay.addEventListener("click", function(event) {
                if (event.target === overlay) {
                    overlay.remove();
                    currentOverlay = null;

                    if (activeSubLink) {
                        activeSubLink.classList.remove("active");
                        activeSubLink = null;
                    }
                    updatePageUrl(currentPage);
                }
            });

            document.body.appendChild(overlay);
        }

        overlay.innerHTML = "";
        currentOverlay = page;
        if (updateUrl) {
            updatePageUrl(page);
        }


        /* o1 */


        /* o2 video */

        if (page === "o2") {
            renderVideoOverlay(overlay, "piMIPHVneOg", 415);
        }


        /* o3 */

        if (page === "o3") {
            overlay.innerHTML = `
                <div class="tiktok-post-container">
                    <iframe
                        class="tiktok-embed"
                        src="https://www.tiktok.com/embed/v2/7685288523800382734?autoplay=1&loop=1&muted=0&volume=100"
                        width="325"
                        height="578"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share"
                        allowfullscreen>
                    </iframe>

                    <div class="tiktok-text-overlay">
                        <div class="tiktok-line-1">o o o o<br>
                        o o o o<br>
                        o o o o</div>

                        <div class="tiktok-line-2">ooooooooooooooooooooooooooooooooooooooooooo</div>
                        <div class="tiktok-line-3">o o o o o o o o o o o o o o o o o</div>
                        <div class="tiktok-line-4">༽( ҉ ᵔ ͜ ᵕ ࿓ ͜ ᵔ ҈ )༼------------------------------------------------------------------------------------------------------</div>
                    </div>
                </div>
            `;
        }


        /* o4 text */

        if (page === "o4") {
            overlay.innerHTML = `
                <div class="corner-text top-left">
                ------------------------------------------------------------------------------------------------------------<br>
                ------------------------------------<br>
                ------------------------------------<br>
                ------------------------------------<br>
                ------------------------------------<br>
                </div>

                <div class="corner-text top-right">
                ------------------------------------------------------------------------------------------------------------<br>
                ------------------------------------<br>
                ------------------------------------<br>
                ------------------------------------<br>
                ------------------------------------<br>
                </div>

                <div class="corner-text bottom-left">
                ------------------------------------<br>
                ------------------------------------<br>
                ------------------------------------<br>
                ------------------------------------<br>
                ------------------------------------------------------------------------------------------------------------<br>
                </div>

                <div class="corner-text bottom-right">
                ------------------------------------<br>
                ------------------------------------<br>
                ------------------------------------<br>
                ------------------------------------<br>
                ------------------------------------------------------------------------------------------------------------<br>
                </div>
            `;
        }


        /* o5 text */

        if (page === "o5") {
            overlay.innerHTML = `
                <div class="o5-text"></div>
            `;
            const o5Text = overlay.querySelector(".o5-text");
            renderO5Text(o5Text, 0);
            o5Text.addEventListener("click", function() {
                toggleO5Text(this);
            });
        }

        /* o6 video */

        if (page === "o6") {
            overlay.innerHTML = `
                <div class="video-side-text left">
                --------oo-----------------------o--<br>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;o<br>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;o<br>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;o<br>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;o<br>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;o<br>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;o<br>
                </div>

                <iframe
                    src="https://www.youtube.com/embed/pbecPw1fy8Q?controls=0&modestbranding=1&rel=0"
                    width="550"
                    height="309"
                    allow="autoplay; encrypted-media"
                    allowfullscreen>
                </iframe>

                <div class="video-side-text right">
                -----------------------------oooo---<br>
                o<br>
                o<br>
                </div>
            `;
        }

        /* o7 text */

        if (page === "o7") {
            overlay.innerHTML = `
                <div class="corner-text top-left">
                ------------------------------------------------------------------------------------------------------------<br>
                ------------------------------------<br>
                ------------------------------------<br>
                ------------------------------------<br>
                ------------------------------------<br>
                </div>

                <div class="corner-text top-right">
                ------------------------------------------------------------------------------------------------------------<br>
                ------------------------------------<br>
                ------------------------------------<br>
                ------------------------------------<br>
                ------------------------------------<br>
                </div>

                <div class="corner-text bottom-left">
                ------------------------------------<br>
                ------------------------------------<br>
                ------------------------------------<br>
                ------------------------------------<br>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ooooooooooooooooooooooooooooooooooooooooooooooooooooooo&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ooooooooooooooooooooooo<br>
                </div>

                <div class="corner-text bottom-right">
                :::::
                <br>
                :::::
                <br>
                :::::
                <br>
                :::::
                <br>
                :::::
                <br>
                :::::
                <br>
                :::::
                <br>
                <br>
                <br>
                <br>
                <br>
                ------------------------------------<br>
                ------------------------------------<br>
                ------------------------------------<br>
                ------------------------------------<br>
                ------------------------------------------------------------------------------------------------------------<br>
                </div>
            `;
        }


        /* o8 center picture */

        if (page === "o8") {
            overlay.innerHTML = `
                <img data-sequential-src="pic/rnd/20260207_144703.png" width="974" height="532" class="center-picture sequential-image-loading">
            `;
            startSequentialImageLoading(overlay);
        }

        /* o17 / o18 plants */

        if (page === "o17" || page === "o18") {
            const plantSize = page === "o17" ? getO17PlantGeometry() : { width: 815, height: 688 };
            overlay.innerHTML = `
                <button type="button" class="o18-graph" data-plant-page="${page}" aria-label="Plant drawing"><canvas width="${plantSize.width}" height="${plantSize.height}"></canvas></button>
            `;
            const graph = overlay.querySelector(".o18-graph");
            positionO18Graph();
            graph.addEventListener("click", function() {
                if (o18PlantAnimation && o18PlantAnimation.data) {
                    animateO18Plant(o18PlantAnimation, 0);
                } else {
                    document.getElementById(page).click();
                }
            });
            const animation = {
                page,
                graph,
                context: graph.querySelector("canvas").getContext("2d"),
                progress: 0,
                target: 1,
                visible: 0,
                frame: 0
            };
            o18PlantAnimation = animation;
            (page === "o17" ? loadO17PlantData() : loadO18PlantData()).then((data) => {
                if (!graph.isConnected || o18PlantAnimation !== animation) {
                    return;
                }
                animation.data = data;
                animateO18Plant(animation, 1);
            }).catch((error) => {
                console.error("Failed to display the plant drawing:", error);
                if (graph.isConnected) {
                    graph.textContent = "Unable to load plant drawing.";
                }
            });
        }


        /* o9 tumblr post */

        if (page === "o9") {
            overlay.innerHTML = `
                <div class="tumblr-post-container">
                    <iframe
                        class="tumblr-embed"
                        src="https://embed.tumblr.com/embed/post/t:GBq4BHiVEj-zFU_vhdq0nA/809714734371930112/v2"
                        width="540"
                        height="700"
                        frameborder="0">
                    </iframe>

                    <div class="link-picture">
                        <div class="line-1">o o o o<br>
                        o o o o<br>
                        o o o o</div>

                        <div class="line-3">ooooooooooooooooooooooooooooooooooooooooooo</div>
                        <div class="line-4">o o o o o o o o o o o o o o o o o</div>
                         <div class="line-5">༽( ҉ ᵔ ͜ ᵕ ࿓ ͜ ᵔ ҈ )༼------------------------------------------------------------------------------------------------------</div>


                        
                    </div>
                </div>
            `;
        }

        /* o13 Twitch video */

        if (page === "o13") {
            overlay.innerHTML = `
                <div class="twitch-post-container">
                    <div id="twitch-embed" class="twitch-embed"></div>
                </div>

                <div class="video-side-text left">
                --------oo-----------------------o--<br>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;o<br>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;o<br>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;o<br>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;o<br>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;o<br>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;o<br>
                </div>

                <div class="video-side-text right">
                -----------------------------oooo---<br>
                o<br>
                o<br>
                </div>
            `;
            initializeTwitchPlayer();
        }


        /* o10 */

        return;
    }
}


const requestedPath = new URLSearchParams(window.location.search).get("__route");
if (requestedPath && requestedPath.startsWith(appBasePath)) {
    window.history.replaceState(null, "", requestedPath);
}

window.addEventListener("popstate", restorePageFromUrl);
if (getPageFromUrl()) {
    restorePageFromUrl();
}
