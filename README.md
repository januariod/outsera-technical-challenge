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

**Credenciais e Segurança:** Nenhuma credencial é comitada neste repositório. Mesmo sendo credenciais **públicas** de aplicações de demonstração (Restful Booker, SauceDemo, My Demo App), manter usuário/senha fixos no código é uma má prática — por isso todas foram extraídas para arquivos de ambiente (gitignored) e variáveis de ambiente.

**1. Execução no CI/CD (GitHub Actions):**
O pipeline lê dinamicamente as variáveis de ambiente e senhas injetadas via **GitHub Secrets** (`ADMIN_USERNAME`, `ADMIN_PASSWORD`, `SAUCE_USERNAME`, `SAUCE_PASSWORD`, `MOBILE_USERNAME`, `MOBILE_PASSWORD`).

**2. Execução Local:**
Antes de rodar qualquer suíte, **é obrigatório criar o respectivo arquivo de ambiente**. Caso alguma variável esteja ausente, os testes **não são executados** — uma verificação (`scripts/validate-required-env.js`) falha rápido (fail-fast) com uma mensagem indicando exatamente o que está faltando e apontando para esta seção do README.

> ⚠️ Os valores abaixo são as credenciais **públicas de demonstração** dos próprios alvos de teste (Restful Booker, SauceDemo e My Demo App), documentadas aqui **apenas para fins didáticos** — para que você consiga rodar o projeto rapidamente. Em um cenário real, esses valores viriam de um cofre de segredos (Vault, GitHub Secrets, etc.), nunca do README.

**Para API** — crie `api-tests/cypress.env.json`:

```bash
cat > api-tests/cypress.env.json << 'EOF'
{
  "ADMIN_USERNAME": "admin",
  "ADMIN_PASSWORD": "password123"
}
EOF
```

**Para E2E** — crie `e2e-tests/cypress.env.json`:

```bash
cat > e2e-tests/cypress.env.json << 'EOF'
{
  "SAUCE_USERNAME": "standard_user",
  "SAUCE_PASSWORD": "secret_sauce"
}
EOF
```

**Para Mobile** — crie `mobile-tests/.env`:

```bash
cat > mobile-tests/.env << 'EOF'
MOBILE_USERNAME=bob@example.com
MOBILE_PASSWORD=10203040
EOF
```

Alternativamente, em qualquer suíte, as variáveis podem ser exportadas diretamente no shell em vez de criar o arquivo (é assim que o CI/CD injeta os GitHub Secrets):

```bash
export CYPRESS_ADMIN_USERNAME=admin CYPRESS_ADMIN_PASSWORD=password123
export CYPRESS_SAUCE_USERNAME=standard_user CYPRESS_SAUCE_PASSWORD=secret_sauce
export MOBILE_USERNAME=bob@example.com MOBILE_PASSWORD=10203040
```

### Execução Multi-Ambiente

Tanto a suíte de API quanto a E2E resolvem a `baseUrl` dinamicamente a partir de um mapa de ambientes (`cypress/config/environments.js`), permitindo executar a mesma bateria de testes contra `local`, `dev`, `staging` ou `production` sem alterar nenhum teste.

O ambiente padrão é `dev`. Para selecionar outro, use a flag `--env ENV=` ou a variável `CYPRESS_ENV`:

```bash
# Via flag do Cypress
npm run test:api  -- --env ENV=staging
npm run test:e2e  -- --env ENV=production

# Via variável de ambiente
CYPRESS_ENV=staging npm run test:api
```

> Neste desafio todos os ambientes apontam para a mesma URL pública, mas a estrutura já está pronta para receber URLs distintas por ambiente (basta editar o `environments.js` correspondente).

### Dados de Teste Dinâmicos (API)

As reservas usadas nos testes de API são geradas dinamicamente via **@faker-js/faker** através da factory `api-tests/cypress/support/factories/booking.factory.js`. Isso elimina valores "chumbados" e garante dados únicos a cada execução, mantendo determinismo onde a asserção precisa (via `overrides`):

```js
import { buildBooking } from '../../support/factories/booking.factory'

buildBooking()                          // reserva 100% aleatória
buildBooking({ firstname: 'Daniel' })   // aleatória, mas com um campo fixo
```

---

## Como Executar os Testes

Os scripts NPM foram unificados para simplificar a orquestração do projeto.

### Testes de API

```bash
npm run test:api        # Roda em modo headless (ambiente dev por padrão)
npm run test:api:open   # Abre a interface interativa do Cypress

npm run test:api -- --env ENV=staging   # Executa contra outro ambiente
```

### Testes E2E Web (Cucumber)

```bash
npm run test:e2e        # Roda todos os cenários Gherkin em headless
npm run test:e2e:open   # Abre a interface interativa do Cypress

npm run test:e2e -- --env ENV=staging   # Executa contra outro ambiente
```

