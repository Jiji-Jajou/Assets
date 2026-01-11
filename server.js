require("dotenv").config();
const express = require("express");
const routerIndex = require('./src/routes/router');
const { connect } = require("./src/db/db");
const cors = require('cors');
const path = require('path');


connect();

const port = process.env.PORT || 4200;

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(routerIndex);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port : ${port}`);
});
