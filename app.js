require('dotenv').config();

const { response } = require('express');
const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

async function displayArtistAlbums(request, response, next) {
    
  let id = request.params.artistId
  console.log(id)

  try {
      data = await spotifyApi.getArtistAlbums(id)
      console.log('Album information', data.body.items)
      albums = data.body.items
      response.render('albums.hbs', {albums})
  }
  catch (error){
      console.log('The error while searching artists occurred: ', error)
  }
}

app.get('/albums/:artistId', displayArtistAlbums);

async function searchArtists(request, response, next) {
    
  let { q } = request.query

  try {
      data = await spotifyApi.searchArtists(q)
      console.log('Received data from the API: ', data.body.artists.items[0].images[0]);
      let artists = data.body.artists.items

      response.render('artist-search-results.hbs', {artists})
  }
  catch (error){
      console.log('Error while searching artists occurred: ', error)
  }
}

app.get('/artist-search', searchArtists )

async function getArtistAlbums(request, response, next) {
    
  let id = request.params.artistId
  console.log(id)

  try {
      data = await spotifyApi.getArtistAlbums(id)
      console.log('Album infor', data.body.items)
      let albums = data.body.items
      response.render('albums.hbs', {albums})
  }
  catch (error){
      console.log('An error occurred displaying albums: ', error)
  }
}

app.get('/albums/:artistId', getArtistAlbums)

async function getAlbumsTracks(request, response, next) {
    
  let id = request.params.albumId
  console.log(id)

  try {
      data = await spotifyApi.getAlbumTracks(id)
      console.log('Tracks info', data.body.items)
      let tracks = data.body.items
      response.render('tracks.hbs', {tracks})
  }
  catch (error){
      console.log('The error while searching artists occurred: ', error)
  }
}


app.get('/tracks/:albumId', getAlbumsTracks)
  
function renderHomePage(request, response, next) {
    response.render('home')
}

app.get('/', renderHomePage)

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
