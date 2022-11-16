#!/bin/bash

if echo $HEAD | grep "^\(warden\|leaderboard\|report\|team\)[-/]"
then
  exit 0
else
  exit 1
fi