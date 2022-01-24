#!/bin/bash

if [[echo $BRANCH | grep "^warden-"]]
then
  exit 0
else
  exit 1
fi