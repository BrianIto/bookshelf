const GOOGLE_API_KEY = import.meta.env?.VITE_GOOGLE_API_KEY || "AIzaSyCnatWoC5Hg64p0QYti4CPtA52vLbr1atM";

export const searchVolumes = async (query) => {
	const url = new URL("https://www.googleapis.com/books/v1/volumes");
	url.searchParams.append("q", query);
	url.searchParams.append("key", GOOGLE_API_KEY);
	url.searchParams.append("maxResults", "10");
	url.searchParams.append("printType", "books");
	url.searchParams.append("startIndex", "0");
	console.log(url.toString());
	const response = await fetch(url);
	if (!response.ok) throw new Error(`Google Books request failed: ${response.status}`);
	return response.json();
};
