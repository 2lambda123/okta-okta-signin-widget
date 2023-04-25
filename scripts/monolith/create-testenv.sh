#!/bin/bash -xe

# Warning! This script will overwrite your "testenv" file.
# Run bootstrap script to create apps/users needed for E2E tests
# Write environment variables to testenv file

# Get API token, if necessary
# if [[ -z "${OKTA_CLIENT_TOKEN}" ]]; then
#   source ./scripts/monolith/get-token.sh
# fi
dockolith get-token
echo $OKTA_CLIENT_TOKEN

# Creates a test org and outputs environment variables to a file named "testenv.local" in the project root
# yarn -s --cwd test/e2e ts-node ./support/monolith/create-testenv.ts
dockolith exec --cwd test/e2e ./support/monolith/create-testenv.ts
cat testenv.local >> testenv
echo "LOCAL_MONOLITH=1" >> testenv
echo "updated testenv"
