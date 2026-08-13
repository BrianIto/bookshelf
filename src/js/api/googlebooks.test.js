import { searchVolumes } from "./googlebooks";

describe("google books", () => {
	it("should return search results for a valid query", async () => {
		const query = "Harry Potter";
		searchVolumes(query).then((data) => {
			console.log(data);
			expect(data).toHaveProperty("items");
			expect(data.items.length).toBeGreaterThan(0);
		});
	});
});
