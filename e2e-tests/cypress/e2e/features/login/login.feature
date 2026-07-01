# language: pt
@login
Funcionalidade: Tarefa 1 - Autenticação e Navegação
  Como usuário do e-commerce Swag Labs
  Quero me autenticar no sistema
  Para acessar a página de produtos

  Contexto:
    Dado que estou na página de login do e-commerce

  @positivo
  Cenário: Login válido e navegação para a loja
    Quando informo minhas credenciais válidas
    E clico no botão de login
    Então a navegação deve ser bem-sucedida para a página de produtos

  @negativo
  Esquema do Cenário: Tentativas de login inválidas
    Quando informo o usuário "<usuario>" e a senha "<senha>"
    E clico no botão de login
    Então devo ver a mensagem de erro "<mensagem_erro>"
    E devo permanecer na página de login

    Exemplos:
      | usuario         | senha          | mensagem_erro                                                             |
      | locked_out_user | secret_sauce   | Epic sadface: Sorry, this user has been locked out.                       |
      | standard_user   | senha_errada   | Epic sadface: Username and password do not match any user in this service |
      | usuario_falso   | secret_sauce   | Epic sadface: Username and password do not match any user in this service |
      |                 | secret_sauce   | Epic sadface: Username is required                                        |
      | standard_user   |                | Epic sadface: Password is required                                        |
