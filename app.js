// Detect if running on GitHub Pages or locally
const BASE_PATH = window.location.hostname.includes('github.io') 
    ? '/digital-garden/' 
    : '/';

// State
let notes = [];
let currentView = 'home';
let openPanels = [];
let currentPanelIndex = 0;
let homeSearchTerm = '';
let sidebarSearchTerm = '';
let graphData = { nodes: [], links: [] };
let simulation = null;

// Initialize
async function init() {
    // Configure marked with footnote support
    marked.use({
        gfm: true,
        breaks: true
    });

    // Add footnote extension if available
    if (typeof markedFootnote !== 'undefined') {
        marked.use(markedFootnote());
    }

    await loadNotes();
    buildGraphData();
    showHome();
}

// Load notes
async function loadNotes() {
    try {
        const response = await fetch(`${BASE_PATH}notes/index.json`);
        const fileList = await response.json();
        
        const notePromises = fileList.map(async filename => {
            const res = await fetch(`${BASE_PATH}notes/${filename}`);
            const content = await res.text();
            return parseNote(content, filename);
        });

        notes = await Promise.all(notePromises);
        notes.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
        console.error('Error loading notes:', error);
        notes = [];
    }
}

// Parse markdown note
function parseNote(content, filename) {
    const lines = content.split('\n');
    let frontmatter = {};
    let body = content;

    if (lines[0].trim() === '---') {
        const endIndex = lines.findIndex((line, i) => i > 0 && line.trim() === '---');
        if (endIndex > 0) {
            try {
                frontmatter = jsyaml.load(lines.slice(1, endIndex).join('\n'));
            } catch (e) {
                console.error('Error parsing frontmatter:', e);
            }
            body = lines.slice(endIndex + 1).join('\n');
        }
    }

    return {
        id: filename.replace('.md', ''),
        filename,
        title: frontmatter.title || 'Untitled',
        date: frontmatter.date || new Date().toISOString().split('T')[0],
        category: frontmatter.category || 'Uncategorized',
        tags: frontmatter.tags || [],
        body: body.trim()
    };
}

// Build graph data from notes
function buildGraphData() {
    const nodes = notes.map(note => ({
        id: note.id,
        title: note.title,
        category: note.category,
        date: note.date
    }));

    const links = [];
    const noteIds = new Set(notes.map(n => n.id));

    // Find all internal links [[note-id]]
    notes.forEach(note => {
        const linkRegex = /\[\[([^\]]+)\]\]/g;
        let match;

        while ((match = linkRegex.exec(note.body)) !== null) {
            const targetId = match[1].trim();
            // Only add link if target note exists
            if (noteIds.has(targetId) && targetId !== note.id) {
                links.push({
                    source: note.id,
                    target: targetId
                });
            }
        }
    });

    graphData = { nodes, links };
}

// Show home page
function showHome() {
    currentView = 'home';
    openPanels = [];
    currentPanelIndex = 0;
    homeSearchTerm = '';
    sidebarSearchTerm = '';

    document.getElementById('sidebar').classList.add('hidden');
    document.getElementById('navControls').classList.add('hidden');

    const contentArea = document.getElementById('contentArea');
    contentArea.style.transform = 'translateX(0)';
    contentArea.innerHTML = `
        <div class="panel">
            <div class="home-page">
                <div class="home-header">
                    <h1>Rohan Bhattarai</h1>
                    <p>Digital Garden 🌱</p>
                </div>
                
                <div class="network-graph-container">
                    <div class="graph-controls">
                        <button class="graph-btn" onclick="resetGraphZoom()">Reset View</button>
                        <button class="graph-btn" onclick="restartSimulation()">Re-layout</button>
                    </div>
                    <svg id="networkGraph"></svg>
                </div>
                
                <div class="home-search">
                    <input type="text" id="homeSearch" placeholder="Search notes...">
                    <button class="clear-btn" id="clearBtn" onclick="clearHomeSearch()">Clear</button>
                </div>
                
                <div class="notes-list" id="notesList"></div>
            </div>
        </div>
    `;

    renderHomeNotes();
    setupHomeSearch();
    renderNetworkGraph();
}

