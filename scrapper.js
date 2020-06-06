let fs = require("fs");
let cheerio = require("cheerio");
let request = require("request");
let clubName = process.argv[2];
let tablePageURL = 'http://premierleague.com/tables';
let squadPageURL = `https://www.premierleague.com/clubs/10/${clubName}/squad`
let teamStats = {}
let final = `<html><body><h1 style="text-align:center">Your Team : ${clubName}</h1>`

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
        if ($(teamRow[2]).text().includes(clubName)) {
            let points = $(teamRow[10]).text();
            let matches = $(teamRow[3]).text();
            let position = $($(teamRow[1]).find(".value")).text();
            let wins = $(teamRow[4]).text();
            let goals = $(teamRow[10]).text();
            final += `<div style="text-align:center"><h2>Position : ${position} </h2> <h2>Points : ${points} </h2> <h2>Matches Played : ${matches}</h2><h2>Wins : ${wins}</h2><h2>Goals Scored : ${goals}</h2><div>`
            console.log("table stats written");
        }
    }
    final += '</table></body></html>'
    // console.table(playersArr)
    fs.writeFileSync("players.html", final);

    // console.table(teamStats);
}
final += '<table border="2" width="50%" style=" font-size: 2rem; margin: auto; text-align: center;"><thead><tr><th>Name</th><th>Kit Number</th><th>Position</th></tr></thead>'




function makeSquadPDF(data) {
    let $ = cheerio.load(data);
    let squadArray = $(".squadListContainer.squadList.block-list-4.block-list-3-m.block-list-2-s.block-list-padding> li");
    for (let i = 0; i < squadArray.length; i++) {
        let playerInfo = $(squadArray[i]).find(".playerCardInfo");
        let name = $($(playerInfo).find(".name")).text();
        let kitno = $($(playerInfo).find(".number")).text();
        let position = $($(playerInfo).find(".position")).text();
        final += `<tr><td>${name}</td>
        <td>${kitno}</td>
        <td>${position}</td></tr>`
    }

}