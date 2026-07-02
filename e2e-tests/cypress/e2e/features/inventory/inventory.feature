# language: pt
@inventory
Funcionalidade: Tarefa 3 - Catálogo de Produtos e Navegação
  Como cliente autenticado
  Quero ordenar produtos, visualizar detalhes e gerenciar o carrinho
  Para tomar decisões de compra informadas

  Contexto:
    Dado que estou autenticado no sistema com perfil padrao
    E estou na página de produtos

  @positivo
  Esquema do Cenário: Ordenação de produtos no catálogo
    Quando ordeno os produtos por "<criterio>"
    Então os produtos devem estar ordenados por "<criterio>"

    Exemplos:
      | criterio            |
      | preco_menor_maior    |
      | preco_maior_menor    |
      | nome_z_a             |

  @positivo
  Cenário: Visualizar detalhes de um produto e retornar ao catálogo
    Quando acesso os detalhes do produto "Sauce Labs Backpack"
    Então devo visualizar a página de detalhes do produto
    Quando volto para a lista de produtos
    Então a navegação deve ser bem-sucedida para a página de produtos

  @positivo
  Cenário: Remover produto do carrinho após adicionar
    Quando adiciono o produto "Mochila" ao carrinho
    Então o contador do carrinho deve exibir "1"
    Quando removo o produto de slug "sauce-labs-backpack" do carrinho
    Então o carrinho deve estar vazio

  @positivo
  Cenário: Adicionar múltiplos produtos e validar contagem do carrinho
    Quando adiciono o produto "Mochila" ao carrinho
    E adiciono o produto de slug "sauce-labs-bike-light" ao carrinho
    Então o contador do carrinho deve exibir "2"

  @positivo
  Cenário: Logout do sistema a partir do catálogo
    Quando realizo logout do sistema
    Então devo permanecer na página de login
