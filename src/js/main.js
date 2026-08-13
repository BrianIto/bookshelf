import { searchVolumes } from "./api/googlebooks.js";
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

function renderShell() {
	app.innerHTML = `<header class="site-header"><a class="brand" href="#"><span class="brand-mark">b</span><span>bookish</span></a><nav><a class="active" href="#featured">Discover</a><a href="#categories">Categories</a><a href="#about">About us</a></nav><div class="header-actions"><button class="icon-button" aria-label="Search">${icons.search}</button><button class="profile-button" aria-label="Your profile">BM</button></div></header>
  <main><section class="hero"><div class="hero-content"><p class="eyebrow">A good book is always a good idea</p><h1>Find your next<br><em>favorite</em> story.</h1><p class="hero-text">Curated reads for curious minds. Explore books that make you think, feel, and see the world a little differently.</p><form class="search-form"><label for="book-search" class="sr-only">Search for a book</label><span>${icons.search}</span><input id="book-search" type="search" placeholder="Search by title, author, or topic" autocomplete="off"><button type="submit">Search</button></form></div><div class="hero-art" aria-hidden="true"><div class="sun"></div><div class="line line-one"></div><div class="line line-two"></div><div class="art-book art-book-back">READ<br>MORE</div><div class="art-book art-book-front">slow<br>mornings</div><span class="scribble">✳</span></div></section><section class="featured-section" id="featured"><div class="section-heading"><div><p class="eyebrow">Handpicked for you</p><h2>Featured books</h2></div><a class="view-all" href="#featured">View all ${icons.arrow}</a></div><div class="book-grid" id="book-grid"><div class="loading-message">Gathering a few good stories<span>...</span></div></div></section><section class="topic-strip" id="categories"><div><p class="eyebrow">What are you in the mood for?</p><h2>Browse by feeling</h2></div><div class="topics"><a href="#featured">Something inspiring ${icons.chevron}</a><a href="#featured">A new perspective ${icons.chevron}</a><a href="#featured">A little escape ${icons.chevron}</a></div></section></main><footer id="about"><a class="brand" href="#"><span class="brand-mark">b</span><span>bookish</span></a><p>For the love of a good story.</p><span>© 2024 bookish</span></footer>`;
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

renderShell();
document.querySelector(".search-form").addEventListener("submit", (event) => {
	event.preventDefault();
	const query = document.querySelector("#book-search").value.trim();
	if (query) {
		document.querySelector("#featured").scrollIntoView({
			behavior: "smooth",
		});
		loadBooks(query);
	}
});
document.querySelector(".icon-button").addEventListener("click", () =>
	document.querySelector("#book-search").focus(),
);
loadBooks();
