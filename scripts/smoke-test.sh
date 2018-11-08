#!/bin/bash

HTTP_CODE=`curl -siL -o /dev/null -w '%{http_code}' https://scurker.com`

if [[ $HTTP_CODE != $200 ]]; then
  echo "FAIL: status code $HTTP_CODE"
  exit 1
fi