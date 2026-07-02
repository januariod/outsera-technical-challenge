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
  Cenário: Compra completa com validação de carrinho e resumo
    Quando adiciono o produto "Mochila" ao carrinho
    Então o contador do carrinho deve exibir "1"
    Quando acesso o carrinho de compras
    Então o carrinho deve conter o item "Sauce Labs Backpack" com preço "$29.99" e quantidade "1"
    Quando sigo para o checkout
    E preencho os dados de entrega com Nome "Daniel", Sobrenome "QA" e CEP "12345-678"
    Então o resumo da compra deve exibir subtotal "Item total: $29.99", imposto "Tax: $2.40" e total "Total: $32.39"
    Quando confirmo o resumo da compra
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

  @positivo
  Cenário: Cancelar o checkout e retornar ao carrinho
    Quando adiciono o produto "Mochila" ao carrinho
    E acesso o carrinho de compras
    E sigo para o checkout
    E cancelo o checkout
    Então devo retornar para a página do carrinho de compras
