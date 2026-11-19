
/* general */

let currentPage = null;
let currentOverlay = null;
let activeMainLink = null;
let activeSubLink = null;

function openImagePreview(src) {
    let preview = document.getElementById("image-preview");

    if (!preview) {
        preview = document.createElement("div");
        preview.id = "image-preview";
        preview.addEventListener("click", () => preview.remove());
        document.body.appendChild(preview);
    }

    preview.innerHTML = `<img src="${src}" alt="">`;
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


function fitSubNavigation() {
    const subNav = document.getElementById("sub-nav");

    if (!subNav) {
        return;
    }

    const links = Array.from(subNav.querySelectorAll("a"));

    if (!links.length) {
        return;
    }

    links.forEach((link) => {
        if (!link.dataset.originalMargin) {
            link.dataset.originalMargin = window.parseFloat(link.style.marginLeft) || 0;
        }

        link.style.marginLeft = `${link.dataset.originalMargin}px`;
    });

    const subNavLeft = subNav.getBoundingClientRect().left;
    const viewportWidth = window.visualViewport
        ? Math.min(window.innerWidth, window.visualViewport.width)
        : window.innerWidth;
    const availableWidth = Math.max(0, viewportWidth - subNavLeft - 20);
    const linksWidth = links.reduce((total, link) => total + link.getBoundingClientRect().width, 0);
    const totalOriginalMargin = links.reduce(
        (total, link) => total + window.parseFloat(link.dataset.originalMargin),
        0
    );
    const gapsWidth = Math.max(0, links.length - 1) * 10;
    const naturalWidth = linksWidth + totalOriginalMargin + gapsWidth;

    let fitFactor = 1;

    if (naturalWidth > availableWidth) {
        fitFactor = Math.max(
            0,
            (availableWidth - linksWidth - gapsWidth) / totalOriginalMargin
        );
    }

    links.forEach((link) => {
        link.style.marginLeft = `${window.parseFloat(link.dataset.originalMargin) * fitFactor}px`;
    });
}

window.addEventListener("resize", fitSubNavigation);
window.addEventListener("orientationchange", fitSubNavigation);

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fitSubNavigation);
} else {
    fitSubNavigation();
}


/* page navigation */

function showPage(page, link) {
    const content = document.getElementById("content");
    let overlay = document.getElementById("overlay");

    const overlayPages = [
        "o1", "o2", "o3", "o4", "o5",
        "o6", "o7", "o8", "o9", "o10"
    ];


    /* main navigation */

    if (!overlayPages.includes(page)) {

        overlay?.remove();
        currentOverlay = null;

        if (activeSubLink) {
            activeSubLink.classList.remove("active");
            activeSubLink = null;
        }

        // clicking the active main category closes it
        if (currentPage === page) {
            content.innerHTML = "";
            currentPage = null;

            if (activeMainLink) {
                activeMainLink.classList.remove("active");
                activeMainLink = null;
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


        /* prints */

        if (page === "prints") {
            content.innerHTML = `
<div class="print-item">
    <a href="pic/print/Scan_20260119 (2).jpg" onclick="openImagePreview(this.href); return false;">
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
                <a href="pic/print/Scan_20260119.jpg" onclick="openImagePreview(this.href); return false;">
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

            <a id="print-text" href="#">
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
                    <a href="pic/w/20240605_013611.jpg" onclick="openImagePreview(this.href); return false;">
                        <img src="pic/w/20240605_013611.jpg" width="4000" height="3000">
                    </a>

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
            return;
        }

        // remove previous sub-menu active colour
        if (activeSubLink) {
            activeSubLink.classList.remove("active");
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
                }
            });

            document.body.appendChild(overlay);
        }

        overlay.innerHTML = "";
        currentOverlay = page;


        /* o1 */


        /* o2 video */

        if (page === "o2") {
            overlay.innerHTML = `
                <div class="video-side-text left">------------------------------------</div>

                <iframe
                    src="https://www.youtube.com/embed/piMIPHVneOg?controls=0&modestbranding=1&rel=0"
                    width="550"
                    height="415"
                    allow="autoplay; encrypted-media"
                    allowfullscreen>
                </iframe>

                <div class="video-side-text right">------------------------------------</div>
            `;
        }


        /* o3 */


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


        /* o5 */


        /* o6 */


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


        /* o10 */

        return;
    }
}
