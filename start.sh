#!/bin/bash

export ENVIRONMENT="PRODUCTION"
export PORT=${PORT:-5000}
export HOSTNAME="0.0.0.0"

node server.js

exec "$@"
