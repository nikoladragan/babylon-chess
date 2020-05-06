const fs = require("fs");
const http = require("http");
const path = require("path");

// app.js
const express = require("express");

// Create Express app
const app = express();

app.use(express.static("dist"));

// A sample route
app.get("/", express.static(path.join(__dirname, "/index.html")));

// Start the Express server
app.listen(process.env.PORT || 3000, () => console.log("Server running on port 3000!"));
