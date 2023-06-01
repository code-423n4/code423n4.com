#!/bin/bash

if echo $HEAD | grep "^\(warden\|leaderboard\|team\|bot\)[-/]"
then
  exit 0
else
  exit 1
fi