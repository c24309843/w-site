
/* general */

let currentPage = null;
let currentOverlay = null;
let activeMainLink = null;
let activeSubLink = null;
let activeBottomSubLink = null;
let activePrintSubLink = null;
let activePrintOverlayLink = null;
let activeWTumblrOverlayLink = null;
let twitchPlayerLoader = null;
let mirrorImageObserver = null;
let sequentialImageLoading = false;
let sequentialImageQueue = [];
const appBasePath = new URL(".", document.currentScript.src).pathname;
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
const mirrorImageBatchSize = 5;
const mirrorImagePrefetchDistance = 800;

const o5TextOptions = ["gnome ...", "yyyyyyyyyyyyyy", "chome."];
const o18GraphOptions = [
    "<<<ooo>>>\n   o:o    \n    oo    \n<<<o:o>>>\n    o:o   \n    o:o   \n    o o   \n    o o   \n    o o   ",
    "<<<ooo>>>\n   o:o    \n    oo    \n<<<o:o>>>\n    o:o   \n    o:o   \n   o  o   \n  o   o   \n o     o"
];
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


function renderO18Graph(graph, index, steps) {
    const lines = o18GraphOptions[index].split("\n");
    const extraArrows = Math.floor(steps / 5);

    [0, 3].forEach((lineIndex) => {
        const indent = lines[lineIndex].match(/^\s*/)[0];
        const line = lines[lineIndex].slice(indent.length);
        lines[lineIndex] = `${indent}${"<".repeat(extraArrows)}${line}${">".repeat(extraArrows)}`;
    });

    graph.textContent = lines.join("\n");
    graph.dataset.graphIndex = String(index);
    graph.dataset.stepCount = String(steps);
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
        activePrintSubLink.classList.remove("active");
        activePrintSubLink = null;
        document.getElementById("content").innerHTML = "";

        if (updateUrl) {
            updatePageUrl("sd");
        }
        return;
    }

    if (activePrintSubLink) {
        activePrintSubLink.classList.remove("active");
    }

    activePrintSubLink = link;
    activePrintSubLink.classList.add("active");
    const content = document.getElementById("content");
    if (category === "lohne") {
        content.innerHTML = renderLohneContent();
        startSequentialImageLoading(content);
    } else {
        content.innerHTML = "";
    }

    if (updateUrl) {
        updatePageUrl(`sd/${category}`);
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
<div class="print-item">
    <a href="${printImage("Scan_20260119 (2).jpg")}" target="_blank">
        <img data-sequential-src="${printImage("Scan_20260119 (2).jpg")}" width="1251" height="1807" class="sequential-image-loading">
    </a>
    ${renderImageDescription()}
</div>

<div class="print-item">
    <a href="${printImage("Scan_20260119.jpg")}" target="_blank">
        <img data-sequential-src="${printImage("Scan_20260119.jpg")}" width="3327" height="2125" class="sequential-image-loading">
    </a>
    ${renderImageDescription()}
</div>

<div class="print-item">
    <a href="${printImage("Scan_20260119 (20).jpg")}" target="_blank">
        <img data-sequential-src="${printImage("Scan_20260119 (20).jpg")}" width="3252" height="2112" class="sequential-image-loading">
    </a>
    ${renderImageDescription()}
</div>

<a id="print-text" class="graph-text" href="#" onclick="togglePrintText(this); return false;">
    abo--------------------------cks.<br>
    gnow gnow gnow gnow.<br>
    coc.........................fuck<br>
    nig-----------------------ck fuck
</a>
`;
}

function renderMirrorItems(startIndex, endIndex) {
    const mirrorImage = (filename) =>
        `${appBasePath}pic/mirror/${encodeURIComponent(filename)}`;

    return mirrorImages.slice(startIndex, endIndex).map((filename) => {
        const image = mirrorImage(filename);
        return `
<div class="mirror-item">
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

function renderMirrorContent() {
    const initialCount = Math.min(mirrorImageBatchSize, mirrorImages.length);
    const loadTrigger = initialCount < mirrorImages.length
        ? `<div class="mirror-load-trigger" data-next-index="${initialCount}" aria-hidden="true"></div>`
        : "";

    return `${renderMirrorItems(0, initialCount)}${loadTrigger}`;
}

function stopMirrorImageLoading() {
    if (mirrorImageObserver) {
        mirrorImageObserver.disconnect();
        mirrorImageObserver = null;
    }
}

function appendMirrorImageBatch(trigger) {
    const nextIndex = Number(trigger.dataset.nextIndex);
    const endIndex = Math.min(nextIndex + mirrorImageBatchSize, mirrorImages.length);
    trigger.insertAdjacentHTML("beforebegin", renderMirrorItems(nextIndex, endIndex));
    startSequentialImageLoading(trigger.parentElement);

    if (endIndex >= mirrorImages.length) {
        trigger.remove();
        stopMirrorImageLoading();
        return false;
    }

    trigger.dataset.nextIndex = String(endIndex);
    return true;
}

function startMirrorImageLoading() {
    const trigger = document.querySelector("#content .mirror-load-trigger");
    if (!trigger) {
        return;
    }

    if (!("IntersectionObserver" in window)) {
        while (appendMirrorImageBatch(trigger)) {
            // Load all images when progressive loading is unsupported.
        }
        return;
    }

    mirrorImageObserver = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
            return;
        }

        while (
            trigger.isConnected &&
            trigger.getBoundingClientRect().top <= window.innerHeight + mirrorImagePrefetchDistance
        ) {
            if (!appendMirrorImageBatch(trigger)) {
                return;
            }
        }
    }, { rootMargin: `${mirrorImagePrefetchDistance}px 0px` });

    mirrorImageObserver.observe(trigger);
}

