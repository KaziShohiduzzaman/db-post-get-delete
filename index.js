const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');


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

            //Post api for Tour 
            app.post('/users', async (req, res) => {
                const user = req.body;
                const result = await usersCollection.insertOne(user);
                res.json(result)
            })

            //DELETE api for manage tour
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
    res.send('Arif Db Connected')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
