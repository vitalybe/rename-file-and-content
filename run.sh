#!/bin/bash
REPLACE_PLACEHOLDER="_CONTENT_RENAMED"
cp -R $1 $1$REPLACE_PLACEHOLDER
node /Users/vitalyb/git/file-and-content-rename/index.js "$1$REPLACE_PLACEHOLDER" "$2"
cd `dirName $1`
NEW_FOLDER=`ls | grep $REPLACE_PLACEHOLDER`
mv "${NEW_FOLDER}" "${NEW_FOLDER/$REPLACE_PLACEHOLDER/}"