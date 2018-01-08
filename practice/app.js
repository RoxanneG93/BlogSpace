const http = require("http");
const fs = require("fs");

const express = require('express');
const app = express();

// HANDLE-BARS?
const handlebars = require("express-handlebars").create({ defaultLayout: 'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// for server
app.set("port", process.env.PORT || 3000);



// home page
app.get("/", (request, response) => {
  response.render("home");
});

app.get("/about", (request, response) => {
  response.render("about");
});


// ERROR
app.use((request, response) => {
  response.status(404);
  response.send("404");
});


// starting the server


app.listen(app.get("port"), () => {
  console.log(
    "Express started on http://localhost:" +
      app.get("port") +
      "; press Ctrl-C to terminate."
  );
});
