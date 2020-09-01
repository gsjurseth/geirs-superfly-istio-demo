#!/bin/bash

### Need a way to get the cookie
source updateCookie.sh

for a in *.json
do
  name=$(echo $a | sed -e s'/.json//')
  curl -H "Content-Type: application/json" -H "cookie: $COOKIE" -X POST  https://api.signalpattern.com/patterns/gsjurseth/$name -d @${a}
done
