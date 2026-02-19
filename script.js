document.addEventListener("DOMContentLoaded", () => {

    const sheetURL = "https://opensheet.elk.sh/1hhE1DXSssZx58JdEpn6AXbroXcOiht0AcaDPlvvfe_U/Form%20Responses%201";
    const container = document.querySelector(".news-container");

    // ---------------- Timestamp Parser ----------------
    function parseUgandaTimestamp(timestamp) {
        if (!timestamp) return new Date();

        const [datePart, timePart] = timestamp.split(" ");
        if (!datePart || !timePart) return new Date();

        const [day, month, year] = datePart.split("/");
        const [hours, minutes, seconds] = timePart.split(":");

        return new Date(year, month - 1, day, hours, minutes, seconds);
    }

    // ---------------- Convert Drive Links ----------------
    function convertDriveLink(url) {
        if (!url) return "placeholder.jpg";

        const idMatch =
            url.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
            url.match(/id=([a-zA-Z0-9_-]+)/);

        return idMatch
            ? `https://drive.google.com/uc?export=view&id=${idMatch[1]}`
            : url;
    }

    // ---------------- Load News ----------------
    async function loadNews() {
        try {
            console.log("Loading news...");

            const response = await fetch(sheetURL);
            const data = await response.json();

            console.log("Fetched data:", data);

            if (!Array.isArray(data)) {
                console.error("Sheet did not return array.");
                container.innerHTML = "<p>No valid news data.</p>";
                return;
            }

            if (!container) {
                console.error("No .news-container found in HTML");
                return;
            }

            container.innerHTML = "";

            [...data].reverse().forEach(item => {

                const parsedDate = parseUgandaTimestamp(item.Timestamp);
                const imageUrl = convertDriveLink(item.File);

                const card = document.createElement("div");
                card.className = "news-card";
                card.dataset.time = parsedDate.toISOString();
                card.dataset.title = item.Title || "No Title";
                card.dataset.description = item["Full Description"] || "";
                card.dataset.category = item.Category || "General";

                card.innerHTML = `
                    <img src="${imageUrl}" alt="${item.Title || "News"}">
                    <h3>${item.Title || "No Title"}</h3>
                    <p>${item.Headline || ""}</p>
                    <span class="time">${parsedDate.toLocaleString()}</span>
                `;

                container.appendChild(card);
            });

        } catch (error) {
            console.error("Failed to load news:", error);
            container.innerHTML = "<p>Error loading news.</p>";
        }
    }

    loadNews();

    // ---------------- Advertisement ----------------
    const ads = [
        { image: "screen.jfif", caption: "Screen replacement & repair – 0760638570" },
        { image: "rody.jpeg", caption: "Special Discount – 30% Off!" },
        { image: "staurt.jpeg", caption: "New Tech Devices Available Now!" },
        { image: "sport.jpg", caption: "Join Our Sports Academy Today!" }
    ];

    const adTrack = document.getElementById("adTrack");

    if (adTrack) {
        ads.forEach(ad => {
            const adItem = document.createElement("div");
            adItem.className = "ad-item";
            adItem.innerHTML = `
                <img src="${ad.image}">
                <div>${ad.caption}</div>
            `;
            adTrack.appendChild(adItem);
        });
    }

});