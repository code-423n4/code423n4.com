#!/bin/bash

if echo $HEAD | grep "^\(warden\|leaderboard\|team\)[-/]"
then
  exit 0
else
  exit 1
fi