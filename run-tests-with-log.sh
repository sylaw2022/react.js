#!/bin/bash
# Script to run tests and capture clean output without special characters

cd "$(dirname "$0")"

LOG_FILE="test-output.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

echo "=========================================" | tee -a "$LOG_FILE"
echo "Test Run Started: $TIMESTAMP" | tee -a "$LOG_FILE"
echo "=========================================" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# Run tests and capture output, removing ANSI color codes
npm run test:frontend 2>&1 | sed 's/\x1b\[[0-9;]*m//g' | tee -a "$LOG_FILE"

EXIT_CODE=${PIPESTATUS[0]}

echo "" | tee -a "$LOG_FILE"
echo "=========================================" | tee -a "$LOG_FILE"
echo "Test completed with exit code: $EXIT_CODE" | tee -a "$LOG_FILE"
echo "Output saved to: $LOG_FILE" | tee -a "$LOG_FILE"
echo "=========================================" | tee -a "$LOG_FILE"

exit $EXIT_CODE



