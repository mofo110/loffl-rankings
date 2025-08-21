/**
 * Let's parse the raw LOFFL Org Chart email.
 * We will create an org chart JSON output.
 * The next process could join the org chart with a rankings website.
 */
const ORG_DEFINITIONS = require('./org-definitions');
const Organization = require('./organization');
const Player = require('./player');
const PropertyCounts = require('./property-counts');

let orgs = new Map();
ORG_DEFINITIONS.ORG_NAMES.forEach(orgName => {
    orgs.set(orgName, new Organization(orgName));
});

const fs = require('fs');
const lines = fs.
    readFileSync('./data/input_org_chart.txt', 'utf8').
    replaceAll("Picks Remaining", "PicksRemaining"). // Let's simplify the multi-word property
    split(/\n+/); // Let's split by newline character

const ODD = 1;
const EVEN = 0;
let orgNames = ["", ""];
let propertyCounts = new PropertyCounts();
let property = "";
let currentOrg;

lines.forEach(line => {
    let trimmed = line.trim();
    if (trimmed.length > 0) {
        // Start by checking for Org Name Headers
        if (ORG_DEFINITIONS.ORG_NAMES.includes(trimmed)) {
            // Start with NO ODD org being set
            if (orgNames[ODD].length === 0) {
                orgNames[ODD] = trimmed;
            }
            // Then check if any EVEN org is set            
            else if (orgNames[EVEN].length === 0) {
                orgNames[EVEN] = trimmed;
            }
            // If both ODD and EVEN org are previously set, we must restart with a new pair of orgs
            else if (orgNames[ODD].length > 0 && orgNames[EVEN].length > 0) {
                orgNames[ODD] = trimmed;
                orgNames[EVEN] = "";
            }
        }
        // Then check for the column/property names. Set the current property and increment its counter
        else if (ORG_DEFINITIONS.ALL_PROPERTIES.includes(trimmed)) {
            property = trimmed;
            propertyCounts[property]++;
            currentOrg = orgs.get(orgNames[propertyCounts[property] % 2]);
        }
        // We are now dealing with data versus Org names and column/property names.  
        // Handle singleton players for the last read property
        else if (ORG_DEFINITIONS.SINGLE_PLAYER_PROPERTIES.includes(property)) {
            setPlayer(property, currentOrg, trimmed);
        }
        // Handle array of players for the last read property
        else if (ORG_DEFINITIONS.MANY_PLAYER_PROPERTIES.includes(property)) {
            setPlayers(property, currentOrg, trimmed);
        }
        // Handle teams for the last read property
        else if (ORG_DEFINITIONS.TEAM_PROPERTIES.includes(property)) {
            setTeam(property, currentOrg, trimmed);
        }
        // Handle numbers for the last read property
        else if (ORG_DEFINITIONS.NUMERIC_PROPERTIES.includes(property)) {
            setNumber(property, currentOrg, Number(trimmed));
        }
    }
});

const values = Array.from(orgs.values());
const output = JSON.stringify(values, null, 4)
console.log(output);
fs.writeFileSync('./data/output-org-chart.json', output);

function setPlayer(property, currentOrg, trimmed) {
    // If the player already exists, set the team
    if (currentOrg[property]) {
        currentOrg[property].team = trimmed;
    }
    // Otherwise, create a new player
    else {
        currentOrg[property] = new Player(trimmed);
    }
}

function setPlayers(property, currentOrg, trimmed) {
    // If the array is empty, push the first new player into the array
    if (currentOrg[property].length === 0) {
        currentOrg[property].push(new Player(trimmed));
    }
    else {
        // Get the current player in the array (ie. index length -1)
        let currentPlayer = currentOrg[property][currentOrg[property].length - 1];

        // If the player's team is empty, set it
        if (currentPlayer.team.length === 0) {
            currentPlayer.team = trimmed;
        }
        // Otherwise, push a new player into the array
        else {
            currentOrg[property].push(new Player(trimmed));
        }
    }
}

function setTeam(property, currentOrg, trimmed) {
    currentOrg[property] = trimmed;
}

function setNumber(property, currentOrgt, trimmed) {
    currentOrg[property] = trimmed;
}