const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// midlewares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hwapsgs.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const bookCollection = client.db('booksDb').collection('books')

        app.get('/books', async (req, res) => {
            // const search = req.query.search;

            // console.log(search);
            const searchTerm = req.query.search;
            const regex = new RegExp(searchTerm, 'i');

            const result = await bookCollection.find({
                $or: [
                    { title: { $regex: regex } },
                    { author: { $regex: regex } },
                    { genre: { $regex: regex } },
                ],
            }).toArray();
            
            res.send(result);
            // console.log(result);
        });





        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);










app.get('/', (req, res) => {
    res.send('Book Recommendation Server are running')
});

app.listen(port, () => {
    console.log(`Book Recommendation Server running on port:${port}`);

})


