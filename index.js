const express = require('express')
const cors = require('cors');
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express()
const port = process.env.PORT || 5000;



//middleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9zo1c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        console.log('Arif db connected');
        const database = client.db('arifDb');
        const usersCollection = database.collection('users');

        //GET users api
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const order = await cursor.toArray();
            res.send(order);

            //Post users api 
            app.post('/users', async (req, res) => {
                const user = req.body;
                const result = await usersCollection.insertOne(user);
                res.json(result)
            })

            //DELETE users api
            app.delete('/users/:id', async (req, res) => {
                const id = req.params.id;
                const query = { _id: ObjectId(id) };
                const result = await usersCollection.deleteOne(query);
                res.json(result)
            })

        })


    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Arif Server Connected')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
