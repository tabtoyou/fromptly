// Fromptly Popup Script

async function updateStatus() {
  // Get current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = new URL(tab.url);
  const domain = url.hostname;

  // Update current domain
  document.getElementById('currentDomain').textContent = domain;

  // Get settings
  const settings = await chrome.storage.sync.get([
    'isActive',
    'openaiApiKey',
    'enabledDomains'
  ]);

  // Update extension status
  const isActive = settings.isActive !== false;
  const statusIndicator = document.getElementById('statusIndicator');

  if (isActive) {
    statusIndicator.classList.remove('inactive');
    document.getElementById('toggleBtn').textContent = 'Disable Extension';
  } else {
    statusIndicator.classList.add('inactive');
    document.getElementById('toggleBtn').textContent = 'Enable Extension';
  }

  // Check if domain is enabled
  const enabledDomains = settings.enabledDomains || [
    'lovable.dev',
    'aistudio.google.com',
    'notion.so',
    'atlassian.net',
    'github.com'
  ];

  const isDomainEnabled = enabledDomains.some(enabledDomain =>
    domain.includes(enabledDomain)
  );

  document.getElementById('domainStatus').textContent = isDomainEnabled ? 'Yes ✓' : 'No ✗';

  // Check API key
  const hasApiKey = settings.openaiApiKey && settings.openaiApiKey.length > 0;
  document.getElementById('apiStatus').textContent = hasApiKey ? 'Configured ✓' : 'Not set ✗';
}

// Toggle extension
async function toggleExtension() {
  const settings = await chrome.storage.sync.get(['isActive']);
  const newState = !(settings.isActive !== false);

  await chrome.storage.sync.set({ isActive: newState });

  // Reload current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab.id) {
    await chrome.tabs.reload(tab.id);
  }

  await updateStatus();
}

// Event listeners
document.getElementById('toggleBtn').addEventListener('click', toggleExtension);

// Update status when popup opens
document.addEventListener('DOMContentLoaded', updateStatus);