// Render home notes
function renderHomeNotes() {
    const notesList = document.getElementById('notesList');
    if (!notesList) return;

    let filteredNotes = notes;
    if (homeSearchTerm) {
        filteredNotes = notes.filter(note =>
            note.title.toLowerCase().includes(homeSearchTerm) ||
            note.body.toLowerCase().includes(homeSearchTerm) ||
            note.category.toLowerCase().includes(homeSearchTerm) ||
            note.tags.some(tag => tag.toLowerCase().includes(homeSearchTerm))
        );
    }

    if (filteredNotes.length === 0) {
        notesList.innerHTML = '<div class="no-results">No notes found</div>';
        return;
    }

    notesList.innerHTML = filteredNotes.map(note => `
        <div class="note-card" onclick="openNote('${note.id}')">
            <div class="note-card-date">${note.date}</div>
            <div class="note-card-title">${note.title}</div>
        </div>
    `).join('');
}

// Setup home search
function setupHomeSearch() {
    const searchInput = document.getElementById('homeSearch');
    const clearBtn = document.getElementById('clearBtn');

    if (!searchInput || !clearBtn) return;

    searchInput.value = homeSearchTerm;
    if (homeSearchTerm) {
        clearBtn.classList.add('visible');
    } else {
        clearBtn.classList.remove('visible');
    }

    searchInput.addEventListener('input', (e) => {
        homeSearchTerm = e.target.value.toLowerCase();
        renderHomeNotes();

        if (homeSearchTerm) {
            clearBtn.classList.add('visible');
        } else {
            clearBtn.classList.remove('visible');
        }
    });
}

// Clear home search
function clearHomeSearch() {
    homeSearchTerm = '';
    const searchInput = document.getElementById('homeSearch');
    const clearBtn = document.getElementById('clearBtn');
    if (searchInput) searchInput.value = '';
    if (clearBtn) clearBtn.classList.remove('visible');
    renderHomeNotes();
}

// Render network graph
function renderNetworkGraph() {
    const container = document.querySelector('.network-graph-container');
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const svg = d3.select('#networkGraph')
        .attr('width', width)
        .attr('height', height);

    svg.selectAll('*').remove();

    // Create zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([0.1, 4])
        .on('zoom', (event) => {
            g.attr('transform', event.transform);
        });

    svg.call(zoom);

    const g = svg.append('g');

    // Color scale by category
    const categories = [...new Set(graphData.nodes.map(n => n.category))];
    const colorScale = d3.scaleOrdinal()
        .domain(categories)
        .range(d3.schemeTableau10);

    // Calculate node degrees (number of connections)
    const nodeDegrees = {};
    graphData.nodes.forEach(n => nodeDegrees[n.id] = 0);
    graphData.links.forEach(l => {
        nodeDegrees[l.source.id || l.source]++;
        nodeDegrees[l.target.id || l.target]++;
    });

    // Assign angles to categories for radial separation
    const categoryAngles = {};
    categories.forEach((cat, i) => {
        categoryAngles[cat] = (i / categories.length) * 2 * Math.PI;
    });

    // Create force simulation with radial layout
    simulation = d3.forceSimulation(graphData.nodes)
        .force('link', d3.forceLink(graphData.links)
            .id(d => d.id)
            .distance(d => {
                const deg1 = nodeDegrees[d.source.id || d.source];
                const deg2 = nodeDegrees[d.target.id || d.target];
                // Highly connected nodes closer together
                return 60 + (1 / (deg1 + deg2 + 1)) * 40;
            })
            .strength(0.6))
        .force('charge', d3.forceManyBody()
            .strength(d => {
                const degree = nodeDegrees[d.id];
                // Highly connected nodes have stronger repulsion
                return -300 - (degree * 30);
            }))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide()
            .radius(d => {
                const degree = nodeDegrees[d.id];
                return Math.sqrt(degree) * 8 + 15;
            }))
        .force('radial', d3.forceRadial(
            d => {
                const degree = nodeDegrees[d.id];
                // More connected = closer to center
                return 80 + (1 / (degree + 1)) * 100;
            },
            width / 2,
            height / 2
        ).strength(0.5))
        .force('angular', (alpha) => {
            // Push nodes towards their category's angular sector
            graphData.nodes.forEach(node => {
                if (node.category === 'Core') return;
                const angle = categoryAngles[node.category];
                const centerX = width / 2;
                const centerY = height / 2;
                const dx = node.x - centerX;
                const dy = node.y - centerY;
                const currentAngle = Math.atan2(dy, dx);

                let angleDiff = angle - currentAngle;
                // Normalize angle difference to [-π, π]
                while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
                while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

                const force = angleDiff * alpha * 0.3;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance > 0) {
                    node.vx += -dy / distance * force;
                    node.vy += dx / distance * force;
                }
            });
        })
        .alphaDecay(0.015)
        .velocityDecay(0.4);

    // Draw links
    const link = g.append('g')
        .selectAll('line')
        .data(graphData.links)
        .join('line')
        .attr('class', 'link');

    // Draw nodes
    const node = g.append('g')
        .selectAll('g')
        .data(graphData.nodes)
        .join('g')
        .attr('class', 'node')
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));

    node.append('circle')
        .attr('r', d => {
            const degree = nodeDegrees[d.id];
            // Size based on connections: 4-12px
            return Math.max(4, Math.min(12, 3 + degree * 1.2));
        })
        .attr('fill', d => colorScale(d.category))
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .style('filter', 'drop-shadow(0px 1px 2px rgba(0,0,0,0.3))');

    node.append('text')
        .attr('class', 'node-label')
        .attr('dy', -12)
        .style('font-size', '10px')
        .style('font-weight', '600')
        .style('opacity', 0)
        .text(d => d.title);

    // Hover effects
    node.on('mouseenter', function (event, d) {
        const degree = nodeDegrees[d.id];
        const baseRadius = Math.max(4, Math.min(12, 3 + degree * 1.2));

        d3.select(this).select('circle')
            .transition()
            .duration(200)
            .attr('r', baseRadius * 1.8)
            .attr('stroke-width', 3);

        // Show label on hover
        d3.select(this).select('text')
            .transition()
            .duration(200)
            .style('opacity', 1)
            .style('font-size', '12px')
            .style('font-weight', '700');

        // Highlight connected links
        link.attr('class', l =>
            (l.source.id === d.id || l.target.id === d.id) ? 'link link-highlight' : 'link'
        );
    });

    node.on('mouseleave', function (event, d) {
        const degree = nodeDegrees[d.id];
        const baseRadius = Math.max(4, Math.min(12, 3 + degree * 1.2));

        d3.select(this).select('circle')
            .transition()
            .duration(200)
            .attr('r', baseRadius)
            .attr('stroke-width', 1.5);

        // Hide label
        d3.select(this).select('text')
            .transition()
            .duration(200)
            .style('opacity', 0)
            .style('font-size', '10px')
            .style('font-weight', '600');

        link.attr('class', 'link');
    });

    // Click to open note
    node.on('click', (event, d) => {
        openNote(d.id);
    });

    // Update positions on tick
    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    // Store zoom behavior for reset
    svg.node().__zoom__ = zoom;
}

