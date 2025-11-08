// Fromptly Content Script - Real-time prompt detection and highlighting

let vaguePhrases = [];
let currentElement = null;
let suggestionPanel = null;
let currentMatch = null;
let isEnabled = true;

// Load vague phrases dictionary
async function loadVaguePhrases() {
  try {
    const url = chrome.runtime.getURL('vague-phrases.json');
    console.log('Fromptly: Loading vague phrases from', url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    vaguePhrases = data.vaguePhrases;
    console.log(`Fromptly: Loaded ${vaguePhrases.length} vague phrase patterns`);
  } catch (error) {
    console.error('Fromptly: Failed to load vague phrases:', error);
  }
}

// Check if extension is enabled for current domain
async function checkDomainEnabled() {
  const settings = await chrome.storage.sync.get(['enabledDomains', 'isActive']);
  const currentDomain = window.location.hostname;

  console.log('Fromptly: Current domain:', currentDomain);
  console.log('Fromptly: Extension active:', settings.isActive !== false);

  if (settings.isActive === false) {
    isEnabled = false;
    console.log('Fromptly: Extension is disabled in settings');
    return;
  }

  const enabledDomains = settings.enabledDomains || [
    'lovable.dev',
    'aistudio.google.com',
    'notion.so',
    'atlassian.net',
    'github.com'
  ];

  // Enable for local files (test.html, file://) and localhost
  const isLocalFile = !currentDomain || currentDomain === '' || currentDomain === 'localhost' || window.location.protocol === 'file:';

  isEnabled = isLocalFile || enabledDomains.some(domain => currentDomain.includes(domain));

  console.log('Fromptly: Enabled domains:', enabledDomains);
  console.log('Fromptly: Is local file:', isLocalFile);
  console.log('Fromptly: Extension enabled for this domain:', isEnabled);
}

// Detect vague phrases in text
function detectVaguePhrases(text) {
  const matches = [];

  for (const phraseData of vaguePhrases) {
    const regex = new RegExp(phraseData.pattern, 'gi');
    let match;

    while ((match = regex.exec(text)) !== null) {
      matches.push({
        text: match[0],
        start: match.index,
        end: match.index + match[0].length,
        suggestions: phraseData.suggestions,
        category: phraseData.category,
        phraseData: phraseData
      });
    }
  }

  return matches;
}

// Create highlight overlay for detected phrases
function createHighlight(element, match) {
  const highlight = document.createElement('span');
  highlight.className = 'fromptly-highlight';
  highlight.setAttribute('data-fromptly-match', JSON.stringify(match));
  highlight.style.cssText = `
    background-color: rgba(255, 200, 0, 0.3);
    border-bottom: 2px solid #ff9800;
    cursor: pointer;
    position: relative;
  `;

  highlight.addEventListener('click', (e) => {
    e.stopPropagation();
    showSuggestionPanel(match, element, highlight);
  });

  return highlight;
}

// Show suggestion panel
function showSuggestionPanel(match, element, highlightElement) {
  currentMatch = match;
  currentElement = element;

  // Remove existing panel
  if (suggestionPanel) {
    suggestionPanel.remove();
  }

  // Create panel
  suggestionPanel = document.createElement('div');
  suggestionPanel.className = 'fromptly-suggestion-panel';
  suggestionPanel.innerHTML = `
    <div class="fromptly-panel-header">
      <span class="fromptly-logo">🪶 Fromptly</span>
      <button class="fromptly-close">×</button>
    </div>
    <div class="fromptly-panel-content">
      <div class="fromptly-detected">
        <strong>Vague phrase:</strong> "${match.text}"
      </div>
      <div class="fromptly-category">
        <span class="fromptly-badge">${match.category}</span>
      </div>
      <div class="fromptly-suggestions-title">
        <strong>Suggested alternatives:</strong>
      </div>
      <div class="fromptly-suggestions-list">
        ${match.suggestions.map((suggestion, index) => `
          <div class="fromptly-suggestion-item" data-index="${index}">
            <span class="fromptly-suggestion-text">${suggestion}</span>
            <button class="fromptly-apply-btn" data-suggestion="${suggestion}">Apply</button>
          </div>
        `).join('')}
      </div>
      <div class="fromptly-footer">
        <small>Press Alt+Enter to apply first suggestion</small>
      </div>
    </div>
  `;

  // Position panel
  const rect = highlightElement.getBoundingClientRect();
  suggestionPanel.style.cssText = `
    position: fixed;
    top: ${rect.bottom + 10}px;
    left: ${rect.left}px;
    z-index: 10000;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    padding: 0;
    max-width: 400px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  `;

  document.body.appendChild(suggestionPanel);

  // Event listeners
  suggestionPanel.querySelector('.fromptly-close').addEventListener('click', () => {
    suggestionPanel.remove();
    suggestionPanel = null;
  });

  suggestionPanel.querySelectorAll('.fromptly-apply-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const suggestion = e.target.getAttribute('data-suggestion');
      applySuggestion(suggestion);
    });
  });

  // Request LLM feedback for more context
  requestLLMFeedback(match, element);
}

