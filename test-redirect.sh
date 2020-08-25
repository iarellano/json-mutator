#!/usr/bin/env bash

read -r -d '' var << EOM
Helo world
how are you this days
EOM

echo -------
echo $var
echo -------
echo "$var"
echo -------
while read line
do
 echo $line
done < <(echo "${var}")