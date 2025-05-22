para probar conexion a este componente de forma local, haz la petición:

GET https://localhost:3004/api/school-system/info

DOCKER:
Para dockerizar el componente:

docker compose build
docker compose up

para bajarlo:

docker compose down

Para mapear la base de datos:

docker compose exec app npx knex migrate:latest

Para deshacer el mapeado:

docker compose exec app npx knex migrate:rollback

Para insertar datos de prueba:

docker compose exec app npm run test:data

para consultar la base de datos, abre una terminal y ejecuta el siguiente comando:
docker compose exec db mysql -u appusr -papppass school_system

A partir de ahí podrás hacer consultas de mysql, por ejemplo:

-- Ver tablas disponibles
SHOW TABLES;

-- Consultar una tabla específica
SELECT * FROM tu_tabla LIMIT 10;

-- Salir
EXIT;