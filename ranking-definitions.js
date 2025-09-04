const TEAM_MAP = {
    ARI: ["Ari", "Arizona"],
    ATL: ["Atl", "Atlanta"],
    BAL: ["Bal", "Baltimore"],
    BUF: ["Buf", "Buffalo"],
    CAR: ["Car", "Carolina"],
    CHI: ["Chi", "Chicago"],
    CIN: ["Cin", "Cincinnati"],
    CLE: ["Cle", "Cleveland"],
    DAL: ["Dal", "Dallas"],
    DEN: ["Den", "Denver"],
    DET: ["Det", "Detroit"],
    FA: ["FA", "Free Agent"],
    GB: ["GB", "Green Bay"],
    HOU: ["Tex", "Houston"],
    IND: ["Ind", "Indianapolis"],
    JAC: ["Jax", "Jacksonville"],
    KC: ["KC", "Kansas City"],
    LAC: ["LAC", "LA Chargers"],
    LAR: ["LAR", "LA Rams"],
    LV: ["LV", "Las Vegas"],
    MIA: ["Mia", "Miami"],
    MIN: ["Min", "Minnesota"],
    NE: ["NE", "New England"],
    NYG: ["NYG", "NY Giants"],
    NYJ: ["NYJ", "NY Jets"],
    NO: ["NO", "New Orleans"],
    PHI: ["Phi", "Philadelphia"],
    PIT: ["Pit", "Pittsburgh"],
    SEA: ["Sea", "Seattle"],
    SF: ["SF", "San Francisco"],
    TB: ["TB", "Tampa Bay"],
    TEN: ["Ten", "Tennessee"],
    WAS: ["Was", "Washington"]
}

const ALL_POSITIONS = [
    "qb",
    "rb",
    "wr",
    "te",
    "k",
    "dst"
];

const SINGLE_PLAYER_POSITIONS = [
    "QB",
    "TE",
    "K"
];

const MANY_PLAYER_POSITIONS = [
    "RB",
    "WR"
];

const TEAM_POSITIONS = [
    "DST"
];

const TAXI_POSITIONS = [
    "T1",
    "T2",
    "T3",
    "T4"
];

module.exports = { TEAM_MAP, ALL_POSITIONS, SINGLE_PLAYER_POSITIONS, MANY_PLAYER_POSITIONS, TEAM_POSITIONS, TAXI_POSITIONS };