# Data Model

## Data Strategy

Version 1 uses local demo data for a Manchester United 2025/2026 season. The data should be realistic enough to support meaningful analytics and AI outputs, but it does not need to match official live data.

The model should be clean enough to support future CSV/API ingestion without rewriting the dashboard.

## Core Domain Types

### Match

Represents one played match.

Fields:

- `id`
- `date`
- `competition`
- `opponent`
- `venue`: `home`, `away`, or `neutral`
- `goalsFor`
- `goalsAgainst`
- `result`: `win`, `draw`, or `loss`
- `xG`
- `xGA`
- `shots`
- `shotsOnTarget`
- `possession`
- `pressingIntensity`
- `buildUpQuality`
- `chanceCreation`
- `defensiveRisk`

### Fixture

Represents an upcoming match.

Fields:

- `id`
- `date`
- `competition`
- `opponent`
- `venue`
- `opponentForm`
- `opponentStrengths`
- `opponentWeaknesses`
- `matchImportance`

### PlayerStat

Represents season-level or filtered player performance.

Fields:

- `id`
- `name`
- `position`
- `appearances`
- `minutes`
- `goals`
- `assists`
- `xG`
- `xA`
- `shots`
- `keyPasses`
- `rating`
- `formTrend`
- `injuryStatus`

### TeamMetric

Represents aggregated team performance.

Fields:

- `matches`
- `wins`
- `draws`
- `losses`
- `goalsFor`
- `goalsAgainst`
- `points`
- `xG`
- `xGA`
- `xGD`
- `cleanSheets`
- `conversionRate`
- `formIndex`
- `defensiveStability`

### TacticalMetric

Represents tactical profile and risk signals.

Fields:

- `pressingIntensity`
- `buildUpQuality`
- `chanceCreation`
- `defensiveRisk`
- `transitionRisk`
- `setPieceThreat`
- `matchControl`

## Derived Metrics

Required v1 metrics:

- `formIndex`: recent results weighted toward newer matches.
- `xGD`: xG minus xGA.
- `conversionRate`: goals divided by shots or xG context.
- `defensiveStability`: inverse of goals against, xGA, and defensive risk.
- `playerImpactScore`: weighted goals, assists, xG, xA, minutes, and rating.
- `tacticalRiskScore`: combined defensive risk, transition risk, and declining control.
- `awayFormIndex`: filtered form for away matches.

## AI Context Shape

AI should receive curated context, not the entire dataset by default.

Recommended context:

- current filters;
- summarized team metrics;
- top positive and negative trends;
- top players by impact;
- relevant match samples;
- tactical risk signals;
- missing data warnings.

## Future Ingestion Readiness

The demo data should be separated from metric calculations. Future phases may add:

- CSV import;
- Excel import;
- football API ingestion;
- database persistence;
- scheduled refresh through n8n.

## Phase 2 Implementation Notes

Phase 2 stores the local Manchester United 2025/2026 demo season in `lib/mock-data.ts` and keeps derived calculations in `lib/analytics.ts`.

Implemented demo entities:

- 24 played matches across Premier League, Champions League, FA Cup, and Carabao Cup.
- Upcoming fixtures with opponent form, strengths, weaknesses, and match importance.
- Player season profiles with minutes, goals, assists, xG, xA, key passes, pressing actions, recoveries, rating, form trend, and injury status.

Implemented filters:

- tournament;
- home/away/neutral venue;
- date range;
- player selector for player-impact context.

Implemented derived outputs:

- team KPI metrics;
- xG/xGA trend data;
- competition split;
- player impact scores;
- tactical profile;
- tactical risk score and risk matrix.

## Supabase Persistence Model

Future real-data persistence is specified in `docs/SUPABASE_PERSISTENCE.md`.

Initial Supabase tables:

- `teams`, `players`, `competitions`, `matches`, `fixtures`
- `team_match_stats`, `player_match_stats`, `tactical_match_metrics`
- `ingestion_sources`, `ingestion_runs`, `raw_ingestion_events`
- `ai_reports`, `ai_insights`, `anomaly_alerts`, `automation_runs`

Initial Supabase Storage buckets:

- `raw-snapshots`
- `imports`
- `exports`
