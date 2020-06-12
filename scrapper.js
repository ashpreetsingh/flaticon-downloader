let fs = require("fs");
let cheerio = require("cheerio");
// let request = require("request");
let axios = require("axios");

let clubName = process.argv[2];
let tablePageURL = 'http://premierleague.com/tables';
let squadPageURL = `https://www.premierleague.com/clubs/10/${clubName}/squad`;
let fixturesPageURL = `https://www.premierleague.com/fixtures`;
// let teamStats = {}
let final = `<html><body><h1 style="text-align:center">Your Team : ${clubName}</h1>`;
let pdf=require("html-pdf");
var options={format:'Letter'};


(async function () {
    let tablePage = await axios.get(tablePageURL);
    makeStats(tablePage.data);
    let squadsPage = await axios.get(squadPageURL);
    makeSquadPDF(squadsPage.data);
    
    
    

})();


function getFixture(data) {
    let $ = cheerio.load(data);
    final += '<ul>';
    console.log("page loaded...")
    console.log("getting fixtures");
    // console.log($(".team.js-team").text());
    let upComingFixtures = $(".overview");
    console.log(upComingFixtures.length);
    for (let i = 0; i < upComingFixtures.length; i++) {
        let fixtureData = $($($(upComingFixtures[i]).find("li.matchFixtureContainer")).attr("data-home")).text();
        console.log(fixtureData);
        final += `<li><h3>${fixtureData}</h3></li>`
    }
    final += '</ul>'
}

function makeStats(data) {
    console.log("page loaded...");
    console.log("getting table stats");
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


    // console.table(teamStats);
}




function makeSquadPDF(data) {
    console.log("squads page loaded...");
    console.log("getting squads data");
    let $ = cheerio.load(data);
    let squadArray = $(".squadListContainer.squadList.block-list-4.block-list-3-m.block-list-2-s.block-list-padding> li");
    final += '<table border="2" width="50%" style=" font-size: 1rem; margin: auto; text-align: center;"><thead><tr><th>Name</th><th>Kit Number</th><th>Position</th></tr></thead>'

    for (let i = 0; i < squadArray.length; i++) {
        let playerInfo = $(squadArray[i]).find(".playerCardInfo");
        let name = $($(playerInfo).find(".name")).text();
        let kitno = $($(playerInfo).find(".number")).text();
        let position = $($(playerInfo).find(".position")).text();
        final += `<tr><td>${name}</td>
        <td>${kitno}</td>
        <td>${position}</td></tr>`
    }
    final += '</table></body></html>'
    // console.table(playersArr)
    fs.writeFileSync("Teaminfo.html", final);
    let html=fs.readFileSync("Teaminfo.html",'utf-8');
    pdf.create(html,options).toFile('Teaminfo.pdf',function(err,resp){
        if(err){
            console.log(err);
        }
        
    })

}