# Outsera Technical Challenge — QA Automation Suite

> Suíte completa de automação de testes desenvolvida como desafio técnico, cobrindo API, E2E Web, Mobile e Performance com pipeline CI/CD integrado.

---

## Índice

1. [Descrição e Objetivo](#descrição-e-objetivo)
2. [Mapeamento dos 5 Pontos do Desafio](#mapeamento-dos-5-pontos-do-desafio)
3. [Arquitetura](#arquitetura)
4. [Estrutura de Pastas](#estrutura-de-pastas)
5. [Tecnologias e Versões](#tecnologias-e-versões)
6. [Pré-requisitos](#pré-requisitos)
7. [Instalação](#instalação)
8. [Configuração de Ambiente](#configuração-de-ambiente)
9. [Como Executar](#como-executar)
10. [Geração de Relatórios](#geração-de-relatórios)
11. [Pipeline CI/CD](#pipeline-cicd)
12. [Estratégia de Paralelismo](#estratégia-de-paralelismo)
13. [Evidências Geradas](#evidências-geradas)
14. [Decisões Técnicas](#decisões-técnicas)

---

## Descrição e Objetivo

Este projeto implementa uma suíte profissional de automação de testes cobrindo os cinco pontos do desafio:

| Camada | Ferramenta | Alvo |
|--------|-----------|------|
| **API** | Cypress | [restful-booker.herokuapp.com](https://restful-booker.herokuapp.com/apidoc) |
| **E2E Web** | Cypress + Cucumber (Gherkin) | [restful-booker.herokuapp.com](https://restful-booker.herokuapp.com) |
| **Mobile** | Appium + WebDriverIO | [the-internet.herokuapp.com](https://the-internet.herokuapp.com) |
| **Performance** | K6 | [restful-booker.herokuapp.com](https://restful-booker.herokuapp.com/apidoc) |

**Objetivo:** garantir qualidade em múltiplos níveis, desde contratos de API até experiência mobile, com evidências rastreáveis e pipeline automatizado.

---

## Mapeamento dos 5 Pontos do Desafio

A divisão do projeto segue **exatamente** os 5 pontos do PDF. Cada ponto tem uma pasta dedicada (1:1) e um escopo de relatório isolado:

| # | Ponto do PDF | Pasta | Relatório |
|---|--------------|-------|-----------|
| 1 | Testes Automatizados de API | [`api-tests/`](./api-tests) | [`reports/api/`](./reports/api) |
| 2 | Testes End-to-End (E2E) | [`e2e-tests/`](./e2e-tests) | [`reports/e2e/`](./reports/e2e) |
| 3 | Desafio de Integração e CI/CD | [`.github/workflows/`](./.github/workflows) | GitHub Actions (artefatos) |
| 4 | Testes Automatizados de Carga *(opcional)* | [`performance-tests/`](./performance-tests) | [`reports/performance/`](./reports/performance) |
| 5 | Testes Mobile *(opcional)* | [`mobile-tests/`](./mobile-tests) | [`reports/mobile/`](./reports/mobile) |

**Por que `api-tests` e `e2e-tests` são pastas separadas?**
São modelos de execução diferentes: a API usa `cy.request()` (sem browser, sem preprocessador), enquanto o E2E exige o preprocessador Cucumber/esbuild e um browser real. Cada um precisa de seu próprio `cypress.config.js`. Mantê-los separados deixa cada ponto do desafio autocontido e evita configs condicionais.

---

## Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                   GitHub Actions CI/CD                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  API Tests   │  │  E2E Tests   │  │  Performance │  │
│  │ (2 máquinas  │  │ (2 máquinas  │  │     K6       │  │
│  │  paralelas)  │  │  paralelas)  │  │  500 VUs 5m  │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         └─────────────────┴─────────────────┘          │
│                    ┌──────────────┐                     │
│                    │   Reports    │                     │
│                    │  (HTML/JSON) │                     │
│                    └──────────────┘                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    Projeto Local                         │
│                                                         │
│  api-tests/     e2e-tests/     mobile-tests/            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Cypress  │  │Cypress + │  │  WDIO +  │              │
│  │ cy.req() │  │Cucumber  │  │  Appium  │              │
│  │ Commands │  │  Pages   │  │  Pages   │              │
│  │ Fixtures │  │  Steps   │  │  Tests   │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
```

**Princípios de design:**
- **Separação de responsabilidades**: configs, fixtures, commands e specs isolados
- **Page Object Model**: em E2E e Mobile para eliminar duplicação de seletores
- **DRY (Don't Repeat Yourself)**: comandos customizados reutilizáveis em toda a suíte API
- **Dados de teste em fixtures**: fácil manutenção e extensão de massa de dados
- **Fail-fast desabilitado**: matriz com `fail-fast: false` para executar todos os cenários

---

## Estrutura de Pastas

```
outsera-technical-challenge/
│
├── api-tests/                         # Testes de API com Cypress
│   ├── cypress.config.js              # Config Cypress (baseUrl, retries, env)
│   └── cypress/
│       ├── e2e/
│       │   ├── auth/
│       │   │   └── auth.cy.js         # POST /auth (positivos + negativos)
│       │   └── booking/
│       │       ├── create-booking.cy.js   # POST /booking
│       │       ├── get-booking.cy.js      # GET /booking e /booking/:id
│       │       ├── update-booking.cy.js   # PUT e PATCH /booking/:id
│       │       ├── delete-booking.cy.js   # DELETE /booking/:id
│       │       └── contract-validation.cy.js  # Validação de contratos
│       ├── fixtures/
│       │   ├── auth/
│       │   │   └── credentials.json   # Credenciais de teste
│       │   └── booking/
│       │       ├── valid-booking.json     # Massa de dados válidos
│       │       ├── invalid-booking.json   # Dados inválidos (cenários negativos)
│       │       └── update-booking.json    # Dados de atualização
│       └── support/
│           ├── e2e.js                 # Setup global, handlers
│           └── commands/
│               ├── auth.commands.js       # cy.createAuthToken(), etc.
│               ├── booking.commands.js    # cy.createBooking(), cy.getBooking(), etc.
│               └── assertion.commands.js  # cy.assertBookingSchema(), etc.
│
├── e2e-tests/                         # Testes E2E Web com Cypress + Cucumber
│   ├── cypress.config.js              # Config com cucumber-preprocessor + esbuild
│   ├── .cypress-cucumber-preprocessorrc.json
│   └── cypress/
│       ├── e2e/
│       │   ├── features/
│       │   │   └── login/
│       │   │       └── login.feature  # Scenarios Gherkin (PT-BR)
│       │   ├── step-definitions/
│       │   │   └── login/
│       │   │       └── login.steps.js # Given/When/Then implementations
│       │   └── pages/                 # Page Objects (única fonte de verdade)
│       │       ├── BasePage.js        # PO base: navegação, espera, asserções
│       │       ├── LoginPage.js       # PO: seletores + ações da tela de login
│       │       └── AdminPage.js       # PO: painel administrativo
│       ├── fixtures/
│       │   └── users.json             # Usuários de teste
│       └── support/
│           ├── e2e.js
│           └── commands.js
│
├── mobile-tests/                      # Testes Mobile com Appium + WebDriverIO
│   ├── runner.js                      # Entry point (npm run test:mobile)
│   ├── config/
│   │   └── wdio.conf.js               # Config WDIO (capabilities Android/iOS)
│   ├── pages/
│   │   ├── BasePage.js                # Métodos base (open, tap, type, assert)
│   │   ├── HomePage.js                # PO: the-internet home
│   │   ├── LoginPage.js               # PO: form authentication
│   │   └── CheckboxesPage.js          # PO: checkboxes
│   ├── tests/
│   │   ├── home.test.js               # Abertura, título, navegação
│   │   └── login.test.js              # Login, logout, credenciais inválidas
│   └── helpers/
│       └── driver-helper.js           # Utilitários: context switch, scroll
│
├── performance-tests/                 # Testes de Performance/Carga com K6
│   └── scripts/
│       ├── config.js                  # BASE_URL, thresholds, helpers
│       ├── get-booking.js             # GET /booking (500 VUs, 5min)
│       ├── post-booking.js            # POST /booking (500 VUs, 5min)
│       └── full-scenario.js           # Fluxo completo CRUD (500 VUs, 5min)
│
├── reports/                           # Relatórios por escopo (1 pasta por ponto)
│   ├── README.md                      # Explica o que cada relatório apresenta
│   ├── api/                           # Ponto 1: Mochawesome (API)
│   ├── e2e/                           # Ponto 2: Mochawesome + Cucumber (E2E)
│   ├── mobile/                        # Ponto 5: WDIO spec output
│   └── performance/                   # Ponto 4: K6 summary.html/json
│
├── scripts/
│   ├── check-env.js                   # Valida variáveis de ambiente
│   └── generate-reports.js            # Gera 1 relatório HTML por escopo
│
├── .github/
│   └── workflows/
│       └── test-pipeline.yml          # Pipeline CI/CD completo (ponto 3)
│
├── .env.example                       # Template de variáveis de ambiente
├── .eslintrc.js                       # Regras ESLint
├── package.json                       # Dependências e scripts npm
└── README.md
```

---

## Tecnologias e Versões

| Tecnologia | Versão | Finalidade |
|-----------|--------|-----------|
| **Node.js** | ≥ 18.0.0 | Runtime |
| **Cypress** | ^13.17.0 | API Tests + E2E Tests |
| **@badeball/cypress-cucumber-preprocessor** | ^20.1.2 | Integração Gherkin/Cucumber |
| **@bahmutov/cypress-esbuild-preprocessor** | ^2.2.2 | Bundler para o Cucumber |
| **WebDriverIO** | ^8.36.0 | Test runner para Mobile |
| **Appium** | ^2.5.0 | Driver Mobile |
| **K6** | latest | Performance Tests |
| **Mochawesome** | ^7.1.3 | Reports HTML |
| **@faker-js/faker** | ^8.3.1 | Geração de dados |
| **ESLint** | ^8.57.0 | Linting |

---

## Pré-requisitos

```
Node.js >= 18.0.0
npm >= 9.0.0
K6 (para performance)
Java 17+ (para testes mobile com emulador Android)
Android SDK (para testes mobile)
Appium 2.x (para testes mobile)
```

### Verificar instalações

```bash
node --version      # >= v18.0.0
npm --version       # >= 9.0.0
k6 version          # k6 v0.x.x
appium --version    # 2.x.x (apenas para mobile)
java -version       # 17+  (apenas para mobile)
```

---

## Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/januariod/outsera-technical-challenge.git
cd outsera-technical-challenge

# 2. Instale as dependências
npm install

# 3. Instale K6 (Linux)
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg \
  --keyserver hkp://keyserver.ubuntu.com:80 \
  --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" \
  | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update && sudo apt-get install k6

# macOS
brew install k6

# 4. Instale Appium (apenas para mobile)
npm install -g appium@2.5.0
appium driver install uiautomator2     # Android
appium driver install xcuitest         # iOS
```

---

## Configuração de Ambiente

```bash
# Copie o template de variáveis de ambiente
cp .env.example .env

# Edite conforme necessário (opcional - valores padrão já funcionam)
```

As variáveis disponíveis estão documentadas em `.env.example`.

> **Nota:** As credenciais padrão (`admin` / `password123`) são públicas e documentadas na API Restful Booker.

---

## Como Executar

### Testes de API

```bash
# Executar todos os testes de API
npm run test:api

# Abrir Cypress interativo para API
npm run test:api:open

# Executar apenas autenticação
npx cypress run --project api-tests --spec "api-tests/cypress/e2e/auth/**"

# Executar apenas contratos
npx cypress run --project api-tests --spec "api-tests/cypress/e2e/booking/contract-validation.cy.js"
```

### Testes E2E Web (Cucumber)

```bash
# Executar todos os cenários E2E
npm run test:e2e

# Abrir Cypress interativo
npm run test:e2e:open

# Executar feature específica
npx cypress run --project e2e-tests --spec "e2e-tests/cypress/e2e/features/login/login.feature"

# Executar apenas cenários @smoke
npx cypress run --project e2e-tests --env TAGS="@smoke"
```

### Testes Mobile (Appium)

> **Pré-requisito:** Dispositivo/emulador Android conectado e Appium instalado.

```bash
# Android (default)
npm run test:mobile

# iOS
PLATFORM=ios npm run test:mobile

# Verificar dispositivo conectado
adb devices
```

### Testes de Performance (K6)

```bash
# Cenário completo (500 VUs, 5 min)
npm run test:performance

# Apenas GET
npm run test:performance:get

# Apenas POST
npm run test:performance:post

# Com relatório JSON
npm run test:performance:report

# Configuração CI-friendly (50 VUs, 1 min)
k6 run --vus 50 --duration 1m performance-tests/scripts/full-scenario.js
```

---

## Geração de Relatórios

Cada escopo gera um relatório **isolado** — nunca misturados — então fica claro o que cada um apresenta (detalhes em [`reports/README.md`](./reports/README.md)).

### Relatórios HTML de Cypress (API e E2E, separados)

```bash
# Gera reports/api/index.html E reports/e2e/index.html (cada um no seu escopo)
npm run report

# Ou individualmente:
npm run report:api   # apenas Ponto 1 (API)  → reports/api/index.html
npm run report:e2e   # apenas Ponto 2 (E2E)  → reports/e2e/index.html
```

### Relatório de Performance (Ponto 4)

```bash
k6 run --out json=reports/performance/results.json performance-tests/scripts/full-scenario.js
# HTML gerado em: reports/performance/summary.html
```

### Relatório Mobile (Ponto 5)

```bash
npm run test:mobile   # WDIO escreve a saída em reports/mobile/
```

---

## Pipeline CI/CD

### Fluxo

```
Push/PR → Trigger Pipeline
         │
         ├─ Job 1: api-tests (matrix: [0, 1])
         │   ├─ Máquina 0: Auth + Create (paralela)
         │   └─ Máquina 1: Get + Update + Delete + Contract (paralela)
         │
         ├─ Job 2: e2e-tests (matrix: [0, 1])
         │   ├─ Máquina 0: Login Feature (paralela)
         │   └─ Máquina 1: All Features (paralela)
         │
         ├─ Job 3: mobile-tests (Android Emulator)
         │
         ├─ Job 4: performance-tests (K6, 50 VUs em CI)
         │
         └─ Job 5: report (needs: api + e2e)
             ├─ Download artifacts (api + e2e)
             ├─ Gera 1 relatório HTML por escopo (npm run report)
             └─ Upload reports/api e reports/e2e (separados)
```

### Trigger Manual

```
Actions → QA Automation Pipeline → Run workflow → suite: [all|api|e2e|mobile|performance]
```

---

## Estratégia de Paralelismo

A suíte API e E2E rodam em **2 runners paralelos** via `matrix strategy`:

| Máquina | Responsabilidade | Tempo estimado |
|---------|-----------------|----------------|
| 0 | Auth + Create | ~3 min |
| 1 | Get + Update + Delete + Contract | ~4 min |

**Resultado:** Tempo total reduz de ~7 min (sequencial) para ~4 min (paralelo).

`fail-fast: false` garante execução completa e relatório abrangente mesmo com falhas isoladas.

---

## Evidências Geradas

| Tipo | Gerado por | Conteúdo |
|------|-----------|---------|
| Screenshots | Cypress (automático em falha) | Captura da tela no momento da falha |
| Vídeos | Cypress | Gravação completa de cada spec |
| HTML Report | Mochawesome | Gráficos, duração, pass/fail |
| JSON Report | Mochawesome | Dados estruturados para integração |
| Cucumber HTML | cucumber-preprocessor | Relatório por cenário Gherkin |
| K6 HTML | handleSummary() | Métricas p95, p99, error rate, req/s |
| GitHub Summary | Actions | Tabela de resultados por suite |

---

## Decisões Técnicas

**`cy.request()` sem browser:** Testes de API rodam sem abrir browser, tornando-os mais rápidos e determinísticos.

**esbuild como bundler:** ~10x mais rápido que webpack no bundling dos step definitions Cucumber.

**Fixtures por domínio:** Arquivos separados por contexto (`auth/`, `booking/`) com dados nomeados semanticamente.

**Commands customizados isolados:** Mudanças na API exigem atualização apenas nos commands, não nos specs.

**K6 `handleSummary()` inline:** Elimina dependência de `k6-html-reporter`, que requer Node.js no ambiente K6.

**`continue-on-error: true` em mobile/performance:** Não bloqueia relatório consolidado em ambientes sem emulador.

---

## Autor

**Daniel Januario**  
QA Automation Engineer  
[djanuario@outlook.com.br](mailto:djanuario@outlook.com.br)  
[github.com/januariod](https://github.com/januariod)
