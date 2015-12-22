#! /bin/bash
echo 'Criando base de dados';
mongoimport --jsonArray --db node-api-jwt --collection users --drop --file users.json
mongoimport --jsonArray --db node-api-jwt --collection news --drop --file news.json
echo 'Finalizado!'
