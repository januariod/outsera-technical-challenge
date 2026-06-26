# language: pt
# e2e-tests/cypress/e2e/features/login/login.feature
# Feature de login para o painel administrativo do Restful Booker.
#
# Decisão técnica: escrita em português para facilitar leitura por stakeholders
# não técnicos. Cenários cobrem fluxos positivos e negativos de autenticação.

@login
Feature: Autenticação no Painel Administrativo

  Como usuário administrador
  Quero me autenticar no sistema
  Para acessar as funcionalidades de gerenciamento de reservas

  Background:
    Given que estou na página de login

  # ─────────────────────────────────────────────────────────────────────────
  # Cenários Positivos
  # ─────────────────────────────────────────────────────────────────────────

  @smoke @positive
  Scenario: Login válido com credenciais corretas
    When informo o usuário "admin" e a senha "password123"
    And clico no botão de login
    Then devo ser redirecionado para o painel administrativo
    And devo ver o painel de gerenciamento de quartos

  @positive
  Scenario: Navegação após autenticação bem-sucedida
    When informo o usuário "admin" e a senha "password123"
    And clico no botão de login
    Then devo ser redirecionado para o painel administrativo
    And devo ver o botão de logout disponível
    When clico no link para a área frontal do hotel
    Then devo ser redirecionado para a página inicial do hotel

  @positive
  Scenario: Logout após login bem-sucedido
    When informo o usuário "admin" e a senha "password123"
    And clico no botão de login
    Then devo ser redirecionado para o painel administrativo
    When clico no botão de logout
    Then devo ser redirecionado para a página de login

  # ─────────────────────────────────────────────────────────────────────────
  # Cenários Negativos
  # ─────────────────────────────────────────────────────────────────────────

  @negative
  Scenario: Login com senha incorreta
    When informo o usuário "admin" e a senha "senhaErrada"
    And clico no botão de login
    Then devo ver uma mensagem de erro de credenciais inválidas
    And devo permanecer na página de login

  @negative
  Scenario: Login com usuário inexistente
    When informo o usuário "usuarioInexistente" e a senha "password123"
    And clico no botão de login
    Then devo ver uma mensagem de erro de credenciais inválidas
    And devo permanecer na página de login

  @negative
  Scenario: Login com campos obrigatórios vazios
    When não preencho nenhum campo
    And clico no botão de login
    Then devo ver uma mensagem de erro indicando campos obrigatórios
    And devo permanecer na página de login

  @negative
  Scenario: Login com usuário vazio e senha preenchida
    When informo o usuário "" e a senha "password123"
    And clico no botão de login
    Then devo ver uma mensagem de erro
    And devo permanecer na página de login

  @negative
  Scenario: Login com usuário preenchido e senha vazia
    When informo o usuário "admin" e a senha ""
    And clico no botão de login
    Then devo ver uma mensagem de erro
    And devo permanecer na página de login

  @negative
  Scenario Outline: Login com múltiplas combinações de credenciais inválidas
    When informo o usuário "<usuario>" e a senha "<senha>"
    And clico no botão de login
    Then devo ver uma mensagem de erro
    And devo permanecer na página de login

    Examples:
      | usuario       | senha         |
      | admin         | senhaErrada   |
      | wrongUser     | password123   |
      | admin         | Password123   |
      | ADMIN         | password123   |
