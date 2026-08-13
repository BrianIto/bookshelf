const GOOGLE_API_KEY = import.meta.env?.VITE_GOOGLE_API_KEY || "AIzaSyCnatWoC5Hg64p0QYti4CPtA52vLbr1atM";

async function fetchVolumes(query, maxResults) {
	const url = new URL("https://www.googleapis.com/books/v1/volumes");
	url.searchParams.append("q", query);
	url.searchParams.append("key", GOOGLE_API_KEY);
	url.searchParams.append("maxResults", String(maxResults));
	url.searchParams.append("printType", "books");
	url.searchParams.append("startIndex", "0");

	const response = await fetch(url);
	if (!response.ok) throw new Error(`Google Books request failed: ${response.status}`);
	return response.json();
}

export const searchVolumes = (query) => fetchVolumes(query, 10);

/** Returns one book from Google Books for the hero recommendation. */
export async function getRecommendedBook(query = "Pride and Prejudice") {
	const data = await fetchVolumes(query, 10);
	const books = data.items || [];

	return (
		books.find(
			(book) =>
				book.volumeInfo?.title &&
				(book.volumeInfo?.imageLinks?.thumbnail ||
					book.volumeInfo?.imageLinks?.smallThumbnail),
		) || books.find((book) => book.volumeInfo?.title) || null
	);
}
