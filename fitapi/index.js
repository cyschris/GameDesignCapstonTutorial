
const express = require("express");
const app = express();
const port = 8080;
const { google } = require("googleapis");
const request = require("request");
const cors = require("cors");
const urlParse = require("url-parse");
const { URLSearchParams } = require('url')
const bodyParser = require("body-parser");
const axios = require("axios");
const { initializeApp } = require('firebase/app');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/knockknock", (req, res) => res.send("Who is there"));

app.get("/getURL", (req, res) => {
    const oauth2Client = new google.auth.OAuth2(
        //clientID
       "",
        //client secret
        "",
        //redirect url
        "http://localhost:8080/steps"
    )

    const scopes = ["https://www.googleapis.com/auth/fitness.activity.read profile email openid"]

    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
        state: JSON.stringify({
            callbackUrl: req.body.callbackUrl,
            userID: req.body.userID
        })
    })

    request(url, (err, response, body) => {
        console.log("error: " + err);
        console.log("statusCode: ", response && response.statusCode);
        res.send({ url });
    })


});

app.get("/steps", async (req, res) => {
    const queryURL = new urlParse(req.url);
    const code = new URLSearchParams(queryURL.query).get("code");
    const oauth2Client = new google.auth.OAuth2(
        //clientID
       "",
        //client secret
        "",
        //redirect url
        "http://localhost:8080/steps"
    )

    const tokens = await oauth2Client.getToken(code);
    console.log(tokens.tokens.access_token);
    res.send("HELLO");
    let stepArray = [];

    var data = '{\r\n                "aggregateBy": [{\r\n                    "dataSourceId":\r\n                      "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"\r\n                  }],\r\n                  "bucketByTime": { "durationMillis": 86400000 }, \r\n                  "startTimeMillis": 1677729600000, \r\n                  "endTimeMillis": 1678459248329\r\n            }';

    var config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
        headers: {
            'Authorization': 'Bearer '+tokens.tokens.access_token,
            'Content-Type': 'text/plain'
        },
        data: data
    };

    axios(config)
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
  
})

app.listen(port, () => console.log("this small api is working on port " + port));

