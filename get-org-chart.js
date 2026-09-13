/**
 * Let's parse the raw LOFFL Org Chart email.
 * We will create an org chart JSON output.
 * The next process could join the org chart with a rankings website.
 */
const { exit } = require('process');
const ORG_DEFINITIONS = require('./org-definitions');
const Organization = require('./organization');
const Player = require('./player');

let orgs = new Map();
ORG_DEFINITIONS.ORG_NAMES.forEach(orgName => {
    orgs.set(orgName, new Organization(orgName));
});

const fs = require('fs');
const lines = fs.
    readFileSync('./data/input_org_chart.txt', 'utf8').
    replaceAll("Picks Remaining", "PicksRemaining"). // Let's simplify the multi-word property
    split(/\n+/); // Let's split by newline character

const ORG_1 = 0;
const ORG_2 = 1;
const PROP_1 = 0;
const NAME_1 = 1;
const TEAM_1 = 2;
const PROP_2 = 4;
const NAME_2 = 5;
const TEAM_2 = 6;
let orgNames = ["", ""];
let property1 = "";
let property2 = "";
let currentOrg1;
let currentOrg2;

lines.forEach(line => {
    let trimmed = line.trim();
    if (validString(trimmed)) {
        let columns = trimmed.split(/,/); // Let's split by comma

        property1 = columns[PROP_1];
        property2 = columns[PROP_2];

        if (validString(property1) && validString(property2)) {}
        else {
            property1 = columns[PROP_1+1];
            property2 = columns[PROP_2+1];
        }

        // Start by checking for Org Name Headers
        if (ORG_DEFINITIONS.ORG_NAMES.includes(property1)
        && ORG_DEFINITIONS.ORG_NAMES.includes(property1)) {
            orgNames[ORG_1] = property1;
            orgNames[ORG_2] = property2;
        }
        // Then check for the column/property names. Set the current property
        else if (ORG_DEFINITIONS.ALL_PROPERTIES.includes(property1)
        && ORG_DEFINITIONS.ALL_PROPERTIES.includes(property2)) {
            currentOrg1 = orgs.get(orgNames[ORG_1]);
            currentOrg2 = orgs.get(orgNames[ORG_2]);
        
            // We are now dealing with data versus Org names and column/property names.  
            // Handle singleton players for the last read property
            if (ORG_DEFINITIONS.SINGLE_PLAYER_PROPERTIES.includes(property1)
            && ORG_DEFINITIONS.SINGLE_PLAYER_PROPERTIES.includes(property2)) {
                if (validString(columns[NAME_1])) {
                    setPlayer(property1, currentOrg1, columns[NAME_1], columns[TEAM_1]);
                }
                if (validString(columns[NAME_2])) {
                    setPlayer(property2, currentOrg2, columns[NAME_2], columns[TEAM_2]);
                }
            }
            // Handle array of players for the last read property
            else if (ORG_DEFINITIONS.MANY_PLAYER_PROPERTIES.includes(property1)
            && ORG_DEFINITIONS.MANY_PLAYER_PROPERTIES.includes(property2)) {
                if (validString(columns[NAME_1])) {
                    setPlayers(property1, currentOrg1, columns[NAME_1], columns[TEAM_1]);
                }
                if (validString(columns[NAME_2])) {
                    setPlayers(property2, currentOrg2, columns[NAME_2], columns[TEAM_2]);
                }
            }
            // Handle teams for the last read property
            else if (ORG_DEFINITIONS.TEAM_PROPERTIES.includes(property1)
            && ORG_DEFINITIONS.TEAM_PROPERTIES.includes(property2)) {
                if (validString(columns[NAME_1])) {
                    setTeam(property1, currentOrg1, columns[NAME_1]);
                }
                if (validString(columns[NAME_2])) {
                    setTeam(property2, currentOrg2, columns[NAME_2]);
                }
            }
            // Handle numbers for the last read property
            else if (ORG_DEFINITIONS.NUMERIC_PROPERTIES.includes(property1)
            && ORG_DEFINITIONS.NUMERIC_PROPERTIES.includes(property2)) {
                setNumber(property1, currentOrg1, Number(columns[TEAM_1]));
                setNumber(property1, currentOrg2, Number(columns[TEAM_2]));
            }
        }
    }
});

const values = Array.from(orgs.values());
const output = JSON.stringify(values, null, 4)
console.log(output);
fs.writeFileSync('./data/output-org-chart.json', output);

function validString(str) {
    return (str && str.trim().length > 0)
}

function setPlayer(property, currentOrg, name, team) {
    currentOrg[property] = new Player(name.trim(), team.trim());
}

function setPlayers(property, currentOrg, name, team) {
    currentOrg[property].push(new Player(name.trim(), team.trim()));
}

function setTeam(property, currentOrg, team) {
    currentOrg[property] = team.trim();
}

function setNumber(property, currentOrg, number) {
    currentOrg[property] = number;
}