
/* general */

let currentPage = null;
let currentOverlay = null;
let activeMainLink = null;
let activeSubLink = null;
let activeBottomSubLink = null;
let activePrintSubLink = null;
let twitchPlayerLoader = null;
let mirrorImageObserver = null;
const appBasePath = new URL(".", document.currentScript.src).pathname;
const mirrorImages = [
    "20250918_184401.jpg",
    "20251129_130441.jpg",
    "20251209_201021.jpg",
    "20251213_125321.jpg",
    "20251215_153601.jpg"
];
const mirrorImageBatchSize = 5;
const mirrorImagePrefetchDistance = 800;

const o5TextOptions = ["gnome ...", "yyyyyyyyyyyyyy", "chome."];
const o18GraphOptions = [
    "<<<ooo>>>\n   o:o    \n    oo    \n<<<o:o>>>\n    o:o   \n    o:o   \n    o o   \n    o o   \n    o o   ",
    "<<<ooo>>>\n   o:o    \n    oo    \n<<<o:o>>>\n    o:o   \n    o:o   \n   o  o   \n  o   o   \n o     o"
];

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
    document.getElementById("content").innerHTML = category === "lohne"
        ? renderLohneContent()
        : "";
    if (updateUrl) {
        updatePageUrl(`sd/${category}`);
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

function renderImageDescription() {
    return `
<button type="button" class="image-description" onclick="duplicateImageDescription(this)">
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
        <img src="${printImage("Scan_20260119 (2).jpg")}" width="1251" height="1807">
    </a>
    ${renderImageDescription()}
</div>

<div class="print-item">
    <a href="${printImage("Scan_20260119.jpg")}" target="_blank">
        <img src="${printImage("Scan_20260119.jpg")}" width="3327" height="2125">
    </a>
    ${renderImageDescription()}
</div>

<div class="print-item">
    <a href="${printImage("Scan_20260119 (20).jpg")}" target="_blank">
        <img src="${printImage("Scan_20260119 (20).jpg")}" width="3252" height="2112">
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
    <a href="${image}" target="_blank">
        <img src="${image}" width="600" loading="lazy" decoding="async">
    </a>
    ${renderImageDescription()}
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
        "20250518_195425.jpg",
        "20240509_234712.jpg",
        "20240605_013611.jpg",
        "20240605_014712.jpg",
        "20250329_001636.jpg",
        "P1322318 (1).JPG"
    ];
    const wImage = (filename) =>
        `${appBasePath}pic/w/${encodeURIComponent(filename)}`;

    return wImages.map((filename) => `
<div class="w-item">
    <img src="${wImage(filename)}" width="600">
    ${renderImageDescription()}
</div>`).join("");
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
        return route[1] ? `sd/${route[1]}` : "sd";
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
    const printSubcategory = page.startsWith("sd/") ? page.slice(3) : null;
    const mainPage = printSubcategory ? "sd" : page;
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
    }

    if (hasLegacyPageQuery) {
        updatePageUrl(printSubcategory ? `sd/${printSubcategory}` : mainPage, true);
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
        if (updateUrl) {
            updatePageUrl(page === "sd" ? "sd/lohne" : page);
        }


        /* prints (sd) */

        if (page === "sd") {
            content.innerHTML = "";
            showPrintSubcategory("lohne", document.getElementById("print-lohne"), false);
        }


        /* w */

        if (page === "w") {
            content.innerHTML = renderWContent();
        }


        /* e */

        if (page === "e") {
            content.innerHTML = "";
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
                <img src="pic/rnd/20260207_144703.png" width="974" height="532" class="center-picture">
            `;
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
