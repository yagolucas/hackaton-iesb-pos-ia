# hackaton-iesb-pos-ia
Projeto desenvolvido para a pós graduação de Inteligência Artifícial do IESB

# Para rodar a aplicação, será necessário as seguintes ferramentas:
* Node js
* Mongo DB ou Docker

## Antes de tudo, connect a uma base mongo db. 

### Para conectar a base de dados do mongo, crie um arquivo .env na raiz do dirétorio e adicione as seguintes linhas:
* MONGODB_USER=<usuário_do_mongo>
* MONGODB_PASSWD=<senha_do_usuario>   

## Mova os arquivos da pasta _dataset_ para a raiz do diretório do projeto e execute os comandos:

```bash
npm i
npm run organize-files
npm run create-collections
npm run insert-into-running
```
