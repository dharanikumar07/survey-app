#!/bin/bash
echo "Starting keepalive script..."
while true; do
  echo "Sending keepalive request to Shopify..."
  curl -s -w "HTTP Status: %{http_code}, Response Time: %{time_total}s\n" https://admin.shopify.com/store/devstoresdr/apps/devstore-discount > /dev/null
  echo "Request completed. Sleeping for 60 seconds..."
  sleep 60
done
