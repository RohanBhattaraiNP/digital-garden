# 🌱 Rohan Bhattarai's Digital Garden

A beautiful, interactive knowledge graph for organizing thoughts, research, and learnings.

**Live Site:** https://rohanbhattarainp.github.io/digital-garden/

## ✨ Features

- 🎨 **Interactive Network Graph** - D3.js force-directed visualization
- 🔗 **Internal Linking** - Connect notes with `[[note-name]]` syntax
- 📐 **LaTeX Support** - Full mathematical equation rendering with KaTeX
- 💻 **Syntax Highlighting** - Beautiful code blocks with copy buttons
- 🔍 **Search** - Filter notes instantly
- 🎯 **Smart Physics** - Nodes sized by connections, auto-organized by category
- 📱 **Responsive** - Works on desktop, tablet, and mobile
- 🚀 **Zero Build** - Pure HTML/CSS/JS, no compilation needed

## 🚀 Quick Start

See [DEPLOY.md](DEPLOY.md) for complete deployment instructions.

### Adding a Note

Create `notes/my-note.md`:

```markdown
---
title: My Note Title
date: 2025-12-08
category: Machine Learning
tags: [ml, deep-learning]
---

# My Note

Write your content here with **markdown** and $\LaTeX$ math:

$$E = mc^2$$

Link to other notes: [[quantum-mechanics]]

\`\`\`python
# Code with syntax highlighting
def hello():
    print("Hello, world!")
\`\`\`
```

Push to GitHub - that's it! The site auto-updates.

## 📁 Project Structure

```
digital-garden/
├── index.html          # Main app
├── app.js              # Graph logic & note loading
├── style.css           # All styling
├── notes/              # Your markdown notes
│   ├── index.json      # Auto-generated file list
│   └── *.md            # Individual notes
├── .github/
│   └── workflows/
│       └── update-index.yml  # Auto-updates index.json
└── DEPLOY.md           # Deployment guide
```

## 🎨 Categories

Notes are color-coded by category:
- 🟠 Interesting Stuff - YouTube videos, articles, documentaries
- 🟢 Machine Learning - ML, deep learning, AI
- 🔵 Physics - Quantum mechanics, particle physics
- (Add your own categories!)

## 🛠️ Tech Stack

- **D3.js** - Interactive graph visualization
- **KaTeX** - LaTeX math rendering
- **Marked.js** - Markdown parsing
- **Highlight.js** - Code syntax highlighting
- **GitHub Pages** - Free hosting
- **GitHub Actions** - Auto-deployment

## 📝 Writing Tips

1. **Use descriptive titles** - Shows on hover
2. **Link liberally** - Use `[[other-note]]` to connect ideas
3. **Tag properly** - Helps with future search/filtering
4. **Include code & math** - Fully supported!
5. **Date your notes** - Tracks your learning journey

## 🔧 Customization

### Change Graph Colors
Edit `app.js` line ~230:
```javascript
.range(d3.schemeTableau10);
```

### Adjust Physics
Edit `app.js` lines ~250-280:
- `distance` - Space between nodes
- `strength` - Link/repulsion force
- `collision` - Node collision radius

### Modify Styling
Edit `style.css` - Everything is clearly commented!

## 🤝 Contributing

This is a personal digital garden, but feel free to:
- Fork it for your own use
- Open issues for bugs
- Submit PRs for improvements

## 📄 License

MIT License - Use freely!

## 🙏 Acknowledgments

Inspired by:
- org-roam and Obsidian
- Andy Matuschak's notes
- Maggie Appleton's digital garden

Built with love at Caltech 🎓

---

**Happy gardening!** 🌱✨
