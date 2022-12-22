#!/bin/bash -x

if [ -n "${TEST_SUITE_ID}" ]; then
  ORIGINAL_PATH=$PATH
  source $OKTA_HOME/$REPO/scripts/setup.sh
  export PATH="${PATH}:$(yarn global bin)"
  export TEST_SUITE_TYPE="build"
  export TEST_RESULT_FILE_DIR="${REPO}/test-reports/verify-package"
  echo $TEST_SUITE_TYPE > $TEST_SUITE_TYPE_FILE
  echo $TEST_RESULT_FILE_DIR > $TEST_RESULT_FILE_DIR_FILE
fi

set -e

# Build
if ! yarn build:release; then
  echo "build failed! Exiting..."
  exit ${TEST_FAILURE}
fi

if ! yarn lint:cdn; then
  echo "lint failed! Exiting..."
  exit ${TEST_FAILURE}
fi

mkdir -p "test-reports/verify-package"

pushd dist
npm pack --dry-run --json > ../test-reports/verify-package/pack-report.json
popd

if ! node ./scripts/buildtools verify-package 2> ./test-reports/verify-package/error.log
then
  value=`cat ./test-reports/verify-package/error.log`
  log_custom_message "Verification Failed" "${value}"
  echo "verification failed! Exiting..."
  exit ${TEST_FAILURE}
fi

# Validate the dist package dependencies

# Move node_modules out of the way so that we devDependencies don't cause false positives
mv node_modules node_modules2

# Set a trap to restore node_modules when script exits
ORIGINAL_PWD="${PWD}"
trap 'restore_node_modules' EXIT
restore_node_modules() {
  echo "Restoring node_modules"
  cd "${ORIGINAL_PWD}"
  mv node_modules2 node_modules
}

if [ -n "${TEST_SUITE_ID}" ]; then
  set +e
  # Verify minimum supported version of node
  export PATH=$ORIGINAL_PATH
  setup_service node v14.18.0
  npm config set registry=https://registry.npmjs.org/

  # Verify minimum supported version of yarn.
  # Use the cacert bundled with centos as okta root CA is self-signed and cause issues downloading from yarn
  setup_service yarn 1.7.0 /etc/pki/tls/certs/ca-bundle.crt
  yarn config set registry https://registry.yarnpkg.com
  export PATH="${PATH}:$(yarn global bin)"
  set -e
fi

pushd test/package/tsc
if ! (yarn clean && yarn install && yarn test); then
  echo "TSC package verification failed! Exiting..."
  exit ${TEST_FAILURE}
fi
popd

pushd test/package/cjs
if ! (yarn clean && yarn install && yarn test); then
  echo "CommonJS bundle verification failed! Exiting..."
  exit ${TEST_FAILURE}
fi
popd

pushd test/package/esm
if ! (yarn clean && yarn install && yarn test); then
  echo "ESM bundle verification failed! Exiting..."
  exit ${TEST_FAILURE}
fi
popd