// Reset graph zoom
function resetGraphZoom() {
    const svg = d3.select('#networkGraph');
    svg.transition()
        .duration(750)
        .call(svg.node().__zoom__.transform, d3.zoomIdentity);
}

// Restart simulation
function restartSimulation() {
    if (simulation) {
        simulation.alpha(1).restart();
    }
}

// Go home
function goHome() {
    showHome();
}

// Open note
function openNote(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;

    currentView = 'note';

    if (!openPanels.includes(noteId)) {
        openPanels.push(noteId);
    }

    currentPanelIndex = openPanels.indexOf(noteId);

    document.getElementById('sidebar').classList.remove('hidden');
    document.getElementById('navControls').classList.remove('hidden');

    renderPanels();
    renderSidebar();
    updateNavigation();
}

// Render panels
function renderPanels() {
    const contentArea = document.getElementById('contentArea');

    contentArea.innerHTML = openPanels.map(noteId => {
        const note = notes.find(n => n.id === noteId);
        if (!note) return '';

        // Protect LaTeX from markdown
        let content = note.body;
        const mathBlocks = [];

        content = content.replace(/\$\$([\s\S]*?)\$\$/g, (match) => {
            mathBlocks.push(match);
            return `<!--MATH${mathBlocks.length - 1}-->`;
        });

        content = content.replace(/\$([^\$\n]+?)\$/g, (match) => {
            mathBlocks.push(match);
            return `<!--MATH${mathBlocks.length - 1}-->`;
        });

        let html = marked.parse(content);

        mathBlocks.forEach((block, i) => {
            html = html.replace(new RegExp(`<!--MATH${i}-->`, 'g'), block);
        });

        return `
            <div class="panel">
                <div class="note-page">
                    <div class="note-header">
                        <h1>${note.title}</h1>
                        <div class="note-meta">${note.date} · ${note.category}</div>
                        <div class="note-tags">
                            ${note.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                    <div class="note-body">${html}</div>
                </div>
            </div>
        `;
    }).join('');

    // Process internal links
    processInternalLinks();

    // Render LaTeX
    renderMathInElement(contentArea, {
        delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false }
        ],
        throwOnError: false
    });

    // Apply syntax highlighting
    contentArea.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);

        // Add special classes for terminal/console output
        const parent = block.parentElement;
        const classes = block.className.toLowerCase();

        if (classes.includes('language-terminal') || classes.includes('language-console')) {
            parent.classList.add('terminal');
        } else if (classes.includes('language-output')) {
            parent.classList.add('output');
        } else if (classes.includes('language-bash') || classes.includes('language-shell')) {
            parent.classList.add('bash');
        }
    });

    // Add copy buttons to code blocks
    addCopyButtons();

    updatePanelScroll();
}

