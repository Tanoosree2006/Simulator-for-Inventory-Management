#!/bin/bash

ENDPOINT=$1

if [ -z "$ENDPOINT" ]; then
  echo "Usage: ./concurrent-test.sh pessimistic|optimistic"
  exit 1
fi

URL="http://localhost:8080/api/orders/$ENDPOINT"

echo "Running concurrent test on $ENDPOINT..."

for i in {1..20}
do
curl -X POST "$URL" \
-H "Content-Type: application/json" \
-d "{\"productId\":1,\"quantity\":10,\"userId\":\"user$i\"}" &
done

wait
echo "Concurrent test completed"