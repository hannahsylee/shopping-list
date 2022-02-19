process.env.NODE_ENV = "test";
// npm packages
const request = require("supertest");
// app imports
const app = require("../app");

let items = require("../fakeDb")

let item = { name: "cheerios", price: 3.40 }

beforeEach(function () {
    items.push(item)
});

afterEach(function () {
    items = []
});

describe("GET /items", () => {
    test("Get all items", async () => {
        const res = await request(app).get("/items");
        const { items } = res.body;
        expect(res.statusCode).toBe(200);
        expect(items).toHaveLength(1);
        expect(res.body).toEqual({items: [{name: "cheerios", price: 3.40}]})
    })
})
  
describe("GET /items/:name", () => {
    test("Get item by name", async () => {
        const res = await request(app).get(`/items/${item.name}`);
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({item: item})
    })
    test("Responds with 404 for invalid name", async () => {
        const res = await request(app).get(`/items/chocolate`);
        expect(res.statusCode).toBe(404)
    })
})

describe("POST /items", () => {
    test("Creating a new item", async () => {
      const res = await request(app).post("/items").send({ name: "popsicle", price: 1.45 });
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({ item: [item, { name: "popsicle", price: 1.45 }]});
    })
    test("Responds with 400 if name is missing", async () => {
      const res = await request(app).post("/items").send({});
      expect(res.statusCode).toBe(400);
    })
  })
  
describe("/PATCH /items/:name", () => {
    test("Updating an item's name or price", async () => {
        const res = await request(app).patch(`/items/${item.name}`).send({ name: "oreos", price: 3.00 });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ item: { name: "oreos", price: 3.00 } });
    })
    test("Responds with 404 if can't find item", async () => {
        const res = await request(app).patch(`/items/chocolate`).send({ name: "oreos", price: 3.00 });
        expect(res.statusCode).toBe(404);
    })
})

describe("/DELETE /items/:name", () => {
    test("Deleting an item", async () => {
        const res = await request(app).delete(`/items/${item.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: 'Deleted' })
    })
    test("Responds with 404 for deleting invalid item", async () => {
        const res = await request(app).delete(`/items/strawberry`);
        expect(res.statusCode).toBe(404);
    })
})
// end