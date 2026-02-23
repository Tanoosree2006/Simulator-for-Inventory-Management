#!/bin/bash

echo "Monitoring PostgreSQL Locks..."
echo "Press CTRL+C to stop."

while true
do
  docker exec -it $(docker ps -qf "ancestor=postgres:15") \
  psql -U user -d inventory_db \
  -c "SELECT relation::regclass AS table,
             locktype,
             mode,
             granted
      FROM pg_locks
      JOIN pg_class ON pg_locks.relation = pg_class.oid
      WHERE relname = 'products';"

  sleep 2
done