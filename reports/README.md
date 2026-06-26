# 📊 Relatórios de Teste

Cada subpasta contém **um escopo isolado**, alinhado a um ponto do desafio.
Nenhum relatório mistura escopos — fica sempre claro o que cada um apresenta.

| Pasta | Ponto do PDF | O que apresenta | Ferramenta | Como gerar |
|-------|--------------|-----------------|------------|------------|
| [`api/`](./api) | 1 — Testes de API | Resultados dos testes de API (auth, CRUD de booking, contrato) | Cypress + Mochawesome | `npm run test:api` → `npm run report:api` |
| [`e2e/`](./e2e) | 2 — Testes E2E | Cenários de login/admin via UI em Gherkin | Cypress + Cucumber | `npm run test:e2e` → `npm run report:e2e` |
| [`mobile/`](./mobile) | 5 — Testes Mobile | Execução dos specs mobile | WebdriverIO + Appium | `npm run test:mobile` |
| [`performance/`](./performance) | 4 — Testes de Carga | Métricas de carga (p95/p99, error rate, RPS) | K6 (`summary.html`/`summary.json`) | `npm run test:performance` |

> O ponto 3 (CI/CD) não gera relatório próprio — ele **orquestra** todos os
> escopos acima em [`.github/workflows/test-pipeline.yml`](../.github/workflows/test-pipeline.yml)
> e publica cada relatório como artefato separado.

## Gerar todos os relatórios HTML de Cypress de uma vez

```bash
npm run report   # gera reports/api/index.html e reports/e2e/index.html (separados)
```
