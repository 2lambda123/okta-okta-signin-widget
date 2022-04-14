#!/bin/bash

source $OKTA_HOME/$REPO/scripts/setup.sh

export PATH="${PATH}:$(yarn global bin)"
export TEST_SUITE_TYPE="build"
export TEST_RESULT_FILE_DIR="${REPO}/test-reports/verify-package"
echo $TEST_SUITE_TYPE > $TEST_SUITE_TYPE_FILE
echo $TEST_RESULT_FILE_DIR > $TEST_RESULT_FILE_DIR_FILE

# Build
if ! yarn build:release; then
  echo "build failed! Exiting..."
  exit ${TEST_FAILURE}
fi

mkdir -p test-reports/verify-package

pushd dist
npm pack --dry-run --json > ../test-reports/verify-package/pack-report.json
popd

if ! node ./scripts/buildtools verify-package 2> ./test-reports/verify-package/error.log
then
  value=`cat ./test-reports/verify-package/error.log`
  log_custom_message "Verification Failed" "${value}"
  echo "verification failed! Exiting..."
  exit ${PUBLISH_TYPE_AND_RESULT_DIR_BUT_ALWAYS_FAIL}
fi

exit $SUCCESS
