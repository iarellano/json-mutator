#!/usr/bin/env bash

fixture=$1
type=${2:-object}

if [ ! -f "test/fixtures/${fixture}.specification.js" ]; then

if [[ "$type" == "object" ]]; then
cat <<EOT >> "test/fixtures/${fixture}.source.json"
{
}
EOT

cat <<EOT >> "test/fixtures/${fixture}.expected.json"
{
}
EOT

else
cat <<EOT >> "test/fixtures/${fixture}.source.json"
[
]
EOT

cat <<EOT >> "test/fixtures/${fixture}.expected.json"
[
]
EOT
fi

cat <<EOT >> "test/fixtures/${fixture}.specification.js"
'use strict';

var spec = {
    desc: "",
    type: "$type",
}

exports.spec = spec;
EOT

#git add "test/fixtures/${fixture}.source.json"
#git add "test/fixtures/${fixture}.expected.json"
#git add "test/fixtures/${fixture}.specification.js"

else
    echo "Fixture already exists"
fi