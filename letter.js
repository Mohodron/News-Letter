const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
})

app.post("/", function (req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    console.log(firstName, lastName, email);
    console.log("post reqest is working");

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data);
    const url = "https://us11.api.mailchimp.com/3.0/lists/314df65bb4"
    const option = {
        method: "POST",
        auth: "mohodron:e70f248a448b118593da74bddf66e470-us11"
    }
    const request = https.request(url, option, function (response) {
        let code = response.statusCode
        if (code===200){
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }

            response.on("data", function (data) {
                console.log(JSON.parse(data));
            })
    })
    request.write(jsonData);
    request.end();
})
app.post("/failure",function(req,res){
    res.redirect("/");
})




app.listen( process.env.PORT || 3000, function () {
    console.log("server is running at port 3000");
})
// mailchimp key
// e70f248a448b118593da74bddf66e470-us11

// mailchip list key
// 314df65bb4