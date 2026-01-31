#!/bin/bash
# Quick script to create a new note

if [ -z "$1" ]; then
    echo "Usage: ./new-note.sh 'Note Title'"
    exit 1
fi

TITLE="$1"
FILENAME=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
DATE=$(date +%Y-%m-%d)

cat > "notes/${FILENAME}.md" << EOF
---
title: ${TITLE}
date: ${DATE}
category: Uncategorized
tags: []
---

# ${TITLE}

Your content here...
EOF

echo "Created: notes/${FILENAME}.md"
echo "Opening in editor..."

# Try to open in available editor
if command -v cursor &> /dev/null; then
    cursor "notes/${FILENAME}.md"
elif command -v code &> /dev/null; then
    code "notes/${FILENAME}.md"
elif command -v vim &> /dev/null; then
    vim "notes/${FILENAME}.md"
else
    open "notes/${FILENAME}.md"
fi
