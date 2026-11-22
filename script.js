
/* general */

let currentPage = null;
let currentOverlay = null;
let activeMainLink = null;
let activeSubLink = null;
let activeBottomSubLink = null;
let twitchPlayerLoader = null;
const appBasePath = new URL(".", document.currentScript.src).pathname;
const o5TextOptions = ["gnome ...", "yyyyyyyyyyyyyy", "chome."];

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
    document.documentElement.style.setProperty("--viewport-height", `${viewport.height}px`);
    document.documentElement.style.setProperty("--viewport-right", `${viewport.offsetLeft + viewport.width}px`);
    document.documentElement.style.setProperty("--viewport-bottom", `${viewport.offsetTop + viewport.height}px`);

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
    if (!link.dataset.altText) {
        link.dataset.originalText = link.innerHTML;
        link.dataset.altText = `
                oooooooo------------cks.<br>
                ooooooooooooooonow.<br>
                coc..ooooooooooooook<br>
                oooooooooo-------ck fuck`;
        link.dataset.thirdText = `
                yyyyyyyyyyyyyy------cks.<br>
                yyyyyyyyyyyyyyyyyyyyw.<br>
                cyyyyyyyyyyyyyyyyyyyyk<br>
                yyyyyyyyyyyyyyyyyyyck fuck`;
    }

    if (link.dataset.leftEdge === undefined) {
        link.style.left = `${link.getBoundingClientRect().left}px`;
        link.style.right = "auto";
        link.dataset.leftEdge = "locked";
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


function toggleBottomSubNavigation(link) {
    const subNav = document.getElementById("bottom-sub-nav");
    const isOpen = subNav.classList.toggle("visible");

    link.classList.toggle("active", isOpen);
    link.setAttribute("aria-expanded", String(isOpen));

    if (isOpen) {
        fitSubNavigation();
    } else if (activeBottomSubLink) {
        activeBottomSubLink.classList.remove("active");
        activeBottomSubLink = null;
    }
}


function activateBottomSubLink(link) {
    if (activeBottomSubLink === link) {
        activeBottomSubLink.classList.remove("active");
        activeBottomSubLink = null;
        return;
    }

    if (activeBottomSubLink) {
        activeBottomSubLink.classList.remove("active");
    }

    activeBottomSubLink = link;
    activeBottomSubLink.classList.add("active");
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
        const availableWidth = Math.max(0, viewportWidth - subNavLeft - 20);
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

    const path = `${appBasePath}${page || ""}`;

    if (window.location.pathname === path) {
        return;
    }

    const state = { page: page || null };
    if (replace) {
        window.history.replaceState(state, "", path);
    } else {
        window.history.pushState(state, "", path);
    }
}


function getPageFromUrl() {
    if (!window.location.pathname.startsWith(appBasePath)) {
        return "";
    }

    return window.location.pathname.slice(appBasePath.length).split("/")[0];
}


function findPageLink(page) {
    return Array.from(document.querySelectorAll("a[onclick]")).find((link) => {
        const handler = link.getAttribute("onclick") || "";
        return handler.includes(`showPage('${page}', this)`);
    });
}


function clearPageState() {
    document.getElementById("overlay")?.remove();
    document.getElementById("content").innerHTML = "";

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
    const link = page ? findPageLink(page) : null;

    clearPageState();

    if (!page) {
        return;
    }

    if (!link) {
        updatePageUrl(null, true);
        return;
    }

    const bottomSubNav = document.getElementById("bottom-sub-nav");
    const toggleLink = document.querySelector(
        '#right-text a[aria-controls="bottom-sub-nav"]'
    );
    const showBottomSubNav = page === "o13";
    bottomSubNav.classList.toggle("visible", showBottomSubNav);
    toggleLink.classList.toggle("active", showBottomSubNav);
    toggleLink.setAttribute("aria-expanded", String(showBottomSubNav));

    if (showBottomSubNav) {
        fitSubNavigation();
    }

    showPage(page, link, false);
}


window.addEventListener("resize", fitSubNavigation);
window.addEventListener("orientationchange", fitSubNavigation);

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fitSubNavigation);
} else {
    fitSubNavigation();
}


/* page navigation */

function showPage(page, link, updateUrl = true) {
    const content = document.getElementById("content");
    let overlay = document.getElementById("overlay");

    const overlayPages = [
        "o1", "o2", "o3", "o4", "o5",
        "o6", "o7", "o8", "o9", "o10", "o13"
    ];


    /* main navigation */

    if (!overlayPages.includes(page)) {

        overlay?.remove();
        currentOverlay = null;

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
        if (updateUrl) {
            updatePageUrl(page);
        }


        /* prints (sd) */

        if (page === "sd") {
            content.innerHTML = `
<div class="print-item">
    <a href="pic/print/Scan_20260119 (2).jpg" target="_blank">
        <img src="pic/print/Scan_20260119 (2).jpg" width="1251" height="1807">
    </a>

    <div class="print-description">
        :::::<br>
        :::::<br>
        :::::<br>
        :::::<br>
        :::::<br>
        :::::
    </div>

<div class="side-images">
    <img src="pic/print/Scan_20260119 (20).jpg" width="3252" height="2112"><br>
    <img src="pic/print/Scan_20260119 (20).jpg" width="3252" height="2112"><br>
    <img src="pic/print/Scan_20260119 (20).jpg" width="3252" height="2112">

    <div class="side-image-text">
    <br><br><br><br><br>
        :::::::::::::::<br>
        :::::::::::::::<br>
        :::::::::::::::<br><br><br><br><br>
        :::::::::::::::<br><br><br><br><br><br><br><br><br><br><br><br>
        :::::::::::::::
    </div>
</div>

</div>

            <div class="print-item">
                <a href="pic/print/Scan_20260119.jpg" target="_blank">
                    <img src="pic/print/Scan_20260119.jpg" width="3327" height="2125">
                </a>

                <div class="print-description">
                    :::::<br>
                    :::::<br>
                    :::::<br>
                    :::::<br>
                    :::::<br>
                    :::::<br>
                </div>
            </div>

            <a id="print-text" href="#" onclick="togglePrintText(this); return false;">
                abo--------------------------cks.<br>
                gnow gnow gnow gnow.<br>
                coc.........................fuck<br>
                nig-----------------------ck fuck
            </a>
        `;
        }


        /* w */

        if (page === "w") {
            content.innerHTML = `
                <div class="w-item">
                    <img src="pic/w/20240605_013611.jpg" width="4000" height="3000">

                    <div class="w-description">
                        :::::<br>
                        :::::<br>
                        :::::<br>
                        :::::<br>
                        :::::<br>
                        :::::<br>
                    </div>
                </div>
            `;
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
            content.innerHTML = "";
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
                        src="https://www.tiktok.com/player/v1/7685288523800382734?embed_from=oembed&music_info=1&description=1&autoplay=1&loop=1&muted=0&volume=100"
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
