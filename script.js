
let currentPage = null;
let currentOverlay = null;

function showPage(page) {
    const content = document.getElementById("content");
    let overlay = document.getElementById("overlay");

    const overlayPages = ["o1", "o2", "o3", "o4", "o5", "o6", "o7", "o8", "o9", "o10"];

    // Handle overlay categories separately
    if (overlayPages.includes(page)) {
        if (currentOverlay === page) {
            overlay?.remove();
            currentOverlay = null;
            return;
        }

     if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "overlay";

    overlay.addEventListener("click", function(event) {
        if (event.target === overlay) {
            overlay.remove();
            currentOverlay = null;
        }
    });

    document.body.appendChild(overlay);
}

        overlay.innerHTML = "";
        currentOverlay = page;

        if (page === "o2") {
            overlay.innerHTML = `
                <iframe
                    src="https://www.youtube.com/embed/piMIPHVneOg"
                    width="560"
                    height="315"
                    allowfullscreen>
                </iframe>
            `;
        }

        return;
    }

    // Handle main categories
    overlay?.remove();
    currentOverlay = null;

    if (currentPage === page) {
        content.innerHTML = "";
        currentPage = null;
        return;
    }

    currentPage = page;

    if (page === "prints") {
        content.innerHTML = `
            <a href="pic/print/Scan_20260119 (2).jpg" target="_blank">
                <img src="pic/print/Scan_20260119 (2).jpg">
            </a>

            <a href="pic/print/Scan_20260119.jpg" target="_blank">
                <img src="pic/print/Scan_20260119.jpg">
            </a>

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
