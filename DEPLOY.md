# 🚀 Deploy Your Digital Garden to GitHub Pages

## Quick Setup (5 minutes)

### 1. Create GitHub Repository

```bash
cd "/Users/rohanbhattarai/Desktop/Digital Garden"

# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: Digital Garden"

# Create repo on GitHub and connect
# Go to github.com/new and create a repo called "digital-garden"
# Then run:
git branch -M main
git remote add origin https://github.com/RohanBhattaraiNP/digital-garden.git
git push -u origin main
```

### 2. Enable GitHub Pages

1. Go to your repo: `https://github.com/RohanBhattaraiNP/digital-garden`
2. Click **Settings** → **Pages**
3. Under "Source", select **main** branch and **/ (root)** folder
4. Click **Save**
5. Your site will be live at: `https://rohanbhattarainp.github.io/digital-garden/`

**That's it! ✨**

---

## 📝 Daily Workflow - Adding New Notes

### Option 1: GitHub Web Interface (Easiest)

1. Go to `https://github.com/RohanBhattaraiNP/digital-garden/tree/main/notes`
2. Click **Add file** → **Create new file**
3. Name it: `my-new-note.md`
4. Write your content:
```markdown
---
title: My Note Title
date: 2025-12-08
category: Machine Learning
tags: [ml, cool-stuff]
---

# My Note

Content here with [[links-to-other-notes]]
```
5. Click **Commit changes**
6. **Done!** GitHub Action auto-updates `index.json` in ~30 seconds
7. Refresh your site - new note appears!

### Option 2: Local + Git Push (Fastest for bulk edits)

```bash
cd "/Users/rohanbhattarai/Desktop/Digital Garden"

# Create new note
cat > notes/my-new-idea.md << 'EOF'
---
title: My New Idea
date: 2025-12-08
category: Physics
tags: [physics, research]
---

# My New Idea

Write your thoughts here...
EOF

# Push to GitHub
git add notes/my-new-idea.md
git commit -m "Add new note: My New Idea"
git push

# GitHub Action auto-updates index.json
# Site updates automatically in ~1 minute!
```

### Option 3: Use Any Text Editor

1. Open `notes/` folder in VS Code, Cursor, or any editor
2. Create new `.md` file
3. Write your note
4. Save and run:
```bash
git add .
git commit -m "Update notes"
git push
```

---

## 🎯 Super Fast Aliases (Optional)

Add to your `~/.zshrc`:

```bash
alias garden='cd "/Users/rohanbhattarai/Desktop/Digital Garden"'

# Create new note quickly
gnote() {
  cd "/Users/rohanbhattarai/Desktop/Digital Garden/notes"
  cat > "$1.md" << EOF
---
title: $1
date: $(date +%Y-%m-%d)
category: Uncategorized
tags: []
---

# $1

EOF
  cursor "$1.md"  # or 'code' or 'vim'
}

# Push changes
gpush() {
  cd "/Users/rohanbhattarai/Desktop/Digital Garden"
  git add .
  git commit -m "${1:-Update notes}"
  git push
}
```

**Usage:**
```bash
gnote "My Cool Idea"  # Creates and opens note
# ... write your content ...
gpush "Add cool idea"  # Push to GitHub
```

---

## 🔄 How Auto-Update Works

1. You create/edit a `.md` file in `notes/`
2. Push to GitHub
3. GitHub Action detects the change
4. Automatically regenerates `notes/index.json`
5. Commits and pushes the update
6. GitHub Pages rebuilds site (~1 min)
7. Your note appears! ✨

**No manual index.json editing needed!**

---

## 🎨 Customization

### Change Colors
Edit `app.js` line ~230:
```javascript
.range(d3.schemeTableau10);  // Try: schemePaired, schemeSet3
```

### Adjust Graph Physics
Edit `app.js` lines ~250-280 - see inline comments for parameters

### Modify Layout
- `style.css` - All styling
- `index.html` - Structure

---

## 📱 Mobile Friendly

The site works great on mobile! The graph is touch-enabled:
- Pinch to zoom
- Drag to pan
- Tap nodes to open notes

---

## 🚨 Troubleshooting

### Site not updating?
```bash
# Clear GitHub Pages cache
git commit --allow-empty -m "Trigger rebuild"
git push
```

### GitHub Action failing?
Check: `https://github.com/RohanBhattaraiNP/digital-garden/actions`

### Index.json out of sync?
```bash
cd notes
ls *.md | jq -R -s -c 'split("\n")[:-1]' > index.json
git add index.json
git commit -m "Fix index"
git push
```

---

## 🎉 You're Done!

**Your workflow now:**
1. Write note in `notes/`
2. `git push`
3. Wait 1 minute
4. See it live on GitHub Pages!

**No server, no hosting costs, no maintenance!** 🚀
