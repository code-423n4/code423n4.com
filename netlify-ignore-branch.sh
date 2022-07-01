#!/bin/bash

if echo $HEAD | grep "^\(warden\|leaderboard\|report\)[-/]"
then
  exit 0
else
  exit 1
fi