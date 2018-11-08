#!/bin/bash

git status
git remote add deploy $remote
git push deploy HEAD:master