# comandos mongo shell

## Iniciar aplicação MongoDB por linha de comando
mongo

## Entrar em uma base
use <database>

## Listar coleções
show collections

## listar conteúdo de uma coleção de documentos
db.<coleção>.find()

## Importar documentos para a base a partir de um arquivo json
mongoimport --jsonArray --db <schema> --collection <coleção> --drop --file <arquivo>.json

## Drop database
use <database>
db.runCommand( { dropDatabase: 1 } )

## Informações da conexão
db.serverCmdLineOpts()

## Script para importação de documentos deste projeto
mongoimport --jsonArray --db node-api-jwt --collection users --drop --file users.json
mongoimport --jsonArray --db node-api-jwt --collection news --drop --file news.json
