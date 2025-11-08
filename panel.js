// Fromptly Side Panel Script

document.getElementById('openSettings').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

document.getElementById('learnMore').addEventListener('click', () => {
  // Could link to documentation or GitHub repo
  alert('Fromptly helps you write precise, design-aware prompts.\n\nWatch for highlighted phrases in your text and click them to see suggestions.');
});