// Apply suggestion to the text
function applySuggestion(suggestion) {
  if (!currentElement || !currentMatch) return;

  const text = currentElement.value || currentElement.textContent;
  const newText = text.substring(0, currentMatch.start) +
                  suggestion +
                  text.substring(currentMatch.end);

  if (currentElement.value !== undefined) {
    currentElement.value = newText;
  } else {
    currentElement.textContent = newText;
  }

  // Trigger input event
  currentElement.dispatchEvent(new Event('input', { bubbles: true }));

  // Close panel
  if (suggestionPanel) {
    suggestionPanel.remove();
    suggestionPanel = null;
  }

  // Clear highlights and re-scan
  clearHighlights();
  setTimeout(() => scanAndHighlight(currentElement), 100);
}

// Request LLM feedback from background script
async function requestLLMFeedback(match, element) {
  const context = element.value || element.textContent;

  chrome.runtime.sendMessage({
    action: 'getLLMFeedback',
    data: {
      phrase: match.text,
      context: context,
      category: match.category
    }
  }, (response) => {
    if (response && response.suggestions && suggestionPanel) {
      // Add LLM suggestions to panel
      const llmSection = document.createElement('div');
      llmSection.className = 'fromptly-llm-suggestions';
      llmSection.innerHTML = `
        <div class="fromptly-llm-title">
          <strong>🤖 AI-powered suggestions:</strong>
        </div>
        ${response.suggestions.map(suggestion => `
          <div class="fromptly-suggestion-item">
            <span class="fromptly-suggestion-text">${suggestion}</span>
            <button class="fromptly-apply-btn" data-suggestion="${suggestion}">Apply</button>
          </div>
        `).join('')}
      `;

      suggestionPanel.querySelector('.fromptly-panel-content').appendChild(llmSection);

      // Add event listeners to new buttons
      llmSection.querySelectorAll('.fromptly-apply-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const suggestion = e.target.getAttribute('data-suggestion');
          applySuggestion(suggestion);
        });
      });
    }
  });
}

// Scan and highlight text in element
function scanAndHighlight(element) {
  if (!isEnabled) {
    console.log('Fromptly: Extension not enabled, skipping scan');
    return;
  }

  const text = element.value || element.textContent;
  if (!text) return;

  console.log('Fromptly: Scanning text:', text.substring(0, 50) + '...');

  const matches = detectVaguePhrases(text);

  console.log(`Fromptly: Found ${matches.length} vague phrases`);

  if (matches.length === 0) {
    clearHighlights();
    return;
  }

  // Log the matches
  matches.forEach((match, idx) => {
    console.log(`Fromptly: Match ${idx + 1}: "${match.text}" (${match.category})`);
  });

  // For contentEditable elements, we need to handle differently
  if (element.contentEditable === 'true') {
    highlightContentEditable(element, matches);
  } else {
    // For textarea and input, show indicator
    showIndicator(element, matches.length);
  }
}

