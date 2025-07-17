/* Remember to run 'docker build . -t nodeapp', every time you make changes to this app.js file.
ps. Dockerfile defines the instructions Docker uses to build the image.

This Express (Node) file expresses/ defines endpoints to; fetch all reviews (fetchReviews), 
fetch reviews of a particular dealer (fetchReviews/dealer/:id), 
fetch all dealerships (fetchDealers), fetch all dealerships in a particular state (fetchDealers/:state),
fetch dealer by id (fetchDealers/:id) and to insert reviws (insert_review).

*/

const express = require('express');
const mongoose = require('mongoose'); // As this JS app will use mongoose to talk to MngoDB where data is stored and will be retieved from.
const fs = require('fs'); // What's fs?
const  cors = require('cors') // What's happening here
const app = express()
const port = 3030;

app.use(cors())
app.use(require('body-parser').urlencoded({ extended: false })); // To help us read the json data files below

const reviews_data = JSON.parse(fs.readFileSync("reviews.json", 'utf8')); // Defining var name for reviews data
const dealerships_data = JSON.parse(fs.readFileSync("dealerships.json", 'utf8')); // Defining var name for dealerships data

mongoose.connect("mongodb://mongo_db:27017/",{'dbName':'dealershipsDB'});


const Reviews = require('./review'); // variable for our reviews schema (structure)

const Dealerships = require('./dealership'); // variable for our dealership schema (structure)

/* What's going on here below? The try-catch statement in JS is used for error handling. 
      Allows to execute code that might throw an error (try block) and then handle any errors that occur (error block), 
      without stopping the program. */
try { // below is the code that might cause an error.
  Reviews.deleteMany({}).then(()=>{
    Reviews.insertMany(reviews_data['reviews']);
  });
  Dealerships.deleteMany({}).then(()=>{
    Dealerships.insertMany(dealerships_data['dealerships']);
  });
  
} catch (error) { // Code to handle the error.
  res.status(500).json({ error: 'Error fetching documents' });
}


// Express route to HOME
app.get('/', async (req, res) => {
    res.send("Welcome to the Mongoose API")
});

// Express route to fetch ALL REVIEWS
app.get('/fetchReviews', async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch REVIEWS by a particular dealer
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const documents = await Reviews.find({dealership: req.params.id});
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch ALL DEALERSHIPS: (I just copied block that fetches ALL REVIEWS and edited to fetch dealerships)
app.get('/fetchDealers', async (req, res) => {
  // My written code here
  try{
    const documents = await Dealerships.find();
    res.json(documents);
  }catch (error) {
    res.status(500).json({ error: 'Error fetching documents'});
  }
});

// Express route to fetch DEALERS by a particular state: (I just copied block that fetches REVIEWS BY DEALER and edited the 'await' part and wrote to find by state)
app.get('/fetchDealers/:state', async (req, res) => {
  // My written code here
  try {
    const documents = await Dealerships.find({state: req.params.state});
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch DEALER by a particular ID: (I just copied block that fetches REVIEWS BY DEALER and edited the 'await' part and wrote to find by id)
app.get('/fetchDealer/:id', async (req, res) => {
  // My written code here
  try {
    const documents = await Dealerships.find({id: parseInt(req.params.id)}); // parseInt() converts the URL parameter (string) to a number to match the schema
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

//Express route to INSERT REVIEW
app.post('/insert_review', express.raw({ type: '*/*' }), async (req, res) => {
  data = JSON.parse(req.body);
  const documents = await Reviews.find().sort( { id: -1 } )
  let new_id = documents[0]['id']+1

  const review = new Reviews({
		"id": new_id,
		"name": data['name'],
		"dealership": data['dealership'],
		"review": data['review'],
		"purchase": data['purchase'],
		"purchase_date": data['purchase_date'],
		"car_make": data['car_make'],
		"car_model": data['car_model'],
		"car_year": data['car_year'],
	});

  try {
    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
		console.log(error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
