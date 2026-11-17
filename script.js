
let currentPage = null;
let currentOverlay = null;
let activeMainLink = null;
let activeSubLink = null;

function showPage(page, link) {
    const content = document.getElementById("content");
    let overlay = document.getElementById("overlay");

    const overlayPages = ["o1", "o2", "o3", "o4", "o5", "o6", "o7", "o8", "o9", "o10"];

    // Handle sub-navigation
    if (overlayPages.includes(page)) {

        // Close the currently open sub-menu if clicked again
        if (currentOverlay === page) {
            overlay?.remove();
            currentOverlay = null;

            if (activeSubLink) {
                activeSubLink.classList.remove("active");
                activeSubLink = null;
            }
            return;
        }

        // Remove previous sub-menu active colour
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

if (page === "o2") {
    overlay.innerHTML = `
        <div class="video-side-text left">-------------------------------------------------------------</div>

<iframe
    src="https://www.youtube.com/embed/piMIPHVneOg?controls=0&modestbranding=1&rel=0"
    width="550"
    height="415"
    allow="autoplay; encrypted-media"
    allowfullscreen>
</iframe>

        <div class="video-side-text right">-------------------------------------------------------------</div>
    `;
}

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
        ------------------------------------<br>
        ------------------------------------<br>
        ------------------------------------<br>
        ------------------------------------<br>
        ------------------------------------------------------------------------------------------------------------<br>
        </div>
    `;
}

if (page === "o8") {
    overlay.innerHTML = `
        <img src="pic/rnd/20260207_144703.png" class="center-picture">
    `;
}

        return;
    }

    // Handle main navigation
    overlay?.remove();
    currentOverlay = null;

    if (activeSubLink) {
        activeSubLink.classList.remove("active");
        activeSubLink = null;
    }

    // Clicking the active main category closes it
    if (currentPage === page) {
        content.innerHTML = "";
        currentPage = null;

        if (activeMainLink) {
            activeMainLink.classList.remove("active");
            activeMainLink = null;
        }
        return;
    }

    // Switch main category
    if (activeMainLink) {
        activeMainLink.classList.remove("active");
    }

    activeMainLink = link;
    activeMainLink.classList.add("active");

    currentPage = page;

    if (page === "prints") {
        content.innerHTML = `
<div class="print-item">
    <a href="pic/print/Scan_20260119 (2).jpg" target="_blank">
        <img src="pic/print/Scan_20260119 (2).jpg">
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

<div class="print-item">
    <a href="pic/print/Scan_20260119.jpg" target="_blank">
        <img src="pic/print/Scan_20260119.jpg">
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
                about the filthies, the knick knocks.<br>
                gnow gnow gnow gnow.<br>
                cock nigger bitch fuck<br>
                nig boy we dont like cock fuck
            </a>
        `;
    }

    if (page === "w") content.innerHTML = "";
    if (page === "e") content.innerHTML = "";
    if (page === "m") content.innerHTML = "";
    if (page === "links") content.innerHTML = "";
    if (page === "cock") content.innerHTML = "";
}

