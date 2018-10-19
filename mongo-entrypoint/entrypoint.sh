#!/usr/bin/env bash
echo "Creating mongo users..."
mongo admin --host localhost -u admin -p admin123 --eval "db.createUser({user: 'admin', pwd: 'admin123', roles: [{role: 'readWrite', db: 'property-listing'}]}); db.createUser({user: 'admin', pwd: 'admin123', roles: [{role: 'userAdminAnyDatabase', db: 'admin'}]});"
echo "Mongo users created."