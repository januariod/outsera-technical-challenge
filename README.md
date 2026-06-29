# Outsera Technical Challenge — QA Automation Suite

> Suíte completa de automação de testes desenvolvida como desafio técnico para posição de QA, cobrindo API, E2E Web, Mobile e Performance, com pipeline CI/CD integrada.

---

## Índice

1. [Descrição e Objetivo](#descrição-e-objetivo)
2. [Arquitetura e Padrões de Projeto](#arquitetura-e-padrões-de-projeto)
3. [Estrutura de Pastas](#estrutura-de-pastas)
4. [Tecnologias e Versões](#tecnologias-e-versões)
5. [Pre-requisitos e Dependencias](#pre-requisitos-e-dependencias)
6. [Como Instalar](#como-instalar)
7. [Configuracao de Ambiente](#configuracao-de-ambiente)
8. [Como Executar os Testes](#como-executar-os-testes)
9. [Geracao de Relatorios](#geracao-de-relatorios)
10. [Decisoes Tecnicas e Boas Praticas](#decisoes-tecnicas-e-boas-praticas)

---

## Descrição e Objetivo

Este projeto implementa uma suíte profissional de automação de testes cobrindo quatro frentes distintas da Engenharia de Qualidade, com o objetivo de entregar um ecossistema completo e seguro:

| Camada | Ferramenta | Alvo de Teste |
| -------- | ----------- | ------ |
| **API** | Cypress | [Restful Booker API](https://restful-booker.herokuapp.com/apidoc) |
| **E2E Web** | Cypress + Cucumber (BDD) | [SauceDemo (Swag Labs)](https://www.saucedemo.com) |
| **Mobile** | Appium + WebDriverIO | My Demo App (Sauce Labs - React Native) |
| **Performance** | K6 | Restful Booker API (Endpoint de Listagem) |

**Foco da Entrega:** Garantir estabilidade, escalabilidade, segurança no tratamento de credenciais, geração de métricas rastreáveis e execução otimizada em esteira contínua (CI/CD).

---

## Arquitetura e Padrões de Projeto

A arquitetura foi desenhada priorizando o isolamento de escopo. Cada suíte roda de forma autônoma, evitando conflitos de configuração.

- **Page Object Model (POM):** Utilizado no E2E Web e Mobile para abstrair seletores e regras de negócio da UI, centralizando a manutenção.
- **BDD (Behavior-Driven Development):** Especificações Web escritas em Gherkin (`pt-BR`) para garantir documentação viva e fácil entendimento por stakeholders.
- **Custom Commands & Programmatic Login:** Injeção de cookies e tokens de sessão via API/Storage para acelerar testes funcionais (Bypass de UI).
- **Paralelismo (Matrix Strategy):** A pipeline de CI/CD no GitHub Actions divide a carga de trabalho em múltiplos runners para reduzir o tempo de feedback.

---

## Estrutura de Pastas

```text
outsera-technical-challenge/
│
├── api-tests/                         # Testes de API (Contratos, CRUD)
├── e2e-tests/                         # Testes E2E Web (SauceDemo)
├── mobile-tests/                      # Testes Nativos Mobile (Appium)
├── performance-tests/                 # Testes de Carga
├── reports/                           # Artefatos consolidados por cada suíte
├── scripts/generate-reports.js        # Script gerador/mesclador de relatórios
├── .github/workflows/                 # Esteira CI/CD (GitHub Actions)
└── package.json                       # Scripts de orquestração e dependências
```

## Tecnologias e Versões

``` text
| Tecnologia | Versão | Propósito |
| ----------- | -------- | ----------- |
| **Node.js** | `>= 18.x` | Runtime base |
| **Cypress** | `^13.17.0` | Automação E2E Web e testes de API |
| **Cucumber Preprocessor**| `^24.0.1` | Integração do padrão BDD ao Cypress |
| **WebDriverIO** | `^9.x.x` | Runner de automação mobile |
| **Appium (UiAutomator2)**| `^2.5.0` | Interação nativa com emulador Android |
| **K6** | `latest` | Motor de injeção de carga e stress test |
| **Mochawesome** | `^7.1.4` | Geração de reports dinâmicos em HTML |
```

---

## Pré-requisitos e Dependências

Para executar o projeto **localmente**, garanta que seu ambiente possui:

- `Node.js` (v18+) e `npm`
- `K6 CLI` (Para testes de performance)
- `Java JDK 17+` e `Android Studio` (Apenas para rodar a suíte Mobile local)

---

## Como Instalar

```bash
# 1. Clone este repositório
git clone https://github.com/januariod/outsera-technical-challenge.git
cd outsera-technical-challenge

# 2. Instale as dependências do projeto
npm install

# 3. Instale os Drivers Globais (Apenas para Testes Mobile Local)
npm install -g appium@2.5.0
npx appium driver install uiautomator2
```

*(As instruções de instalação do K6 dependem do seu SO, consulte [aqui](https://k6.io/docs/get-started/installation/)).*

---

## Configuração de Ambiente

**Credenciais Segurança:** Nenhuma credencial sensível é comitada neste repositório.

**1. Execução no CI/CD (GitHub Actions):**
O pipeline lê dinamicamente as variáveis de ambiente e senhas injetadas via **GitHub Secrets**.

**2. Execução Local:**
Crie os arquivos para armazenar as credenciais que alimentarão os testes:

**Para API & E2E:** Crie um arquivo `e2e-tests/cypress.env.json` (e um equivalente em `api-tests/`) com:

```json
{
  "ADMIN_USERNAME": "admin",
  "ADMIN_PASSWORD": "password123",
  "SAUCE_USERNAME": "standard_user",
  "SAUCE_PASSWORD": "secret_sauce"
}
```

---

## Como Executar os Testes

Os scripts NPM foram unificados para simplificar a orquestração do projeto.

### Testes de API

```bash
npm run test:api        # Roda em modo headless
npm run test:api:open   # Abre a interface interativa do Cypress
```

### Testes E2E Web (Cucumber)

```bash
npm run test:e2e        # Roda todos os cenários Gherkin em headless
npm run test:e2e:open   # Abre a interface interativa do Cypress
```

### 📱 Testes Mobile (Appium)
> **Pré-requisito:** O emulador Android precisa estar iniciado (Recomendação: API 28 a 33).

Como não commitamos binários no repositório, baixe o APK de teste rodando o comando abaixo na raiz do projeto antes da primeira execução:
```bash
mkdir -p mobile-tests/app
curl -L -o mobile-tests/app/Android-MyDemoAppRN.apk https://github.com/saucelabs/my-demo-app-rn/releases/download/v1.3.0/Android-MyDemoAppRN.1.3.0.build-244.apk
```

```bash
npm run test:mobile     # Executa a suite nativa no WebdriverIO
```

### Testes de Performance

```bash
npm run test:performance # Inicia a simulação de 500 VUs contra a API
```

---

## Geração de Relatórios

O projeto salva evidências automaticamente (json, prints de falhas e vídeos) em cada execução. Para gerar a visualização consolidada em **HTML**:

```bash
# Gera relatórios HTML isolados para Web, API e Mobile
npm run report:api
npm run report:e2e
npm run report:mobile

# Ou consolide todos usando o script automático:
npm run report
```

Os relatórios consolidados (`index.html`) estarão disponíveis dentro de `/reports/api/`, `/reports/e2e/`, `/reports/mobile/` e `/reports/performance/`.

---

## Decisões Técnicas e Boas Práticas

1. **Gestão do Teclado e Scrolling Nativo (Mobile):** O WebdriverIO foi implementado com `UiScrollable` e `hideKeyboard()` para garantir que o fluxo de checkout E2E não quebre em telas de resoluções menores, garantindo altíssima estabilidade.
2. **Encapsulamento de Setup (E2E Web):** O fluxo de login foi isolado em um *Custom Command* otimizado no Cypress. Isso mantém as *Features* de Checkout focadas estritamente na jornada do carrinho, sem poluir o Gherkin com passos repetitivos de autenticação visual.
3. **Download Dinâmico de APK:** A pipeline CI/CD não onera o repositório com binários `.apk`. O GitHub Actions baixa a release diretamente em runtime antes do boot do emulador.
4. **Relatório Analítico de Performance:** O script K6 foi desenhado de forma limpa focando no SLA de 500 VUs, contendo uma análise técnica do gargalo identificada no arquivo `ANALISE_DE_PERFORMANCE.md` na raiz da pasta.

---
**Desenvolvido por:** Daniel Januario
