#!/bin/sh

baseurl=http://localhost:8080/api
tenant=
appId=
appKey=

curl -v -X GET \
 -H "X-Application-Id: $appId" \
 -H "X-Application-Key: $appKey" \
 $baseurl/1/$tenant/api/hello/sayHello \
