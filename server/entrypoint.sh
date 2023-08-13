#!/bin/bash -eux

go mod download

air -c .air.toml
