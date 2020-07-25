const express = require('express');
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
const Joi = require('joi');
const app  = express();

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))

const connectionString = `mongodb+srv://student:1234@cluster0.lralg.mongodb.net/StudentDb?retryWrites=true&w=majority`
MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('TestDb')
    const studentsCollection = db.collection('test_collection')

    app.set('view engine', 'ejs')
    app.get('/', (req, res) => {
        res.sendFile(__dirname + './views/index.ejs')
    })

  
  app.set('view engine', 'ejs')
  app.post('/students', (req, res) => {
    studentsCollection.insertOne(req.body)
      .then(result => {
        console.log(result)
      })
      .catch(error => console.error(error))
      res.send(req.body)
  })

  app.set('view engine', 'ejs')
  app.get('/students', (req, res) => {
      db.collection('test_collection').find().toArray()
        .then(results => {
          res.render('index.ejs', { quotes: results })
        })
        .catch(error => console.error(error))
        
    })

    // app.put('/students/id', (req, res) => {
    //   if (!req.id) {
    //     return res.status(400).send('Missing parameter id')
    //   }

    //   db.collection('test_collection').findOneAndUpdate({id: req.id}, req.body, {new: true})
    //   .then(doc => {
    //     res.json(doc)
    //   })
    //   .catch(err => {
    //     res.status(500).json(err)
    //   })
    // })


  })
  .catch(console.error)

function validateStudent(student)
{
      const schema = Joi.object({ name: Joi.string() .required() });
      return schema.validate(student);      
}
  

app.listen(3000, function() {
    console.log('listening on 3000')
})
