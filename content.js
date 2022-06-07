function getTitle() {
  return new Promise((resolve) => {
    chrome.storage.local.get('titleSelector', (data) => {
      if (data.titleSelector) {
        const titleSpan = document.querySelector(data.titleSelector);
        if (titleSpan !== null) {
          resolve(titleSpan.innerText);
        } else {
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  });
}

function getDates() {
  return new Promise((resolve) => {
    chrome.storage.local.get('datesSelector', (data) => {
      if (data.datesSelector) {
        const dateSpan = document.querySelector(data.datesSelector);
        if (dateSpan !== null) {
          resolve(dateSpan.innerText);
        } else {
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  });
}

function getImage() {
  return new Promise((resolve) => {
    chrome.storage.local.get('imageSelector', (data) => {
      if (data.imageSelector) {
        const imageElement = document.querySelector(data.imageSelector);
        if (imageElement !== null) {
          resolve(imageElement.src);
        } else {
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  });
}

Promise.all([getTitle(), getDates(), getImage()])
  .then((values) => {
    chrome.runtime.sendMessage({ values });
  });
