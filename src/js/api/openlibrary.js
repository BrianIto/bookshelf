const BASE_URL = "https://gutendex.com";
const GOOGLE_API_KEY = "AIzaSyCnatWoC5Hg64p0QYti4CPtA52vLbr1atM";
/**
 * Fetches data from the Open Library API.
 * @param {string} path - The API endpoint path (e.g., '/books/OL7353617M.json').
 * @param {object} [options] - Optional fetch options (e.g., headers, method).
 * @returns {Promise<Response>} - The fetch response promise.
 */
export async function get(path, options) {
	const url =
		path instanceof URL ? path.toString() : `${BASE_URL}${path}`;

	return fetch(url, {
		...options,
		headers: {
			"User-Agent": "BrianIto (brian.oliveira100@gmail.com)",
			...options?.headers,
		},
	});
}

/**
 * @typedef { object} SearchParams
 * @property {string} [search] - search the results.
 * @property {number} [page] - Page number for paginated results.
 */

/**
 * @typedef { object} Author
 * @property {string} name - The name of the author.
 * @property {string} birth_year - The birth year of the author.
 * @property {string} death_year - The death year of the author.
 */

/**
 * @typedef { object} Book
 * @property {number} id - The unique identifier for the book.
 * @property {string} title - The title of the book.
 * @property {Array<Author>} authors - An array of author objects associated with the book.
 * @property {Array<string>} subjects - An array of subjects related to the book.
 */

/**
 * @typedef { object} SearchResponse
 * @property {number} count - Total number of results.
 * @property {string|null} next - URL for the next page of results, or null if there are no more pages.
 * @property {string|null} previous - URL for the previous page of results, or null if there are no previous pages.
 * @property {Array<Object>} results - Array of book objects containing details about each book.
 */

/**
 * Searches for books in the Open Library API based on a query string.
 * @param {string} query - The search query string.
 * @param {SearchParams} [options] - Optional fetch options (e.g., headers, method).
 * @returns {Promise<Response>} - The fetch response promise containing search results.
 */
export async function bookSearch(options) {
	let url = new URL(`${BASE_URL}/books`);
	if (options?.search) url.searchParams.append("search", options.search);
	if (options?.page !== undefined)
		url.searchParams.append("page", options.page);
	return await get(url);
}
