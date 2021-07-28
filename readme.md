#API GRAPHQL + APOLLO SERVER
API criada com base no curso: 
GraphQL: Criando APIs Profissionais e Flexíveis da COD3R

Estou utilizando 3 imagens no dockerfile:

- backend_dockernode: Cria um ambiente node
- postgres: Cria um ambiente para uso do banco de dados postgress
- pgadmin4: SGBD para visualizar o banco via interface gráfica.

Algumas variáveis de ambiente ficaram expostas no docker-compose.

Necessário criar um arquivo .env ver arquivo .env.example para setar as variáveis necessárias.

para subir o container usar o comando:
<code>docker-compose up</code>