// Add copy buttons to code blocks
function addCopyButtons() {
    document.querySelectorAll('pre').forEach((pre) => {
        // Don't add if button already exists
        if (pre.querySelector('.copy-btn')) return;

        const button = document.createElement('button');
        button.className = 'copy-btn';
        button.textContent = 'Copy';

        button.addEventListener('click', async () => {
            const code = pre.querySelector('code').textContent;

            try {
                await navigator.clipboard.writeText(code);
                button.textContent = '✓ Copied!';
                button.classList.add('copied');

                setTimeout(() => {
                    button.textContent = 'Copy';
                    button.classList.remove('copied');
                }, 2000);
            } catch (err) {
                button.textContent = 'Failed';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            }
        });

        pre.appendChild(button);
    });
}

// Process internal links
function processInternalLinks() {
    document.querySelectorAll('.note-body').forEach(body => {
        body.innerHTML = body.innerHTML.replace(/\[\[([^\]]+)\]\]/g, (match, noteId) => {
            return `<a class="internal-link" onclick="openNote('${noteId.trim()}')">${noteId.trim()}</a>`;
        });
    });
}

// Update panel scroll
function updatePanelScroll() {
    const contentArea = document.getElementById('contentArea');
    contentArea.style.transform = `translateX(-${currentPanelIndex * 100}%)`;
}

// Render sidebar
function renderSidebar() {
    const sidebarNotes = document.getElementById('sidebarNotes');

    let filteredNotes = notes;
    if (sidebarSearchTerm) {
        filteredNotes = notes.filter(note =>
            note.title.toLowerCase().includes(sidebarSearchTerm) ||
            note.category.toLowerCase().includes(sidebarSearchTerm)
        );
    }

    sidebarNotes.innerHTML = filteredNotes.map(note => `
        <div class="sidebar-note ${openPanels.includes(note.id) ? 'active' : ''}" onclick="openNote('${note.id}')">
            <div class="sidebar-note-title">${note.title}</div>
            <div class="sidebar-note-date">${note.date} · ${note.category}</div>
        </div>
    `).join('');

    setupSidebarSearch();
}

// Setup sidebar search
function setupSidebarSearch() {
    const searchInput = document.getElementById('sidebarSearch');
    if (!searchInput) return;

    searchInput.value = sidebarSearchTerm;

    searchInput.addEventListener('input', (e) => {
        sidebarSearchTerm = e.target.value.toLowerCase();
        renderSidebar();
    });
}

// Scroll panels
function scrollPanel(direction) {
    const newIndex = currentPanelIndex + direction;
    if (newIndex >= 0 && newIndex < openPanels.length) {
        currentPanelIndex = newIndex;
        updatePanelScroll();
        updateNavigation();
        renderSidebar();
    }
}

// Update navigation
function updateNavigation() {
    const panelCount = document.getElementById('panelCount');
    panelCount.textContent = `${currentPanelIndex + 1}/${openPanels.length}`;

    const buttons = document.querySelectorAll('.nav-controls button');
    buttons[0].disabled = currentPanelIndex === 0;
    buttons[1].disabled = currentPanelIndex === openPanels.length - 1;
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (currentView === 'note') {
        if (e.altKey && e.key === 'ArrowLeft') {
            scrollPanel(-1);
        } else if (e.altKey && e.key === 'ArrowRight') {
            scrollPanel(1);
        }
    }
});

// Start
window.addEventListener('DOMContentLoaded', init);

