const express = require('express');
const fs = require('fs');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
const csv = require("csvtojson");

var app = express();

const csvFilePathHarlan = './public/images/DataLog 07172024_CascoBay_Speedy.csv';
const filePathLydia = './public/images/DataLog 07172024_CascoBay_Idontknow.TXT';
const filePathLydia2 = './public/images/Untitled.csv';

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.get("/api/getData", (req, res) => {
    csv()
        .fromFile(csvFilePathHarlan)
        .then((jsonObj)=>{
            res.send(jsonObj);
            console.log(jsonObj);
        });
});

app.get("/api/getLydiaData2", (req, res) => {
    csv().fromFile(filePathLydia2)
        .then((jsonObj) => {
            res.send(jsonObj);
            console.log(jsonObj);
        })
});

app.get("/api/getLydiaData", (req, res) => {
    let raw = fs.readFileSync(filePathLydia);
    let str = raw.toString();
    res.send(toJSON(str));
});

function toJSON(input) {
    let output = [];
    let lines = input.split("\r\n");
    let headers = lines[0].split("\t");
    headers.splice(1,1);
    for (let line of lines.slice(2)) {
        if (line === "") continue;
        let tmp = {};
        let fields = line.split('\t');
        for (let i in fields) {
            tmp[headers[i]] = fields[i];
        }
        console.log(line);
        console.log(tmp);
        output.push(tmp);
    }
    return output;
}

module.exports = app;


