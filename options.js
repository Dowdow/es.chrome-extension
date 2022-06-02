const apiKeyInput = document.getElementById('api-key');
const titleSelectorInput = document.getElementById('title-selector');
const datesSelectorInput = document.getElementById('dates-selector');
const imageSelectorInput = document.getElementById('images-selector');

const saveButton = document.getElementById('save');

saveButton.addEventListener('click', () => {
  chrome.storage.local.set({ apiKey: apiKeyInput.value });
  chrome.storage.local.set({ titleSelector: titleSelectorInput.value });
  chrome.storage.local.set({ datesSelector: datesSelectorInput.value });
  chrome.storage.local.set({ imageSelector: imageSelectorInput.value });
});

chrome.storage.local.get('apiKey', (data) => {
  if (data.apiKey) {
    apiKeyInput.value = data.apiKey;
  }
});

chrome.storage.local.get('titleSelector', (data) => {
  if (data.titleSelector) {
    titleSelectorInput.value = data.titleSelector;
  }
});

chrome.storage.local.get('datesSelector', (data) => {
  if (data.datesSelector) {
    datesSelectorInput.value = data.datesSelector;
  }
});

chrome.storage.local.get('imageSelector', (data) => {
  if (data.imageSelector) {
    imageSelectorInput.value = data.imageSelector;
  }
});
