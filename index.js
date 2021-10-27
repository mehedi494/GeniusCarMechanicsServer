
const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors')

const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;

// Middleware
app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9hokh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    
    try {
        await client.connect();
        // console.log('connet data base')
        const database = client.db('GeniusCarMechanics');
        const servicesCollection = database.collection('services');
        
        // GET Single Services
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('hit service')
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query)
            res.json(service);
        })
        // GET  API ALL Services 
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);
            const result = await servicesCollection.insertOne(service);
            console.log(result)
            res.json(result)
        })

        // Delete Api
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.deleteOne(query)
            res.json(result);
        })

        
    }
    finally {
        // client.close();
        
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('SERVER IS RUNNING...');
})

app.listen(port, () => {
    console.log("Server is run on",port)
})