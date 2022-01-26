#!/bin/bash

if echo $HEAD | grep "^warden-"
then
  exit 0
else
  exit 1
fi