// Highlight in contentEditable elements
function highlightContentEditable(element, matches) {
  // Store cursor position
  const selection = window.getSelection();
  let cursorOffset = 0;
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    cursorOffset = range.startOffset;
  }

  clearHighlights();

  // Create underline effect
  matches.forEach(match => {
    const span = document.createElement('span');
    span.className = 'fromptly-underline';
    span.setAttribute('data-fromptly-match', JSON.stringify(match));
    span.style.cssText = 'border-bottom: 2px solid #ff9800; cursor: pointer;';

    span.addEventListener('click', (e) => {
      e.stopPropagation();
      showSuggestionPanel(match, element, span);
    });

    // This is a simplified approach - in production, use a proper text node walker
    // For now, we'll add a visual indicator
  });
}

// Show indicator for textarea/input
function showIndicator(element, count) {
  // Remove existing indicator
  let indicator = element.parentElement.querySelector('.fromptly-indicator');
  if (indicator) {
    indicator.remove();
  }

  // Create indicator
  indicator = document.createElement('div');
  indicator.className = 'fromptly-indicator';
  indicator.innerHTML = `
    <span class="fromptly-indicator-icon">🪶</span>
    <span class="fromptly-indicator-text">${count} vague phrase${count > 1 ? 's' : ''} detected</span>
  `;
  indicator.style.cssText = `
    position: absolute;
    bottom: 8px;
    right: 8px;
    background: #ff9800;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 4px;
  `;

  indicator.addEventListener('click', () => {
    const text = element.value || element.textContent;
    const matches = detectVaguePhrases(text);
    if (matches.length > 0) {
      showSuggestionPanel(matches[0], element, indicator);
    }
  });

  // Insert indicator
  if (element.parentElement.style.position !== 'relative' &&
      element.parentElement.style.position !== 'absolute') {
    element.parentElement.style.position = 'relative';
  }
  element.parentElement.appendChild(indicator);
}

// Clear all highlights
function clearHighlights() {
  document.querySelectorAll('.fromptly-highlight, .fromptly-underline, .fromptly-indicator').forEach(el => {
    el.remove();
  });
}

// Monitor editable elements
function monitorEditableElements() {
  const editableSelectors = [
    'textarea',
    'input[type="text"]',
    '[contenteditable="true"]',
    '[role="textbox"]'
  ];

  const elements = document.querySelectorAll(editableSelectors.join(','));

  console.log(`Fromptly: Found ${elements.length} editable elements`);

  elements.forEach((element, idx) => {
    // Skip if already monitored
    if (element.hasAttribute('data-fromptly-monitored')) return;

    console.log(`Fromptly: Monitoring element ${idx + 1}:`, element.tagName, element.type || 'contenteditable');

    element.setAttribute('data-fromptly-monitored', 'true');

    let timeout;

    const handleInput = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        scanAndHighlight(element);
      }, 800); // 800ms debounce
    };

    element.addEventListener('input', handleInput);
    element.addEventListener('focus', () => {
      clearHighlights();
      scanAndHighlight(element);
    });
  });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Alt + Enter to apply first suggestion
  if (e.altKey && e.key === 'Enter' && currentMatch && currentMatch.suggestions.length > 0) {
    e.preventDefault();
    applySuggestion(currentMatch.suggestions[0]);
  }
});

// Initialize
async function init() {
  await loadVaguePhrases();
  await checkDomainEnabled();

  if (!isEnabled) {
    console.log('Fromptly: Extension disabled for this domain');
    return;
  }

  console.log('Fromptly: Extension active');

  // Initial scan
  monitorEditableElements();

  // Monitor for dynamic content
  const observer = new MutationObserver(() => {
    monitorEditableElements();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
