require("dotenv").config();

var fs = require('fs');
var keys = require("./keys");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require("request");
 
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];
var searchedItem = process.argv[3];


function tweety() {

	var params = {screen_name: ''};

	client.get('statuses/user_timeline', params, function(error, tweets, response) {
 		 
 		if (!error) {

 			console.log("__________________________Twitter tweets :) ______________________");
 			console.log(" ");
  		  
 			tweets.forEach(function(element, index) {

 			 
 			  console.log(" ");
          	  console.log("\nTweet no." + index + " : " + element.text);
          	  console.log(" ");
          	// });

		        fs.appendFile('log.txt', "\nTweet no." + index + " : " + element.text, function(error){
		        	if (error) {
		        		console.log(" Oups, error in appending text from Twitter: " + error);
		        	}
		        });
       		 });  	

 		};

	});

}


function omdb() {

	var movieName = "";
	var nodeArgs = process.argv;

	if (nodeArgs.length < 3) {
		movieName = "Mr. Nobody";
	}

	else {
		for (var i = 3; i < nodeArgs.length; i++) {
			if (i > 3 && i < nodeArgs.length) {
			movieName += "+" + nodeArgs[i];
			}
			else {
			movieName = nodeArgs[i];	
			}
		}
	}	

	console.log("query movie name: " + movieName);

	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

	request(queryUrl, function(error, response, body) {
  
		if (!error && response.statusCode === 200) {

			console.log(JSON.parse(body));

		    var movieInfo = "\n" + "\nMovie Details" + "\n " + "\n " + "\nTitle of the movie: " + JSON.parse(body).Title + " \nYear the movie came out: " + JSON.parse(body).Released + 
            " \nIMDB Rating of the movie: " + JSON.parse(body).imdbRating + " \nRotten Tomatoes Rating of the movie: " + JSON.parse(body).Ratings[1].Value +
            " \nCountry where the movie was produced: " + JSON.parse(body).Country + " \nLanguage of the movie: " + JSON.parse(body).Language +
            " \nPlot of the movie: " + JSON.parse(body).Plot + " \nActors in the movie: " + JSON.parse(body).Actors;
            console.log(movieInfo);

            fs.appendFile('log.txt', movieInfo, function (error) {
            	if (error) {
		        		console.log(" Oups, error in appending text from OMDB: " + error);
		        	}
            });
  		}
  		else {
  			console.log("Oups, OMDB error: " + error);
  		}
	});
}



function spotThis (searchedItem) {

	var songName = searchedItem || "The sign";

	spotify.search({ type: 'track', query: songName }, function(err, data) {
		  if (err) {
		    return console.log('Error occurred: ' + err);
		  }
 
		    var infoSong = "\n" + "\nSong Details" + "\n " + '\nArtist: ' + data.tracks.items[0].artists[0].name + '\nSong: ' + data.tracks.items[0].name +
            '\nPreview Link: ' + data.tracks.items[0].preview_url + '\nAlbum: ' + data.tracks.items[0].album.name;
            console.log(infoSong);

    		fs.appendFile('log.txt', infoSong, function (error) {
            	if (error) {
		        		console.log(" Oups, error in appending text from Spotify: " + error);
		        	}
            });


	});
}



function doWhat() { //not finished

	fs.readFile ('random.txt', "utf8", function (error, data) {
		if (error) {
			console.log("doWhat error: " + error);
		}

		console.log(data);
		var dataArr = data.split(",");
		console.log(dataArr);

		switch(dataArr[0]) {
			case 'spotify-this-song':
			spotThis(dataArr[1]);
			break;

			case 'my-tweets':
			tweety();
			break;

			case 'movie-this':
			omdb();
			break;

			default:
			console.log("Data in the file is in the wrong format; please review and try again!");
			break;
		}
	});

}


switch (command) {

    case 'spotify-this-song':
        spotThis(searchedItem);
        break;

    case 'my-tweets':
        tweety();
        break;

    case 'movie-this':
        omdb();
        break;

    case 'do-what-it-says':
        doWhat();
        break;

    default:
        console.log("Wrong command, please try again!");
        break;
}

