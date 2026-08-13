import { getRecommendedBook, searchVolumes } from "./api/googlebooks.js";
import "../styles/style.css";

const app = document.querySelector("#app");

const icons = {
	search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4.5 4.5"></path></svg>',
	arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"></path></svg>',
	bookmark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4.8A1.8 1.8 0 0 1 7.8 3h8.4A1.8 1.8 0 0 1 18 4.8V21l-6-3-6 3V4.8Z"></path></svg>',
	chevron: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"></path></svg>',
};

const fallbackBooks = [
	{
		volumeInfo: {
			title: "The Art of Stillness",
			authors: ["Pico Iyer"],
			categories: ["Self-help"],
			description:
				"Adventures in a world of nonstop distraction.",
			imageLinks: {
				thumbnail: "https://books.google.com/books/content?id=QnQdDAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl",
			},
		},
	},
	{
		volumeInfo: {
			title: "Braiding Sweetgrass",
			authors: ["Robin Wall Kimmerer"],
			categories: ["Nature"],
			description:
				"Indigenous wisdom, scientific knowledge, and the teachings of plants.",
		},
	},
	{
		volumeInfo: {
			title: "The Midnight Library",
			authors: ["Matt Haig"],
			categories: ["Fiction"],
			description:
				"Between life and death there is a library.",
		},
	},
	{
		volumeInfo: {
			title: "Atomic Habits",
			authors: ["James Clear"],
			categories: ["Personal development"],
			description: "Tiny changes, remarkable results.",
		},
	},
	{
		volumeInfo: {
			title: "Tomorrow, and Tomorrow, and Tomorrow",
			authors: ["Gabrielle Zevin"],
			categories: ["Fiction"],
			description:
				"A story of friendship, creativity, and love.",
		},
	},
];

function escapeHtml(value = "") {
	return String(value).replace(
		/[&<>"']/g,
		(char) =>
			({
				"&": "&amp;",
				"<": "&lt;",
				">": "&gt;",
				'"': "&quot;",
				"'": "&#039;",
			})[char],
	);
}

function getCover(book) {
	const image =
		book.volumeInfo?.imageLinks?.thumbnail ||
		book.volumeInfo?.imageLinks?.smallThumbnail;
	return image ? image.replace("http://", "https://") : "";
}

function populateHeroBook(book) {
	const info = book.volumeInfo || {};
	const title = info.title || "Untitled book";
	const cover = getCover(book);
	const heroTitle = document.querySelector("#hero-title");
	const heroAuthor = document.querySelector("#hero-author");
	const heroDescription = document.querySelector("#hero-description");
	const heroCover = document.querySelector("#hero-cover");
	const heroLink = document.querySelector("#hero-read-link");

	heroTitle.textContent = title;
	heroAuthor.textContent = `by ${info.authors?.join(", ") || "Unknown author"}`;
	heroDescription.textContent =
		info.description || "Discover a book selected especially for you.";
	heroCover.src = cover || "/src/assets/hero.png";
	heroCover.alt = `${title} book cover`;
	heroLink.href = book.accessInfo?.webReaderLink || info.previewLink || "#";
}

async function loadHeroBook() {
	const status = document.querySelector("#hero-status");
	status.textContent = "Loading your recommended book.";

	try {
		const book = await getRecommendedBook();
		if (!book) throw new Error("No recommended book found");
		populateHeroBook(book);
		status.textContent = "Recommended book loaded.";
	} catch (error) {
		console.warn("Hero book request failed:", error);
		status.textContent = "Showing the default recommended book.";
	}
}

function bookCard(book, index) {
	const info = book.volumeInfo || {};
	const title = info.title || "Untitled book";
	const author = info.authors?.join(", ") || "Unknown author";
	const category =
		info.categories?.[0] ||
		["Fiction", "Essays", "Ideas", "Wellbeing"][index % 4];
	const cover = getCover(book);
	const color = ["coral", "sage", "lavender", "gold", "blue"][index % 5];
	const link = book.accessInfo?.webReaderLink || info.previewLink || "#";
	return `<article class="book-card">
    <div class="cover cover-${color}">${cover ? `<img src="${escapeHtml(cover)}" alt="Cover of ${escapeHtml(title)}" loading="lazy">` : `<span>${escapeHtml(title.split(" ").slice(0, 2).join(" "))}</span>`}<button class="save-button" aria-label="Save ${escapeHtml(title)}">${icons.bookmark}</button></div>
    <div class="book-copy"><p class="book-category">${escapeHtml(category)}</p><h3>${escapeHtml(title)}</h3><p class="author">${escapeHtml(author)}</p><a class="preview-link" href="${escapeHtml(link)}" target="_blank" rel="noreferrer">Preview book ${icons.arrow}</a></div>
  </article>`;
}

async function loadBooks(query = "subject:fiction") {
	const grid = document.querySelector("#book-grid");
	grid.innerHTML =
		'<div class="loading-message">Gathering a few good stories<span>...</span></div>';
	try {
		const data = await searchVolumes(query);
		const books = (data.items || [])
			.filter((book) => book.volumeInfo?.title)
			.slice(0, 10);
		if (!books.length) throw new Error("No books found");
		grid.innerHTML = books.map(bookCard).join("");
	} catch (error) {
		console.warn("Google Books request failed:", error);
		grid.innerHTML = fallbackBooks.map(bookCard).join("");
	}
}

const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector("#book-search");
const searchButton = document.querySelector(".icon-button");

searchForm?.addEventListener("submit", (event) => {
	event.preventDefault();
	const query = searchInput?.value.trim();
	if (query) {
		document.querySelector("#featured")?.scrollIntoView({
			behavior: "smooth",
		});
		loadBooks(query);
	}
});
searchButton?.addEventListener("click", () => searchInput?.focus());

loadHeroBook();

if (document.querySelector("#book-grid")) loadBooks();
