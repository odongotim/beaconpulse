document.addEventListener("DOMContentLoaded", () => {

    // ---------------- Hamburger Menu ----------------
    const hamburger = document.getElementById("hamburger");
    const navLinksContainer = document.getElementById("nav-links");

    if (hamburger && navLinksContainer) {
        hamburger.addEventListener("click", () => {
            navLinksContainer.classList.toggle("active");
            hamburger.classList.toggle("toggle");
        });
    }

    // ---------------- Sort Posts by Newest ----------------
    function sortPosts() {
        const container = document.querySelector(".news-container");
        if (!container) return;

        const posts = Array.from(container.querySelectorAll(".news-card"));
        posts.sort((a, b) => new Date(b.dataset.time) - new Date(a.dataset.time));
        posts.forEach(post => container.appendChild(post));
    }

    // ---------------- Time Ago ----------------
    function getTimeAgo(dateString) {
    const now = new Date();
    const postTime = new Date(dateString);
    const diffMs = now - postTime;

    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(weeks / 4);
    const years = Math.floor(months / 12);

    if (minutes < 60) {
        return minutes <= 1 ? "1 minute ago" : `${minutes} minutes ago`;
    }

    if (hours < 24) {
        return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    }

    if (days < 7) {
        return days === 1 ? "1 day ago" : `${days} days ago`;
    }

    if (weeks < 4) {
        return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
    }

    if (months < 12) {
        return months === 1 ? "1 month ago" : `${months} months ago`;
    }
    
    return years === 1 ? "1 year ago" : `${years} years ago`;
}


    function updateTime() {
        document.querySelectorAll(".news-card").forEach(card => {
            const timeElement = card.querySelector(".time");
            if (timeElement) timeElement.textContent = "Posted " + getTimeAgo(card.dataset.time);
        });

        const alertSection = document.querySelector(".alert");
        if (alertSection) {
            const alertTime = alertSection.querySelector(".alert-time");
            if (alertTime) alertTime.textContent = getTimeAgo(alertSection.dataset.time);
        }
    }

    // ---------------- Modal ----------------
    const modal = document.getElementById("newsModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalDescription = document.getElementById("modalDescription");
    const modalImage = document.getElementById("modalImage");
    const modalVideo = document.getElementById("modalVideo");
    const closeBtn = document.querySelector(".close");

    function openModal(title, description, imageSrc = null, videoSrc = null) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        modalTitle.textContent = title;
        modalDescription.innerHTML = description;

        if (imageSrc) {
            modalImage.src = imageSrc;
            modalImage.style.display = "block";
        } else {
            modalImage.style.display = "none";
            modalImage.src = "";
        }

        if (videoSrc) {
            modalVideo.src = videoSrc;
            modalVideo.style.display = "block";
        } else {
            modalVideo.style.display = "none";
            modalVideo.pause();
            modalVideo.src = "";
        }

        modal.style.display = "block";
    }

    function closeModal() {
        modal.style.display = "none";
        if (modalVideo) {
            modalVideo.pause();
            modalVideo.src = "";
        }
    }

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    window.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

    // Open modal for news cards
    document.querySelectorAll(".news-card").forEach(card => {
        card.addEventListener("click", () => {
            openModal(card.dataset.title, card.dataset.description, card.dataset.image, card.dataset.video);
        });
    });

    // Open modal for alert
    const alertSection = document.querySelector(".alert");
    if (alertSection) {
        alertSection.addEventListener("click", () => {
            openModal(alertSection.dataset.title, alertSection.dataset.description, alertSection.dataset.image);
        });
    }

    // ---------------- Search ----------------
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");

    function filterPosts() {
        if (!searchInput) return;
        const query = searchInput.value.toLowerCase();

        document.querySelectorAll(".news-card").forEach(card => {
            const title = card.dataset.title.toLowerCase();
            const desc = card.dataset.description.toLowerCase();
            card.style.display = title.includes(query) || desc.includes(query) ? "block" : "none";
        });

        if (alertSection) {
            const title = alertSection.dataset.title.toLowerCase();
            const desc = alertSection.dataset.description.toLowerCase();
            alertSection.style.display = title.includes(query) || desc.includes(query) ? "block" : "none";
        }
    }

    if (searchBtn) searchBtn.addEventListener("click", filterPosts);
    if (searchInput) searchInput.addEventListener("keyup", filterPosts);

    // ---------------- Category Filtering ----------------
    const navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            const category = this.dataset.category || this.textContent.trim();

            // Skip "Submit Tip"
            if (this.classList.contains("btn-submit")) return;

            e.preventDefault();

            document.querySelectorAll(".news-card").forEach(card => {
                card.style.display = (category === "All" || card.dataset.category === category) ? "block" : "none";
            });

            // Highlight active link
            navLinks.forEach(l => l.classList.remove("active"));
            this.classList.add("active");

            // Close hamburger menu on mobile
            if (window.innerWidth < 768 && hamburger && navLinksContainer) {
                navLinksContainer.classList.remove("active");
                hamburger.classList.remove("toggle");
            }
        });
    });

    // ---------------- Initial Setup ----------------
    sortPosts();
    updateTime();
    setInterval(updateTime, 60000);
});
// ---------------- Advertisement Slideshow ----------------

