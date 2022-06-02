function getTitle() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('titleSelector', (data) => {
      if (data.titleSelector) {
        const titleSpan = document.querySelector(data.titleSelector);
        if (titleSpan !== null) {
          resolve(titleSpan.innerText);
        } else {
          reject(new Error('Title not found'));
        }
      } else {
        reject(new Error('Title selector not found'));
      }
    });
  });
}

function getDates() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('datesSelector', (data) => {
      if (data.datesSelector) {
        const dateSpan = document.querySelector(data.datesSelector);
        if (dateSpan !== null) {
          resolve(dateSpan.innerText);
        } else {
          reject(new Error('Dates not found'));
        }
      } else {
        reject(new Error('Dates selector not found'));
      }
    });
  });
}

function getImage() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('imageSelector', (data) => {
      if (data.imageSelector) {
        const imageElement = document.querySelector(data.imageSelector);
        if (imageElement !== null) {
          resolve(imageElement.src);
        } else {
          reject(new Error('Image not found'));
        }
      } else {
        reject(new Error('Image selector not found'));
      }
    });
  });
}

Promise.all([getTitle(), getDates(), getImage()])
  .then((values) => {
    chrome.runtime.sendMessage({ values });
  });
