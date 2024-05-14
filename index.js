const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
require('dotenv').config();
const cors = require('cors')
const app = express();
const port = process.env.PORT || 7000;


app.use(express.json());
//Must remove "/" from your production URL
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "https://volunteer-auth-206ee.web.app",
      "https://volunteer-auth-206ee.firebaseapp.com",
      
    ],
    credentials: true,
  })
);


const uri = `mongodb+srv://${process.env.USER_ID}:${process.env.USER_PASS}@cluster0.q9r8zjr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    

    const volunteerNeedCollection = client.db('volunteerDB').collection('needPurpose');
    const requestedCollection = client.db('volunteerDB').collection('request');


    app.get('/volunteerneed',async(req,res)=>{
        const cursor = volunteerNeedCollection.find().sort({deadline:-1});
        const result = await cursor.toArray();
        res.send(result);
    })

    app.post('/volunteerneed', async(req, res)=>{
      const item = req.body;
      const result = await volunteerNeedCollection.insertOne(item);
      res.send(result);
    })

    app.get('/volunteerneed/:id',async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await volunteerNeedCollection.findOne(query);
      res.send(result)
    })
      app.put('/volunteerneed/:id',async(req,res)=>{
      const updateItem = req.body;
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const item = {
        $set:{
          name:updateItem.name, 
          email:updateItem.email, 
          thumbnail:updateItem.thumbnail, 
          deadline:updateItem.deadline, 
          description:updateItem.description, 
          location:updateItem.location, 
          postTitle:updateItem.postTitle, 
          numOfVolunteersNeeded:updateItem.numOfVolunteersNeeded,
          category:updateItem.category,
        }
      }
      const result = await volunteerNeedCollection.updateOne(filter,item,options);
      res.send(result);
    })

    app.post('/requestedJob', async(req, res)=>{
      const item = req.body;
      const result = await requestedCollection.insertOne(item);
      res.send(result);
    })

    app.get('/requestedJob',async(req, res)=>{
      const result = await requestedCollection.find().toArray();
      res.send(result);
    })

    app.get('/requestedJob/:id', async(req, res)=>{
      const id = req.params.id;
      const query= {_id: new ObjectId(id)};
      const result = await requestedCollection.findOne(query);
      res.send(result);
    })

    app.delete('/requestedJob/:id', async(req, res)=>{
      const id= req.params.id;
      const query= {_id: new ObjectId(id)};
      const result = await requestedCollection.deleteOne(query);
      res.send(result);
    })

    app.delete('/volunteerneed/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await volunteerNeedCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Server is running');
})

app.listen(port, ()=>{
    console.log(`server running on port : ${port} `)
})