require('dotenv').config(); // hey express app! i wanna make sure i have access to these variables throughout my code
const express = require('express');
const app = express();
const axios = require('axios');
const ejsLayouts = require('express-ejs-layouts')

const PORT = 3001
const omdbApiKey = process.env.OMDB_API_KEY 
app.set('view engine', 'ejs')
app.use(express.static('static'))
app.use(express.urlencoded({ extended: false }))
app.use(ejsLayouts)
// Adds some logging to each request
app.use(require('morgan')('dev')); //THIS IS WHAT creates the response in terminal with GET /

//<<--STATIC FILES just means that this info isnt going to change

//create a home route
app.get('/', (req, res) => {
  res.render('index')
})
// GET (read) movie results from input form
app.get('/results', (req, res) => { 
  let newObject = { // stores the value of the param string from req.query
    params: {
      s: req.query.search,
      apikey: omdbApiKey
    }
  }
  axios.get('http://www.omdbapi.com/', newObject)//<<specifically something you can do in AXIOS, usually done with `http://www.omdbapi.com/?t=${movieTitle}&apiKey=${process.env.OMDB_API_KEY}`
  .then(resFromApi => {
    let results = resFromApi.data.Search
    res.render('results', { results: results })
    let imdbRes = resFromApi.data.imdbID
    res.render('results', { movies: imdbID})
    })
  .catch(err => {console.log(err)})
  })

//details
app.get('/detail/:imdbID', (req, res) => {
  let qs = {
    params: {
      i:req.params.imdbID,
      apikey: omdbApiKey,
    },
  }
  axios.get('http://www.omdbapi.com', qs)
    .then((resFromApi) => {
      let movieData = resFromApi.data
      console.log(movieData)
      res.render('detail', { q: movieData })
    })
    .catch((err) => {
      console.log(err)
    })
})


//open up a port for the app to listen on + define port
app.listen(PORT, () => {
  console.log("youre listening to the smooth sounds of a movie app🎞")
})

// The app.listen function returns a server handle //allows export of this server to another server, not just local use only accessable from your computer 
var server = app.listen(process.env.PORT || 3000);  //says to look for PORT number in the env file OR  just default to 3000 

// We can export this server to other servers like this
module.exports = server; //
