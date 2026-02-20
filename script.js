document.addEventListener("DOMContentLoaded", () => {
    const sheetURL = "https://opensheet.elk.sh/1hhE1DXSssZx58JdEpn6AXbroXcOiht0AcaDPlvvfe_U/news";
    const container = document.querySelector(".news-container");

    // ---------------- Timestamp Parser ----------------
    function parseUgandaTimestamp(timestamp) {
        if (!timestamp) return new Date();
        const [datePart, timePart] = timestamp.split(" ");
        const [day, month, year] = datePart.split("/");
        const [hours, minutes, seconds] = (timePart || "").split(":");
        return new Date(year, month - 1, day, hours || 0, minutes || 0, seconds || 0);
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

    // ---------------- Modal ----------------
    const modal = document.getElementById("newsModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalDescription = document.getElementById("modalDescription");
    const modalImage = document.getElementById("modalImage");

    function openModal(title, description, image) {
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        if (image) {
            modalImage.src = image;
            modalImage.style.display = "block";
        } else {
            modalImage.style.display = "none";
        }
        modal.style.display = "block";
    }

    document.querySelector(".close").addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });

    function timeAgo(date) {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} months ago`;
    const years = Math.floor(months / 12);
    return `${years} years ago`;
}

    // ---------------- Load News ----------------
    async function loadNews() {
        if (!container) return console.error("No .news-container found");

        try {
            const response = await fetch(sheetURL);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            if (!Array.isArray(data) || data.length === 0) {
                container.innerHTML = "<p>No news available.</p>";
                return;
            }

            container.innerHTML = "";

            data.reverse().forEach(item => {
                const parsedDate = parseUgandaTimestamp(item.Timestamp);
                const imageUrl = convertDriveLink(item.File);

                const card = document.createElement("div");
                card.className = "news-card";
                card.dataset.title = item.Title || "No Title";
                card.dataset.description = item["Full Description"] || "";
                card.dataset.image = imageUrl;

                card.innerHTML = `
                    <img src="${imageUrl}" alt="${item.Title || "News"}">
                    <h3>${item.Title || "No Title"}</h3>
                    <p>${item.Headline || ""}</p>
                    <span class="time">${timeAgo(parsedDate)}</span>
                `;

                // Event listener for modal
                card.addEventListener("click", () => {
                    openModal(card.dataset.title, card.dataset.description, card.dataset.image);
                });

                container.appendChild(card);
            });

        } catch (err) {
            console.error("Failed to load news:", err);
            container.innerHTML = "<p>Error loading news.</p>";
        }
    }

    loadNews();

    // ---------------- Ads ----------------
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
                <img src="${ad.image}" alt="Ad">
                <div>${ad.caption}</div>
            `;
            adTrack.appendChild(adItem);
        });
    }
});