### 📱 Testes Mobile (Appium)

#### Pré-requisitos e Setup do Ambiente

1. **Java JDK 17+** — necessário para o Android SDK e o Appium.
   ```bash
   sudo apt install openjdk-17-jdk   # Linux (Debian/Ubuntu)
   # ou baixe em https://adoptium.net/ para Windows/macOS
   java -version
   ```

2. **Android Studio + Android SDK** — baixe em [developer.android.com/studio](https://developer.android.com/studio) e instale. Durante a instalação, garanta que os seguintes componentes do SDK Manager estejam marcados:
   - `Android SDK Platform` (API 28 a 33)
   - `Android SDK Platform-Tools`
   - `Android Emulator`
   - `Intel x86 Emulator Accelerator (HAXM)` (ou suporte a KVM no Linux)

   Configure as variáveis de ambiente do SDK (adicione ao `.bashrc`/`.zshrc` ou variáveis de sistema):
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools
   ```

3. **Criar um dispositivo virtual (AVD) pelo Android Virtual Device Manager:**
   - Abra o Android Studio → menu **More Actions** (ou **Tools**) → **Virtual Device Manager**.
   - Clique em **Create Device**, escolha um perfil de hardware (ex.: Pixel 5).
   - Selecione uma imagem de sistema (ex.: API 28/29/30 - `google_apis`, x86_64). Baixe a imagem se necessário.
   - Finalize e inicie o emulador clicando no ▶ ao lado do dispositivo criado (ou via terminal):
     ```bash
     emulator -list-avds
     emulator -avd <nome_do_avd>
     ```
   - Confirme que o dispositivo está visível e "online":
     ```bash
     adb devices
     ```

4. **Instalar o Appium e o driver Android globalmente:**
   ```bash
   npm install -g appium@2.5.0
   npx appium driver install uiautomator2
   ```

5. **Configurar credenciais do app de teste:** crie `mobile-tests/.env` conforme a seção [Configuração de Ambiente](#configuração-de-ambiente).

6. **Baixar o APK de teste** (não versionado no repositório):
   ```bash
   mkdir -p mobile-tests/app
   curl -L -o mobile-tests/app/Android-MyDemoAppRN.apk https://github.com/saucelabs/my-demo-app-rn/releases/download/v1.3.0/Android-MyDemoAppRN.1.3.0.build-244.apk
   ```

#### Executando

Com o emulador iniciado e o `adb devices` reconhecendo o dispositivo, rode:

```bash
npm run test:mobile     # Executa a suite nativa no WebdriverIO
```

> Se o nome/versão do dispositivo criado for diferente do padrão do projeto, ajuste via variáveis de ambiente antes de rodar: `ANDROID_DEVICE_NAME=<nome> ANDROID_PLATFORM_VERSION=<versão> npm run test:mobile`.

### Testes de Performance

```bash
npm run test:performance # Inicia a simulação de 500 VUs contra a API
```

---

## Geração de Relatórios

O projeto salva evidências automaticamente (json, prints de falhas e vídeos) após cada execução. Para gerar a visualização consolidada em **HTML**:

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
3. **Page Objects com Seletores Reutilizáveis (E2E Web):** Cada Page Object expõe um mapa `elements` de seletores (funções que retornam o *chainable* do Cypress). O mesmo seletor pode ser reaproveitado em qualquer step para asserções específicas (ex.: `LoginPage.elements.usernameInput()`), evitando duplicação e centralizando a manutenção. Métodos parametrizados (ex.: `addProductToCart(slug)`) escalam para novos produtos sem criar um método por item.
4. **Dados Dinâmicos (API):** As reservas são geradas com `@faker-js/faker` via factory, eliminando valores fixos e garantindo unicidade a cada run, com `overrides` para determinismo pontual.
5. **Download Dinâmico de APK:** A pipeline CI/CD não onera o repositório com binários `.apk`. O GitHub Actions baixa a release diretamente em runtime antes do boot do emulador.
6. **Relatório Analítico de Performance:** O script K6 foi desenhado de forma limpa focando no SLA de 500 VUs, contendo uma análise técnica do gargalo identificada no arquivo `ANALISE_DE_PERFORMANCE.md` na raiz da pasta.
7. **Validação Fail-Fast de Credenciais (API, E2E e Mobile):** Nenhuma credencial fica fixa no código-fonte — nem mesmo as públicas de demonstração. Um helper compartilhado (`scripts/validate-required-env.js`) valida, antes de qualquer teste rodar, se as variáveis de ambiente obrigatórias estão definidas. Se faltar alguma, a execução é interrompida imediatamente com uma mensagem explicando o que configurar e onde (seção [Configuração de Ambiente](#configuração-de-ambiente)), em vez de deixar o teste falhar de forma confusa mais tarde.

---
**Desenvolvido por:** Daniel Januario
