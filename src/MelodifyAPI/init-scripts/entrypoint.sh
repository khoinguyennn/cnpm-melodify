#!/bin/bash

# Start SQL Server in background
/opt/mssql/bin/sqlservr &

# Wait until SQL Server is ready by checking port 1433
echo "⏳ Waiting for SQL Server to be ready on port 1433..."
until nc -z localhost 1433; do
  echo "⏳ SQL Server not ready yet... retrying in 5s"
  sleep 5
done

echo "✅ SQL Server is ready!"

# Run your init script if needed
# Uncomment the line below if you have a script and sqlcmd installed:
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -i /init/melodify-init.sql

# Keep container alive
wait
