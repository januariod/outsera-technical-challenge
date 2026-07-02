# Análise de Teste de Carga (K6)

## 1. Escopo e Cenário Executado

O teste de carga foi desenhado para avaliar a resiliência da API pública `Restful Booker` sob estresse moderado a alto.

- **Endpoint Alvo:** `GET /booking` (Listagem de reservas).
- **Carga Simulada:** 500 Virtual Users (VUs) simultâneos.
- **Duração da Carga Constante:** 5 minutos (com ramp-up e ramp-down de 30 segundos).

## 2. Thresholds (Critérios de Aceite)

Para garantir a qualidade, definimos os seguintes SLAs (Service Level Agreements) de performance:

- **P95 Response Time:** < 2000ms (95% das requisições devem retornar em menos de 2 segundos).
- **Error Rate:** < 5% (Taxa máxima de falhas tolerada).

## 3. Análise de Resultados e Gargalos

Durante a execução do teste, observamos o seguinte comportamento na API pública (Heroku):

- **Desempenho Inicial:** Durante o *ramp-up* (0 a ~250 VUs), a API respondeu dentro da normalidade, mantendo os tempos de resposta baixos.
- **Identificação do Gargalo:** Ao nos aproximarmos da marca de **500 VUs simultâneos**, a aplicação começou a apresentar degradação severa de performance. O tempo de resposta (P95) ultrapassou a marca dos 2000ms.
- **Falhas de Requisição:** Observou-se o aumento de erros HTTP (Timeouts/503 Service Unavailable), indicando que o servidor de aplicação no Heroku esgotou suas conexões concorrentes no banco de dados ou atingiu o limite de processamento de sua *dyno*.

## 4. Conclusão e Recomendações

A API atual **não suporta de forma saudável** o tráfego sustentado de 500 usuários simultâneos buscando a lista completa de reservas. 
**Recomendações Arquiteturais:**

1. **Cache Layer:** Implementar um Redis na frente do endpoint `GET /booking` para evitar bater no banco de dados a cada requisição de listagem.
2. **Paginação:** Forçar paginação no endpoint (ex: `?limit=50&page=1`) para reduzir o payload do JSON trafegado.
3. **Auto-Scaling:** Ajustar as regras de escalabilidade horizontal do servidor para subir novas instâncias quando a CPU passar de 70%.
