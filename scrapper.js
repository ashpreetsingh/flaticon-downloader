require("chromedriver")
let wDriver = require("selenium-webdriver");
let fs = require("fs");
let cheerio = require("cheerio");
let request = require("request");
let bldr = new wDriver.Builder();
// let driver=bldr.forBrowser("chrome").build();
let searchArray = process.argv.slice(2);
let pageURL = 'http://premierleague.com/tables';
let teamStats = {}


request(pageURL, function (err, response, data) {
    if (err == null && response.statusCode == 200) {
        console.log("page loaded");
        console.log("loading tables..")
        makeStats(data);
    }
    else if (response.statusCode == 404) {
        console.log("page not found");
    }
    else {
        console.log(err.message);
    }



})


function makeStats(data) {
    let $ = cheerio.load(data);
    let arrOfTeams = $("tr[data-compseason='274']");
    for (let i = 0; i < 20; i++) {
        let teamRow = $(arrOfTeams[i]).find("td");
        if ($(teamRow[2]).text().includes("Liverpool")) {
            teamStats["Points"] = $(teamRow[10]).text();
            teamStats["Matches Played"] = $(teamRow[3]).text();
            teamStats["Position"] = $($(teamRow[1]).find(".value")).text();
            teamStats["Wins"] = $(teamRow[4]).text();
            teamStats["Goals Scored"] = $(teamRow[10]).text();


        }
    }
    console.table(teamStats);
}