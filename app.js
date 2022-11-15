//const https = require("https");
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const client = require("@mailchimp/mailchimp_marketing");
const app = express();
const async = require("async");
client.setConfig({
  apiKey: "fe13b715af3f71ca5cb32904889bb063",
  server: "us13",
});
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email
  };
  async function run() {
  try {
    const response = await client.lists.addListMember("c7aed7d111", {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName
      }
    });
    res.sendFile(__dirname + "/success.html");
  } catch (error) {
    console.log(error);
    res.sendFile(__dirname + "/failure.html");
  }

    // console.log(response);

};
  run();
});
app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.")

});

