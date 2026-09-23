# Accessibility Baseline Audit

## Audit Target

**Website:** Replace this line with the exact public website URL that you audited.

**Audit date:** 2026-09-23

## Tools

- Chrome Lighthouse
- Keyboard-only navigation
- Browser DevTools

## Lighthouse Evidence

Run Lighthouse in Chrome:
1. Open the target website.
2. Open DevTools.
3. Select **Lighthouse**.
4. Select **Accessibility**.
5. Run the report.
6. Record the score and save a screenshot.

### Results

| Check | Result |
|---|---|
| Accessibility score | **FILL FROM YOUR LIGHTHOUSE REPORT** |
| Performance | Optional |
| Best Practices | Optional |

> Do not invent a score. Replace the placeholder with the value shown by your own Lighthouse run.

## Manual Keyboard Audit

Use only the keyboard:
- `Tab` to move through interactive elements.
- `Shift + Tab` to move backwards.
- `Enter` / `Space` to activate controls.
- `Esc` where applicable.

Record observations in this table after testing:

| Area | Observation | Severity | Remediation Priority |
|---|---|---|---|
| Keyboard navigation | FILL AFTER TESTING | Low/Medium/High | P1/P2/P3 |
| Visible focus | FILL AFTER TESTING | Low/Medium/High | P1/P2/P3 |
| Link/button purpose | FILL AFTER TESTING | Low/Medium/High | P1/P2/P3 |
| Heading structure | FILL AFTER TESTING | Low/Medium/High | P1/P2/P3 |
| Form labels | FILL AFTER TESTING | Low/Medium/High | P1/P2/P3 |

## Evidence Screenshots

Add your Lighthouse screenshot and relevant browser screenshots to this repository, for example:

```text
docs/evidence/
├── lighthouse-accessibility.png
├── keyboard-navigation.png
└── focus-state.png
```

## Remediation Priorities

- **P1:** Blocks keyboard or assistive-technology access.
- **P2:** Significant usability/accessibility issue.
- **P3:** Improvement that does not block the main task.

## Summary

The audit should be based on observable Lighthouse results and manual keyboard testing. Findings must be supported by evidence rather than assumptions.
