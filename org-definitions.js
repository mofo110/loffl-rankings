const ORG_NAMES = [
    "End Zone",
    "Hot Shots",
    "Hawk Tuah",
    "Capsters",
    "Vision",
    "Grumpy Grandpas",
    "Gogaropolos",
    "Manly Men",
    "Go-Go's",
    "WFT"
];

const SINGLE_PLAYER_PROPERTIES = [
    "QB",
    "TE",
    "K",
    "T1",
    "T2",
    "T3"
];

const MANY_PLAYER_PROPERTIES = [
    "RB",
    "WR"
];

const TEAM_PROPERTIES = [
    "Def",
    "SpT"
];

const NUMERIC_PROPERTIES = [
    "PicksRemaining"
];

const ALL_PROPERTIES =
    SINGLE_PLAYER_PROPERTIES.concat(
        MANY_PLAYER_PROPERTIES).concat(
            TEAM_PROPERTIES).concat(
                NUMERIC_PROPERTIES);

module.exports = { ORG_NAMES, SINGLE_PLAYER_PROPERTIES, MANY_PLAYER_PROPERTIES, TEAM_PROPERTIES, NUMERIC_PROPERTIES, ALL_PROPERTIES };