const ads = [
    {
        image: "screen.jfif",
        link: "",
        caption: "For affordable screen replacement and repair reach to Staurt Enterprises or call 0760638570",
        badge: "Hotest Deal"
    },
    {
        image: "rody.jpeg",
        link: "",
        caption: "Special Discount – 30% Off!",
        badge: "Sponsored"
    },
    {
        image: "staurt.jpeg",
        link: "",
        caption: "New Tech Devices Available Now!",
        badge: "Breaking Deal"
    },
    {
        image: "spot.jfif",
        link: "",
        caption: "Join Our Sports Academy Today!",
        badge: "Sports"
    },
    {
        image: "lotty.jfif",
        link: "",
        caption: "Lotyang Innocent Olum For Guild",
        badge: "Politics"
    },
    {
        image: "pc.jfif",
        link: "",
        caption: "🔥 Affordable laptops for students 🔥 👉For more details and consultation  message or call 0701371126, 0765013616",
        badge: "Breaking Deal"
    },
    {
        image: "laundry.jfif",
        link: "",
        caption: "Start the new semester with sparkling laundry. Ens Laundry is here for you.",
        badge: "New"
    }
];

let currentAd = 0;
let adInterval;

// Get elements
const adImage = document.getElementById("adImage");
const adLink = document.getElementById("adLink");
const adCaption = document.getElementById("adCaption");
const adBadge = document.getElementById("adBadge");
const prevBtn = document.querySelector(".ad-prev");
const nextBtn = document.querySelector(".ad-next");

function showAd(index) {
    if (!adImage) return;

    adImage.style.opacity = 0;

    setTimeout(() => {
        adImage.src = ads[index].image;
        adLink.href = ads[index].link;
        adCaption.textContent = ads[index].caption;
        adBadge.textContent = ads[index].badge;
        adImage.style.opacity = 1;
    }, 300);
}

function nextAd() {
    currentAd = (currentAd + 1) % ads.length;
    showAd(currentAd);
}

function prevAd() {
    currentAd = (currentAd - 1 + ads.length) % ads.length;
    showAd(currentAd);
}

function startAutoRotate() {
    adInterval = setInterval(nextAd, 6000); // 6 seconds
}

function stopAutoRotate() {
    clearInterval(adInterval);
}

// Initialize slideshow
if (adImage && adLink && adCaption && adBadge) {
    showAd(currentAd);
    startAutoRotate();
}

// Button controls
if (nextBtn) nextBtn.addEventListener("click", nextAd);
if (prevBtn) prevBtn.addEventListener("click", prevAd);

// Pause rotation on hover (professional behavior)
if (adImage) {
    adImage.addEventListener("mouseenter", stopAutoRotate);
    adImage.addEventListener("mouseleave", startAutoRotate);
}