function renderWContent() {
    const wImages = [
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
        "20250601_210641.jpg",
        "20250602_000623.jpg",
        "20250609_014849.jpg",
        "20250609_014852.jpg",
        "20250609_041050.jpg",
        "20250616_212118.jpg",
        "20250622_211727.jpg",
        "20250806_110341.jpg",
        "New folder/20250526_010739.jpg",
        "New folder/20260111_192024.jpg"
    ];
    const wImage = (filename) =>
        `${appBasePath}pic/w/${filename.split("/").map(encodeURIComponent).join("/")}`;
    
    // Map filename to special features (overlays, accents, grids)
    const wImageSpecialFeatures = new Map([
        // Flower overlay
        ["20250329_001636.jpg", { flowerOverlay: true }],
        // O number overlay
        ["20250518_195425.jpg", { oNumberOverlay: true }],
        // Three O accents - all these images have three o marks in their border
        ["P1322318 (1).JPG", { threeOAccent: true, accentPosition: "center-right" }],
        ["20240605_014712.jpg", { threeOAccent: true }],
        ["20250211_214418.jpg", { threeOAccent: true, accentPosition: "center-right" }],
        ["20250220_223023.jpg", { threeOAccent: true }],
        ["20250314_225400.jpg", { threeOAccent: true, accentPosition: "center-right" }],
        ["20250314_213700.jpg", { threeOAccent: true }],
        ["20250405_022816.jpg", { threeOAccent: true }],
        ["20250409_223136.jpg", { threeOAccent: true }],
        ["20250428_001046.jpg", { threeOAccent: true }],
        ["20250507_004140.jpg", { threeOAccent: true }],
        ["20250601_210220.jpg", { threeOAccent: true }],
        ["20250601_210641.jpg", { threeOAccent: true }],
        ["20250622_211727.jpg", { threeOAccent: true, accentPosition: "right", singleMovingO: true }],
        ["20250616_212118.jpg", { threeOAccent: true }],
        // Nine O grid
        ["20250506_232944.jpg", { nineOGrid: true }],
        // Three moving o's on last image
        ["New folder/20260111_192024.jpg", { threeMovingOs: true }]
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
        withNineOGrid = false,
        withMovingOAccent = false,
        withSingleMovingO = false,
        withThreeMovingOs = false
    ) => {
        const horizontal = `${symbol} `.repeat(60);
        const vertical = `${symbol}\n`.repeat(100);
        const bottom = Array.from({ length: bottomRows }, () => horizontal).join("\n");
        const borderClass = bottomRows > 1 ? " bottom-heavy" : "";
        const threeOs = "<span>o</span><span>o</span><span>o</span>";
        const accentClass = `symbol-accent${accentPosition ? ` symbol-accent--${accentPosition}` : ""}${withMovingOAccent ? " symbol-accent--moving" : ""}${withSingleMovingO ? " symbol-accent--single-moving" : ""}`;
        const threeOAccent = withThreeOAccent
            ? `<span class="${accentClass}">${withSingleMovingO ? "<span>o</span>" : threeOs}</span>`
            : withThreeMovingOs
                ? `<span class="${accentClass} symbol-accent--triple-moving">${threeOs}</span>`
                : "";
        const nineOGrid = withNineOGrid
            ? `<span class="symbol-grid-accent">${"<span>o</span>".repeat(9)}</span>`
            : "";

        return `<span class="w-image-one-border w-image-symbol-border${borderClass}" aria-hidden="true">${threeOAccent}${nineOGrid}<span class="top">${horizontal}</span><span class="right">${vertical}</span><span class="bottom">${bottom}</span><span class="left">${vertical}</span></span>`;
    };

    return wImages.map((filename, index) => {
        const image = `<img data-sequential-src="${wImage(filename)}" width="600" class="sequential-image-loading">`;
        const features = wImageSpecialFeatures.get(filename) || {};
        const isFlowerOverlay = features.flowerOverlay || false;
        const isONumberOverlay = features.oNumberOverlay || false;
        const isSecondImage = filename === "P1322318 (1).JPG";
        const hasThreeOAccent = features.threeOAccent || false;
        const hasNineOGrid = features.nineOGrid || false;
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
        hasNineOGrid,
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
        hasNineOGrid,
        hasMovingOAccent,
        withSingleMovingO,
        withThreeMovingOs
    )}
 </div>`
                        : "";
        const imageMarkup = hasOverlay
            ? `<div class="w-image-covered${isFlowerOverlay ? " w-image-covered-flowers" : ""}">
    ${image}
    ${overlayMarkup}
</div>`
            : image;

        return `
<div class="w-item" data-image-number="${index + 1}" data-image-filename="${filename}">
    ${imageMarkup}
    ${renderImageDescription("toggleWImageFromDescription(this)")}
    </div>`;
    }).join("");
}

function toggleWImageFromDescription(description) {
    const overlay = description.parentElement.querySelector(".w-image-ones");
    toggleWImageFromText(overlay);
}

function toggleWImageFromText(overlay) {
    const description = overlay.closest(".w-item").querySelector(".image-description");
    description.classList.remove("flash-red");
    void description.offsetWidth;
    description.classList.add("flash-red");

    const movingAccent = overlay.querySelector(".symbol-accent--moving, .symbol-accent--single-moving, .symbol-accent--triple-moving");
    if (movingAccent) {
        const nextLine = Number(movingAccent.dataset.line || 0) + 1;
        movingAccent.dataset.line = String(nextLine);
        movingAccent.style.top = `${(6 + nextLine) * 1.15}em`;
        movingAccent.style.transform = `translateX(-${Math.floor(nextLine / 5)}em)`;
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

    const nextMode = overlay.dataset.mode === "border" ? "fill" : "border";
    overlay.classList.add("flash-red");
    overlay.addEventListener("animationend", () => {
        overlay.dataset.mode = nextMode;
        overlay.classList.toggle("show-one-border", nextMode === "border");
        overlay.classList.remove("flash-red");
    }, { once: true });
}

function toggleWImageSymbol(overlay) {
    if (overlay.classList.contains("flash-red")) {
        return;
    }

    const nextSymbol = overlay.dataset.symbol === overlay.dataset.baseSymbol
        ? overlay.dataset.altSymbol
        : overlay.dataset.baseSymbol;
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
        overlay.querySelectorAll(".symbol-accent, .symbol-grid-accent")
            .forEach((accent) => {
                accent.hidden = !accent.classList.contains("symbol-accent--moving")
                    && nextSymbol !== overlay.dataset.baseSymbol;
            });
        overlay.dataset.symbol = nextSymbol;
        overlay.classList.remove("flash-red");
    }, { once: true });
}


function toggleO18Graph(graph) {
    const currentIndex = Number(graph.dataset.graphIndex || 0);
    const steps = Number(graph.dataset.stepCount || 0) + 1;
    const nextIndex = (currentIndex + 1) % o18GraphOptions.length;
    renderO18Graph(graph, nextIndex, steps);
    graph.style.right = `${Number.parseFloat(getComputedStyle(graph).right) + 10}px`;
    graph.classList.remove("flash-red");
    void graph.offsetWidth;
    graph.classList.add("flash-red");
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
    const mainPage = printSubcategory ? "sd" : wTumblrOverlay ? "w" : page;
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

    if (hasLegacyPageQuery || legacyPrintTumblrRoute || legacyPrintTumblrPath || invalidPrintRoute) {
        const canonicalPageRoute = wTumblrOverlay
            ? "w/o"
            : printTumblrOverlay
                ? `sd/${printSubcategory}/o`
                : printSubcategory
                    ? `sd/${printSubcategory}`
                    : mainPage;
        updatePageUrl(canonicalPageRoute, true);
    }
}


window.addEventListener("resize", fitSubNavigation);
window.addEventListener("orientationchange", fitSubNavigation);

if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", fitSubNavigation);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fitSubNavigation);
} else {
    fitSubNavigation();
}


/* page navigation */

function showPage(page, link, updateUrl = true) {
    stopMirrorImageLoading();
    closeWTumblrOverlay();
    const content = document.getElementById("content");
    let overlay = document.getElementById("overlay");

    const overlayPages = [
        "o1", "o2", "o3", "o4", "o5",
        "o6", "o7", "o8", "o9", "o10", "o13", "o18"
    ];


    /* main navigation */

    if (!overlayPages.includes(page)) {

        overlay?.remove();
        currentOverlay = null;
        clearPrintSubcategory();

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

        // switch main category
        if (activeMainLink) {
            activeMainLink.classList.remove("active");
        }

        activeMainLink = link;
        activeMainLink.classList.add("active");

        currentPage = page;
        document.getElementById("print-sub-nav").hidden = page !== "sd";
        document.getElementById("w-sub-nav").hidden = page !== "w";
        if (updateUrl) {
            updatePageUrl(page === "sd" ? "sd/lohne" : page);
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
            content.innerHTML = renderMirrorContent();
            startSequentialImageLoading(content);
            startMirrorImageLoading();
        }


        /* links */

        if (page === "links") {
            content.innerHTML = "";
        }



        /* cock */

        if (page === "cock") {
            content.innerHTML = "";
        }

        return;
    }


    /* sub navigation */

    if (overlayPages.includes(page)) {

        // close the currently open sub-menu if clicked again
        if (currentOverlay === page) {
            if (page === "o18") {
                toggleO18Graph(overlay.querySelector(".o18-graph"));
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

        /* o18 text graphs */

        if (page === "o18") {
            overlay.innerHTML = `
                <button type="button" class="o18-graph" aria-label="Switch text graph"></button>
            `;
            const graph = overlay.querySelector(".o18-graph");
            renderO18Graph(graph, 0, 0);
            graph.addEventListener("click", function() {
                toggleO18Graph(this);
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
