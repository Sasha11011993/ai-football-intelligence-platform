# AI Agent Specification

## AI Product Goal

The AI layer should make the dashboard feel like a football intelligence assistant, not a generic chatbot. It should explain what is happening, identify why it matters, and recommend what to do next.

Default output language is Ukrainian. The product should include a visible `UA | EN` language switcher, and AI outputs must follow the selected language.

## Agents

### AI Analyst

Purpose:

- answer user questions about team form, players, tactics, risks, and trends;
- explain dashboard metrics in plain language;
- provide recommendations grounded in current filters.

Example questions:

- Why has away form dropped?
- Which player is overperforming xG?
- What is the biggest tactical risk?
- What should the coaching staff monitor next?

### Match Preparation Agent

Purpose:

- prepare a tactical briefing for the next fixture;
- summarize opponent profile;
- identify key matchups and risks;
- recommend tactical priorities.

Output should include:

- opponent overview;
- expected risk factors;
- recommended game plan;
- key player matchups;
- confidence and missing data warnings.

### Weekly Report Agent

Purpose:

- generate executive-style weekly reports;
- summarize performance changes;
- highlight risks, opportunities, and recommended actions;
- produce content usable by n8n workflows.

### AI Evaluation Agent

Purpose:

- check whether AI outputs are grounded in supplied data;
- flag missing data;
- estimate confidence;
- identify hallucination risk;
- produce concise quality metadata for the UI.

## Structured AI Response

All AI routes should return structured JSON:

```json
{
  "language": "uk",
  "answer": "Concise user-facing answer.",
  "recommendations": [
    {
      "title": "Recommendation title",
      "priority": "high",
      "rationale": "Why this matters"
    }
  ],
  "trace": {
    "selectedMetrics": ["xGD", "awayFormIndex"],
    "detectedPatterns": ["Away defensive risk increased over the last five matches"],
    "reasoningSummary": "Audit summary suitable for users, not hidden chain-of-thought.",
    "confidence": 0.78,
    "riskLevel": "medium"
  },
  "usedMetrics": ["xG", "xGA", "formIndex"],
  "dataLineage": [
    {
      "source": "matches",
      "filter": "last_5_away_matches",
      "impact": "primary"
    }
  ],
  "qualityChecks": {
    "groundedInData": true,
    "missingDataWarnings": [],
    "hallucinationRisk": "low"
  }
}
```

`language` should use `uk` for Ukrainian and `en` for English. If no language is provided, routes should default to `uk`.

## Agent Workflow Trace

Trace is an explainability and audit layer. It should not expose private chain-of-thought. It should show:

- selected metrics;
- detected patterns;
- reasoning summary;
- recommended actions;
- confidence score;
- risk level;
- source data references.

## Data Lineage

Each AI insight should identify:

- data source category;
- filters or date range;
- relevant metric names;
- whether the source had primary or supporting impact.

## Quality Guardrails

AI must:

- default to Ukrainian unless the selected language is English;
- state uncertainty when demo data is limited;
- avoid pretending demo data is official;
- avoid claims not supported by supplied metrics;
- return missing-data warnings when necessary;
- keep recommendations practical and football-relevant.

## Model and Cost Strategy

Default mode:

- use an economical model for fast responses;
- only run deeper analysis when the user clicks a deep-analysis action.

The exact model can be selected during implementation based on current OpenAI availability and project budget.
