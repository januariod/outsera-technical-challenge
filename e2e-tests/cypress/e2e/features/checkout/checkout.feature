# language: pt
@checkout
Funcionalidade: Tarefa 2 - Fluxo de Checkout de E-commerce
  Como cliente autenticado
  Quero adicionar produtos ao carrinho e preencher meus dados
  Para finalizar minha compra

  Contexto:
    Dado que estou autenticado no sistema com perfil padrao
    E estou na página de produtos

  @positivo
  Cenário: Compra completa com dados válidos
    Quando adiciono o produto "Mochila" ao carrinho
    E acesso o carrinho de compras
    E sigo para o checkout
    E preencho os dados de entrega com Nome "Daniel", Sobrenome "QA" e CEP "12345-678"
    E confirmo o resumo da compra
    Então devo ver a tela de sucesso com a mensagem "Thank you for your order!"

  @negativo
  Esquema do Cenário: Validação de endereço de entrega incompleto no checkout
    Quando adiciono o produto "Mochila" ao carrinho
    E acesso o carrinho de compras
    E sigo para o checkout
    E preencho os dados de entrega com Nome "<nome>", Sobrenome "<sobrenome>" e CEP "<cep>"
    Então devo ver a mensagem de erro no checkout indicando "<mensagem_erro>"

    Exemplos:
      | nome   | sobrenome | cep       | mensagem_erro                  |
      |        | QA        | 12345-678 | Error: First Name is required  |
      | Daniel |           | 12345-678 | Error: Last Name is required   |
      | Daniel | QA        |           | Error: Postal Code is required |
