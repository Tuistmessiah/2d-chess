
export PGPASSWORD='postgres123'

echo " ---> Reseting DB:"

echo "Dropping old DB..."
dropdb -U postgres chess

echo "Creating new DB..."
createdb -U postgres chess

echo "Creating tables..."
psql -U postgres chess < ./sql/game.sql
