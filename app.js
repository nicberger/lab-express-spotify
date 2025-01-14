require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
    .catch((error) =>
        console.log(
            "Something went wrong when retrieving an access token",
            error
        )
    );

// Our routes go here:
app.get("/", (req, res) => {
    console.log("index");
    res.render("home");
});

app.get("/artist-search", (req, res, next) => {
    const { name } = req.query;
    spotifyApi
        .searchArtists(name)
        .then((data) => {
            const artists = data.body.artists.items;
            console.log(artists[5].images);
            res.render("artist-search-results", { artists });
        })
        .catch((err) =>
            console.log("The error while searching artists occurred: ", err)
        );
    console.log("artist-search");
});

app.get('/albums/:artistId', (req, res, next) => {

    const { artistId } = req.params;
    spotifyApi
        .getArtistAlbums(artistId)
        .then (data => {
            const altitle = req.query.title;
            const albums = data.body.items;
            console.log(albums)
            res.render("albums",{albums,altitle});
        })
        .catch((err) =>
            console.log("The error while searching artists occurred: ", err)
        );
});


app.get("/tracks/:albumId", (req, res) => {
    spotifyApi.getAlbumTracks(req.params.albumId).then((data) => {
      console.log("data:", data.body.items);
      const artistName = data.body.items[0].artists[0].name;
  
      res.render("tracks", { tracks: data.body.items, artistName });
    });
  });

// Port
app.listen(3000, () =>
    console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
