# Lazy Owner Fantasy Football League (LOFFL) Weekly Rankings

## Description

There are two parts to this app:

1. We first get the org chart.
    1. Read the weekly org chart `./data/input_org_chart.txt`
    2. Write an output JSON file `./data/output-org-chart.json`

2. We then get the rankings.
    1. Get weekly rankings from [FantasyPros.com](https://www.fantasypros.com) for each position
    2. Match each position player with the org chart
    2. Write output JSON files `.data/rankings-[position].json`

## Requirements

* Node

## Usage

### Step 1: Clone the repo and change to the working directory.

```bash
git clone https://github.com/mofo110/loffl-rankings.git
cd loffl-rankings
```

### Step 2: Execute to get the org chart.

```bash
node get-org-chart.js
```

> [!NOTE]
> Sample `./data/output-org-chart.json`:

```console
[
...,
    {
        "name": "WFT",
        "RB": [],
        "WR": [],
        "Def": "",
        "SpT": "",
        "PicksRemaining": 0
    }
]
```

### Step 3: Execute to get the weekly rankings.

```bash
node get-rankings.js
```

> [!NOTE]
> Sample `./data/rankings-qb.json`:

```console
[
    {
        "week": 1,
        "position": "QB",
        "rank": 1,
        "shortName": "J. Allen",
        "name": "Josh Allen",
        "team": "BUF",
        "byeWeek": 7,
        "opponent": "vs. BAL",
        "grade": "A+",
        "orgName": ""
    },
    ...
]
```