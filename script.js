document.addEventListener("DOMContentLoaded", () => {

    const sheetURL = "https://opensheet.elk.sh/1hhE1DXSssZx58JdEpn6AXbroXcOiht0AcaDPlvvfe_U/news";
    const container = document.querySelector(".news-container");
    const hamburger = document.getElementById("hamburger");
    const navLinksContainer = document.getElementById("nav-links");
    const navLinks = document.querySelectorAll(".nav-links li a");

    let allNews = [];

    /* ===============================
       HAMBURGER TOGGLE
    =============================== */
    if (hamburger && navLinksContainer) {
    hamburger.addEventListener("click", () => {
        navLinksContainer.classList.toggle("active");
        hamburger.classList.toggle("toggle");
    });
}

    /* ===============================
       TIMESTAMP PARSER
    =============================== */
    function parseUgandaTimestamp(timestamp) {
        if (!timestamp) return new Date();
        const [datePart, timePart] = timestamp.split(" ");
        const [day, month, year] = datePart.split("/");
        const [hours, minutes, seconds] = (timePart || "").split(":");

        return new Date(
            year,
            month - 1,
            day,
            hours || 0,
            minutes || 0,
            seconds || 0
        );
    }

    /* ===============================
       TIME AGO FUNCTION
    =============================== */
    function timeAgo(date) {
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return `Posted ${seconds} seconds ago`;

        const minutes = Math.floor(seconds / 60);
        if (minutes < 60)
            return `Posted ${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;

        const hours = Math.floor(minutes / 60);
        if (hours < 24)
            return `Posted ${hours} ${hours === 1 ? "hour" : "hours"} ago`;

        const days = Math.floor(hours / 24);
        if (days < 30)
            return `Posted ${days} ${days === 1 ? "day" : "days"} ago`;

        const months = Math.floor(days / 30);
        if (months < 12)
            return `Posted ${months} ${months === 1 ? "month" : "months"} ago`;

        const years = Math.floor(months / 12);
        return `Posted ${years} ${years === 1 ? "year" : "years"} ago`;
    }

    /* ===============================
       MODAL
    =============================== */
    const modal = document.getElementById("newsModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalDescription = document.getElementById("modalDescription");
    const modalImage = document.getElementById("modalImage");
    const closeBtn = document.querySelector(".close");

    function openModal(title, description, image) {
        modalTitle.textContent = title;
        modalDescription.textContent = description;

        if (image) {
            modalImage.src = image;
            modalImage.style.display = "block";
        } else {
            modalImage.style.display = "none";
        }

        modal.style.display = "flex";
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }

    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });

    /* ===============================
       RENDER NEWS CARDS
    =============================== */
    function renderNews(newsArray) {
        container.innerHTML = "";

        if (!newsArray.length) {
            container.innerHTML = "<p>No news found.</p>";
            return;
        }

        newsArray.forEach(item => {
            const parsedDate = parseUgandaTimestamp(item.Timestamp);
            const imageUrl = item.Filename;

            const card = document.createElement("div");
            card.className = "news-card";

            card.dataset.category = (item.Category || "General").toLowerCase();

            card.innerHTML = `
                <span class="category">${item.Category || "General"}</span>
                ${imageUrl ? `<img src="${imageUrl}" alt="${item.Title || "News"}">` : ""}
                <h3>${item.Title || "No Title"}</h3>
                <p>${item.Headline || ""}</p>
                <span class="time">${timeAgo(parsedDate)}</span>
            `;

            card.addEventListener("click", () => {
                openModal(
                    item.Title || "No Title",
                    item["Full Description"] || "",
                    imageUrl
                );
            });

            container.appendChild(card);
        });
    }

    /* ===============================
       TAB FILTERING (BY BADGE)
    =============================== */
    function setupFiltering() {
        navLinks.forEach(link => {
            link.addEventListener("click", (e) => {

                const href = link.getAttribute("href");

                // Ignore external links like submit.html
                if (!href.startsWith("#")) return;

                e.preventDefault();

                const category = href.replace("#", "").toLowerCase();

                navLinks.forEach(l => l.classList.remove("active"));
                link.classList.add("active");

                if (category === "all") {
                    renderNews(allNews);
                } else {
                    const filtered = allNews.filter(item =>
                        (item.Category || "General")
                            .toLowerCase()
                            .trim() === category
                    );
                    renderNews(filtered);
                }

                // Close mobile menu after selection
                navLinksContainer.classList.remove("active");
                hamburger.classList.remove("toggle");
            });
        });
    }

    /* ===============================
       LOAD NEWS FROM GOOGLE SHEETS
    =============================== */
    async function loadNews() {
        try {
            const response = await fetch(sheetURL);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();

            if (!Array.isArray(data) || data.length === 0) {
                container.innerHTML = "<p>No news available.</p>";
                return;
            }

            allNews = data.reverse(); // latest first
            renderNews(allNews);
            setupFiltering();

        } catch (error) {
            console.error("Failed to load news:", error);
            container.innerHTML = "<p>Error loading news.</p>";
        }
    }

    loadNews();


    /* ===============================
       ADS SLIDESHOW
    =============================== */
    const ads = [
        { image: "screen.jfif", caption: "Screen replacement & repair – 0760638570", badge: "Electronics" },
        { image: "rody.jpeg", caption: "Special Discount – 30% Off!", badge: "Entertainment" },
        { image: "staurt.jpeg", caption: "New Tech Devices Available Now!", badge: "Electronics" },
        { image: "sport.jpg", caption: "Join Our Sports Academy Today!", badge: "Sports" }
    ];

    const adTrack = document.getElementById("adTrack");

    if (adTrack) {

        function createAd(ad) {
            const adItem = document.createElement("div");
            adItem.className = "ad-item";

            adItem.innerHTML = `
                <span class="ad-badge">${ad.badge}</span>
                <img src="${ad.image}" loading="lazy">
                <div class="ad-caption">${ad.caption}</div>
            `;

            return adItem;
        }

        ads.forEach(ad => adTrack.appendChild(createAd(ad)));
        ads.forEach(ad => adTrack.appendChild(createAd(ad)));
    }

});
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js")
    .then(() => console.log("Service Worker Registered"));
}