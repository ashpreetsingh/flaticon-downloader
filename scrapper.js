require("chromedriver")
let wDriver = require("selenium-webdriver");
let fs = require("fs");
let cheerio = require("cheerio");
let request = require("request");
let bldr = new wDriver.Builder();
let clubName=process.argv[2];
// let driver=bldr.forBrowser("chrome").build();
let searchArray = process.argv.slice(2);
let tablePageURL = 'http://premierleague.com/tables';
let squadPageURL= `https://www.premierleague.com/clubs/10/${clubName}/squad`
let teamStats = {}


request(tablePageURL, function (err, response, data) {
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
request(squadPageURL, function (err, response, data) {
    if (err == null && response.statusCode == 200) {
        console.log("page loaded");
        console.log("loading squads..")
        makeSquadPDF(data);
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

let playersArr=[];


function makeSquadPDF(data){
    let $=cheerio.load(data);
    let squadArray=$(".squadListContainer.squadList.block-list-4.block-list-3-m.block-list-2-s.block-list-padding> li");
    for(let i=0;i<squadArray.length;i++){
        let playerInfo=$(squadArray[i]).find(".playerCardInfo");
        let name = $($(playerInfo).find(".name")).text();
        let kitno = $($(playerInfo).find(".number")).text();
        let position = $($(playerInfo).find(".position")).text();

        let playerObj={
            'Name' : name,
            'Kit Number':kitno,
            'Position' : position

        }

        playersArr.push(playerObj);


    }
    console.table(playersArr)
}