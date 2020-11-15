#!/bin/bash


pushd app
yarn build
popd

gitid="$(git rev-parse HEAD)"
var="-var gitid="$gitid

terraform fmt
terraform validate
terraform plan $var --out plan.out

terraform apply plan.out
