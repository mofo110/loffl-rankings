/**
 * Fantasy Pros' page has some JSON rankings under the var ecrData
 *     Quarter Backs  - https://www.fantasypros.com/nfl/rankings/qb.php
 *     Running Backs  - https://www.fantasypros.com/nfl/rankings/rb.php
 *     Wide Receivers - https://www.fantasypros.com/nfl/rankings/wr.php
 *     Tight Ends     - https://www.fantasypros.com/nfl/rankings/te.php
 *     Kickers        - https://www.fantasypros.com/nfl/rankings/k.php
 *     Defense & SPT  - https://www.fantasypros.com/nfl/rankings/dst.php
 */
const RANKING_DEFINITIONS = require('./ranking-definitions');

RANKING_DEFINITIONS.ALL_POSITIONS.forEach(position => {
    getRankings(position);
});

function getRankings(position) {
    const https = require('https');
    const fs = require('fs');

    const options = {
        hostname: 'www.fantasypros.com',
        port: 443,
        path: `/nfl/rankings/${position}.php`,
        method: 'GET'
    };

    const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            matchData(data, position);
        });
    });

    req.on('error', (error) => {
        console.error(error);
    });

    req.end();
}

function matchData(data, position) {
    const regex = new RegExp(/var ecrData =(.*?);s\s+var sosData =/);
    const match = regex.exec(data.replaceAll('\n', '\s'));

    if (match) {
        const firstWord = match[1].trim();
        const inputRanking = JSON.parse(firstWord);
        matchRanking(inputRanking, position);
    } else {
        console.log("No match found.");
    }
}

function matchRanking(inputRanking, position) {
    const fs = require('fs');
    const orgs = JSON.parse(fs.readFileSync('./data/output-org-chart.json', 'utf8'));
    const rankings = [];

    const Ranking = require('./ranking');
    inputRanking.players.forEach(player => {
        let ranking = new Ranking();
        ranking.week = Number(inputRanking.week);
        ranking.position = player.player_positions;
        ranking.rank = Number(player.rank_ecr);
        ranking.shortName = player.player_short_name;
        ranking.name = player.player_name;
        ranking.team = player.player_team_id;
        ranking.byeWeek = Number(player.player_bye_week);
        ranking.opponent = player.player_opponent;
        ranking.grade = player.start_sit_grade;
        ranking.orgName = getOrgName(orgs, ranking);
        rankings.push(ranking);
    });

    const output = JSON.stringify(rankings, null, 4);
    console.log(output);
    fs.writeFileSync(`./data/rankings-${position}.json`, output);
}

function getOrgName(orgs, ranking) {
    // Use for of instead of forEach to support return values.
    for (let org of orgs) {
        // Handle singleton players
        if (RANKING_DEFINITIONS.SINGLE_PLAYER_POSITIONS.includes(ranking.position)) {
            let player = org[ranking.position];
            if (playerMatch(ranking, player)) {
                return org.name;
            }
        }
        // Handle array of players
        else if (RANKING_DEFINITIONS.MANY_PLAYER_POSITIONS.includes(ranking.position)) {
            let players = org[ranking.position];
            // Use for of instead of forEach to support return values.
            for (let player of players) {
                if (playerMatch(ranking, player)) {
                    return org.name;
                }
            }
        }
        // Handle teams
        else if (RANKING_DEFINITIONS.TEAM_POSITIONS.includes(ranking.position)) {
            let team = org["Def"].replaceAll('*', '');
            if (RANKING_DEFINITIONS.TEAM_MAP[ranking.team].includes(team)) {
                return org.name;
            }
        }

        // If you get to this branch, then the ranking record is NOT an assigned starting position.
        // Let's check if it is a taxi player.
        let taxiOrgName = getTaxiOrgName(org, ranking);
        if (taxiOrgName.length > 0) {
            return taxiOrgName;
        }
    }

    return "";
}

function getTaxiOrgName(org, ranking) {
    // Use for of instead of forEach to support return values.
    for (let taxiPosition of RANKING_DEFINITIONS.TAXI_POSITIONS) {
        let taxiPlayer = org[taxiPosition];
        if (taxiPlayer) {
            // Remove the asterisk from recent updates
            let playerName = taxiPlayer.name.replaceAll('*', '');
            // Handle Defense & Special Teams as Taxi
            if (ranking.position === "DST" && playerName.endsWith(" Def")) {
                let team = playerName.replaceAll(/\s+Def$/g, '');
                if (RANKING_DEFINITIONS.TEAM_MAP[ranking.team].includes(team)) {
                    return org.name;
                }
            }
            else {
                // Check trailing position marker for match
                let splits = taxiPlayer.name.split(/\s+/);
                let position = splits[splits.length - 1];
                if (position === ranking.position) {
                    if (playerMatch(ranking, taxiPlayer)) {
                        return org.name;
                    }
                }
            }
        }
    }

    return "";
}

function playerMatch(ranking, player) {
    if (player) {
        // Remove the asterisk from recent updates
        let orgLastName = player.name.replaceAll('*', '').toLowerCase();
        // Remove trailing position marker for TAXI players
        let regex = new RegExp(/^(.*?)\s+(qb|rb|wr|te|k|def|spt)$/);
        let match = regex.exec(orgLastName);
        if (match) {
            orgLastName = match[1].trim();
        }

        // Find first word before first space to extract first and last name
        regex = new RegExp(/^(.*?)\s+(.*?)$/);
        match = regex.exec(ranking.shortName.toLowerCase());

        if (match) {
            // match[1] will be all characters BEFORE the first space | a. st. brown -> a.        | a.j. brown -> a.j.
            // match[2] will be all characters AFTER  the first space | a. st. brown -> st. brown | a.j. brown -> brown
            const rankingLastName = match[2].trim();
            if (rankingLastName.includes(orgLastName)) {
                // Next check if the teams match.
                // NOTE: This logic would fail if you had the same last name
                // playing the same position on the same team
                if (RANKING_DEFINITIONS.TEAM_MAP[ranking.team].includes(player.team)) {
                    return true;
                }
            }
        }
    }

    return false;
}