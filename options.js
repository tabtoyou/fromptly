// Fromptly Options Page Script

const domainCheckboxes = {
  'lovable.dev': document.getElementById('domain-lovable'),
  'aistudio.google.com': document.getElementById('domain-gemini'),
  'notion.so': document.getElementById('domain-notion'),
  'atlassian.net': document.getElementById('domain-jira'),
  'github.com': document.getElementById('domain-github')
};

// Toggle API key input based on provider selection
function toggleApiKeyInput() {
  const provider = document.querySelector('input[name="provider"]:checked')?.value;

  const geminiGroup = document.getElementById('geminiKeyGroup');
  const openaiGroup = document.getElementById('openaiKeyGroup');

  if (provider === 'gemini') {
    geminiGroup.style.display = 'block';
    openaiGroup.style.display = 'none';
  } else if (provider === 'openai') {
    geminiGroup.style.display = 'none';
    openaiGroup.style.display = 'block';
  }
}

// Load saved settings
async function loadSettings() {
  const settings = await chrome.storage.sync.get([
    'isActive',
    'geminiApiKey',
    'openaiApiKey',
    'llmProvider',
    'enabledDomains'
  ]);

  // Extension active status
  document.getElementById('extensionActive').checked = settings.isActive !== false;

  // Provider selection
  const provider = settings.llmProvider || 'gemini';
  if (provider === 'gemini') {
    document.getElementById('providerGemini').checked = true;
  } else {
    document.getElementById('providerOpenAI').checked = true;
  }

  // API keys
  if (settings.geminiApiKey) {
    document.getElementById('geminiApiKey').value = settings.geminiApiKey;
  }
  if (settings.openaiApiKey) {
    document.getElementById('openaiApiKey').value = settings.openaiApiKey;
  }

  // Toggle input visibility
  toggleApiKeyInput();

  // Enabled domains
  const enabledDomains = settings.enabledDomains || [
    'lovable.dev',
    'aistudio.google.com',
    'notion.so',
    'atlassian.net',
    'github.com'
  ];

  for (const [domain, checkbox] of Object.entries(domainCheckboxes)) {
    checkbox.checked = enabledDomains.includes(domain);
  }
}

// Save settings
async function saveSettings() {
  const isActive = document.getElementById('extensionActive').checked;
  const provider = document.querySelector('input[name="provider"]:checked')?.value || 'gemini';
  const geminiApiKey = document.getElementById('geminiApiKey').value.trim();
  const openaiApiKey = document.getElementById('openaiApiKey').value.trim();

  // Get enabled domains
  const enabledDomains = [];
  for (const [domain, checkbox] of Object.entries(domainCheckboxes)) {
    if (checkbox.checked) {
      enabledDomains.push(domain);
    }
  }

  try {
    await chrome.storage.sync.set({
      isActive,
      llmProvider: provider,
      geminiApiKey: geminiApiKey,
      openaiApiKey: openaiApiKey,
      enabledDomains
    });

    showStatus('Settings saved successfully!', 'success');

    // Reload all tabs to apply new settings
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      if (tab.url && !tab.url.startsWith('chrome://')) {
        try {
          await chrome.tabs.reload(tab.id);
        } catch (e) {
          // Ignore tabs that can't be reloaded
        }
      }
    }
  } catch (error) {
    showStatus('Error saving settings: ' + error.message, 'error');
  }
}

// Reset to default settings
async function resetSettings() {
  if (!confirm('Are you sure you want to reset all settings to default?')) {
    return;
  }

  try {
    await chrome.storage.sync.set({
      isActive: true,
      llmProvider: 'gemini',
      geminiApiKey: '',
      openaiApiKey: '',
      enabledDomains: [
        'lovable.dev',
        'aistudio.google.com',
        'notion.so',
        'atlassian.net',
        'github.com'
      ]
    });

    await loadSettings();
    showStatus('Settings reset to default', 'success');
  } catch (error) {
    showStatus('Error resetting settings: ' + error.message, 'error');
  }
}

// Show status message
function showStatus(message, type) {
  const statusElement = document.getElementById('statusMessage');
  statusElement.textContent = message;
  statusElement.className = `status-message ${type}`;
  statusElement.style.display = 'block';

  setTimeout(() => {
    statusElement.style.display = 'none';
  }, 5000);
}

// Event listeners
document.getElementById('saveBtn').addEventListener('click', saveSettings);
document.getElementById('resetBtn').addEventListener('click', resetSettings);

// Provider radio button change
document.querySelectorAll('input[name="provider"]').forEach(radio => {
  radio.addEventListener('change', toggleApiKeyInput);
});

// Load settings when page loads
document.addEventListener('DOMContentLoaded', loadSettings);

// Auto-save on extension toggle
document.getElementById('extensionActive').addEventListener('change', () => {
  saveSettings();
});
