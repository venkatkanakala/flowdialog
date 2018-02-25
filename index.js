/**
 * Created by RaoKanakala on 2/22/18.
 */
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const https = require("https");
const server = express();
const apiKey = "5674944c3315b2c4424e484b95704aed";
//https://api.themoviedb.org/3/movie/550?api_key=5674944c3315b2c4424e484b95704aed
//https://api.themoviedb.org/3/authentication/token/new?api_key=5674944c3315b2c4424e484b95704aed

//ironman, aqua, power, harry porter,hitler

server.use(bodyParser.urlencoded({
    extended: true
}));

server.use(bodyParser.json());

server.get('/', function (req, res) {
    res.send('hello world')
});
server.get('/getMovieDB', function (req, res) {
    var options = {
        "method": "GET",
        "hostname": "api.themoviedb.org",
        "port": null,
        "path": "/3/authentication/token/new?api_key=5674944c3315b2c4424e484b95704aed",
        "headers": {}
    };


    var req = https.request(options, function (res) {
        var chunks = [];
        var response;

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            var body = Buffer.concat(chunks);

            var options = {
                "method": "GET",
                "hostname": "api.themoviedb.org",
                "port": null,
                "path": "/3/authentication/session/new?request_token=29f898660458af2c98b712bb9362e791678b2762&api_key=5674944c3315b2c4424e484b95704aed",
                "headers": {}
            };


            console.log(body.toString());
        });
    });

    req.write("{}");
    req.end();
    res.send("about")
});

//http://localhost:8000/users/raokanakala/books/122323fed3e
server.get('/users/:userId/books/:bookId', function (req, res) {
    res.send(req.params)
});
server.post('/get-movie-details_1', function (req, res) {
    let reqUrl = encodeURI('https://reqres.in/api/user');
    https.get(reqUrl, (responseFromAPI) => {

        responseFromAPI.on('data', function (chunk) {
        let userData = JSON.parse(chunk)['data'];

        // for(var userDataKey in userData)
        // {
        //     console.log(userData[userDataKey].name);
        // }

        let dataToSend = userData;

        return res.json({
            speech: dataToSend,
            displayText: dataToSend,
            source: 'get-movie-details'
        });

    });
},
    (error) => {
        return res.json({
            speech: 'Something went wrong!',
            displayText: 'Something went wrong!',
            source: 'get-movie-details'
        });
    }
    )
});;;;;
//http://www.omdbapi.com/?i=tt3896198&apikey=375198c0&t=%22rambo%22
server.post('/get-movie-details', (request, response) => {
    let movieToSearch = request.body.result && request.body.result.parameters && request.body.result.parameters.movie ? request.body.result.parameters.movie : 'IronMan';
    let request_Url = encodeURI('http://www.omdbapi.com/?i=tt3896198&apikey=375198c0&t=' + movieToSearch);

    //Make Service Call
    http.get(request_Url, (responseFromAPI) => {

        responseFromAPI.on("data", responeData => {

            let body = JSON.parse(responeData);

            //Send Respond back to service
            return response.json({
                speech: body,
                displayText: body,
                source: 'get-movie-details'
            });

})
responseFromAPI.on("end", () => {

            console.log("End Response");
})

}, (error) => {
        console.log(error);
        return response.json({
            speech: 'Something went wrong!',
            displayText: 'Something went wrong!',
            source: 'get-movie-details'
        });
}
)
})
server.listen((process.env.PORT || 8000), function () {
    console.log("Server is up and running...");
});

