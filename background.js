// Fromptly Background Service Worker

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
const suggestionCache = new Map();

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getLLMFeedback') {
    getLLMFeedback(request.data)
      .then(result => sendResponse(result))
      .catch(error => {
        console.error('Error getting LLM feedback:', error);
        sendResponse({ error: error.message });
      });
    return true; // Keep the message channel open for async response
  }
});

// Get LLM feedback for a vague phrase
async function getLLMFeedback(data) {
  const { phrase, context, category } = data;
  const cacheKey = `${phrase}_${category}`;

  // Check cache first
  const cached = suggestionCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('Returning cached suggestions for:', phrase);
    return { suggestions: cached.suggestions };
  }

  // Get API key from storage
  const settings = await chrome.storage.sync.get(['openaiApiKey', 'llmProvider', 'customApiKey']);

  if (!settings.openaiApiKey && !settings.customApiKey) {
    console.log('No API key configured - skipping LLM feedback');
    return { suggestions: [] };
  }

  try {
    const suggestions = await callLLM(phrase, context, category, settings);

    // Cache the result
    suggestionCache.set(cacheKey, {
      suggestions,
      timestamp: Date.now()
    });

    return { suggestions };
  } catch (error) {
    console.error('LLM API error:', error);
    return { suggestions: [] };
  }
}

// Call LLM API (OpenAI GPT-4o-mini)
async function callLLM(phrase, context, category, settings) {
  const apiKey = settings.openaiApiKey || settings.customApiKey;
  const provider = settings.llmProvider || 'openai';

  const systemPrompt = `You are a design and UI language expert. Your job is to convert vague, ambiguous design prompts into precise, actionable suggestions using specific CSS properties, design tokens, or clear measurements.

When given a vague phrase, provide 2-3 concrete alternatives that:
- Use specific CSS properties and values
- Reference actual measurements (px, rem, %, etc.)
- Include design system tokens when relevant
- Are implementable by developers or AI code generators

Be concise and practical. Focus on clarity over creativity.`;

  const userPrompt = `Context: "${context}"

Vague phrase detected: "${phrase}"
Category: ${category}

Provide 2-3 precise, actionable alternatives to replace this vague phrase. Each suggestion should be specific enough for a developer or AI to implement directly.

Return ONLY a JSON array of strings, like:
["suggestion 1", "suggestion 2", "suggestion 3"]`;

  if (provider === 'openai') {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();

    // Parse JSON array from response
    try {
      const suggestions = JSON.parse(content);
      return Array.isArray(suggestions) ? suggestions : [];
    } catch (e) {
      // If not valid JSON, try to extract suggestions from text
      return parseTextSuggestions(content);
    }
  }

  return [];
}

// Parse suggestions from plain text response
function parseTextSuggestions(text) {
  const lines = text.split('\n').filter(line => line.trim());
  const suggestions = [];

  for (const line of lines) {
    // Remove numbering, bullets, etc.
    const cleaned = line.replace(/^[\d\.\-\*\•]\s*/, '').trim();
    if (cleaned && cleaned.length > 10) {
      suggestions.push(cleaned);
    }
  }

  return suggestions.slice(0, 3); // Max 3 suggestions
}

// Initialize extension
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    // Set default settings
    await chrome.storage.sync.set({
      isActive: true,
      enabledDomains: [
        'lovable.dev',
        'aistudio.google.com',
        'notion.so',
        'atlassian.net',
        'github.com'
      ],
      llmProvider: 'openai'
    });

    // Open options page on install
    chrome.tabs.create({ url: 'options.html' });
  }
});

// Clean cache periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of suggestionCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      suggestionCache.delete(key);
    }
  }
}, 5 * 60 * 1000); // Every 5 minutes

console.log('Fromptly background service worker initialized');
