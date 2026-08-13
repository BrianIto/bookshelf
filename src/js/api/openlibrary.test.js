import { bookSearch } from "./openlibrary.js";

describe("getAuthors", () => {
	it("should call get with the correct URL and options", async () => {
		let r = await bookSearch({
			page: 1,
			search: "tolkien",
		}).then((res) => res.json());
		console.log(r);
	});
});
