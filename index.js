const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORt || 5000;

// middleware
app.use(cors());
app.use(express.json());
console.log(process.env.DB_USER);

// connect database

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fkxltzv.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const categoryCollection = client
      .db("usedphones-hub")
      .collection("categories");

    const productCollection = client
      .db("usedphones-hub")
      .collection("products");

    const bookedCollection = client.db("usedphones-hub").collection("booked");

    const userCollection = client.db("usedphones-hub").collection("users");

    //Load Category
    app.get("/category", async (req, res) => {
      const query = {};
      const cursor = categoryCollection.find(query);
      const category = await cursor.toArray();
      res.send(category);
    });
    // Load products by single category
    app.get("/category/:id", async (req, res) => {
      const id = parseInt(req.params.id);
      const query = { idno: id };
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });
    // add users
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
    //   get users
    app.get("/users", async (req, res) => {
      const query = {};
      const cursor = await userCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });
    // get specific user by email
    app.get("/user", async (req, res) => {
      const email = req.query.email;

      const query = { email: email };
      const user = await userCollection.find(query).toArray();
      res.send(user);
    });
    // get booked items
    app.get("/bookeditems", async (req, res) => {
      const email = req.query.email;

      const query = { email: email };
      const bookedItems = await bookedCollection.find(query).toArray();

      res.send(bookedItems);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));
//

app.listen(port, () => {
  console.log("server running on port:", port);
});
