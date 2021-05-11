#!/bin/bash
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

KIND=$1
shift

if [[ "$KIND" = "copy" ]]; then
  REPLACE_PLACEHOLDER="_CONTENT_RENAMED"
  cp -R $1 $1$REPLACE_PLACEHOLDER
  node $SCRIPT_DIR/index.js "$1$REPLACE_PLACEHOLDER" "$2"
  cd `dirName $1`
  NEW_FOLDER=`ls | grep $REPLACE_PLACEHOLDER`
  mv "${NEW_FOLDER}" "${NEW_FOLDER/$REPLACE_PLACEHOLDER/}"
elif [[ "$KIND" = "rename" ]]; then
  node $SCRIPT_DIR/index.js "$1" "$2"
else
  echo "Error: Invalid kind. Should be 'copy' or 'rename'"
fi