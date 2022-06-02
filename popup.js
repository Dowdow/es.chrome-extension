let apiKey = null;

const pageNo = document.getElementById('page-no');
const pageData = document.getElementById('page-data');

const facebookIdElement = document.getElementById('facebook-id');
const titleElement = document.getElementById('title');
const datesElement = document.getElementById('dates');
const imageElement = document.getElementById('image');

const button = document.getElementById('button');

function postEventData(facebookId, title, dates) {
  return new Promise((resolve, reject) => {
    if (apiKey === null) {
      reject(new Error('No Api Key provided'));
    }

    const url = new URL('https://event-sonar.com/scrap/event');

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('X-AUTH-TOKEN', apiKey);

    const data = { facebookId, title, dates };

    fetch(url, { method: 'POST', headers, body: JSON.stringify(data) })
      .then((response) => (response.ok ? resolve(response.json()) : resolve(null)))
      .catch((err) => reject(err));
  });
}

function getImageUrlToBlob(imageUrl) {
  return new Promise((resolve, reject) => {
    fetch(imageUrl, { method: 'GET' })
      .then((response) => (response.ok ? resolve(response.blob()) : resolve(null)))
      .catch((err) => reject(err));
  });
}

function postImageFormData(id, imageBlob) {
  return new Promise((resolve, reject) => {
    if (apiKey === null) {
      reject(new Error('No Api Key provided'));
    }

    const url = new URL(`https://event-sonar.com/scrap/event/image/${id}`);

    const headers = new Headers();
    headers.append('X-AUTH-TOKEN', apiKey);

    const payload = new FormData();
    payload.append('file', imageBlob);

    fetch(url, { method: 'POST', headers, body: payload })
      .then((response) => (response.ok ? resolve(true) : resolve(false)))
      .catch((err) => reject(err));
  });
}

button.addEventListener('click', async () => {
  const facebookId = facebookIdElement.innerText.trim();
  const title = titleElement.innerText.trim();
  const dates = datesElement.innerText.trim();
  const image = imageElement.innerText.trim();

  button.innerText = 'Chargement...';
  button.disabled = true;

  try {
    const response = await postEventData(facebookId, title, dates);
    if (response !== null) {
      const imageBlob = await getImageUrlToBlob(image);
      if (imageBlob !== null) {
        await postImageFormData(facebookId, imageBlob);
        button.innerText = 'Done';
        button.disabled = false;
      }
    }
  } catch (err) {
    button.innerText = `Échec: ${err.message}`;
    button.disabled = false;
  }
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.values) {
    const [value0, value1, value2] = request.values;
    titleElement.innerText = value0;
    datesElement.innerText = value1;
    imageElement.innerText = value2;
  }
});

chrome.storage.local.get('apiKey', (data) => {
  if (data.apiKey) {
    apiKey = data.apiKey;
  }
});

(function main() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const regexFacebookEvent = /facebook\.com\/events/g;
    const regexFacebookEventId = /(?<=facebook\.com\/events\/)(.+?)(?=\?|\/|$)/g;

    const tab = tabs[0];
    const { url } = tab;

    const match = url.match(regexFacebookEvent);
    if (match !== null) {
      pageData.classList.remove('hidden');

      const id = url.match(regexFacebookEventId);
      if (id !== null) {
        const [id0] = id;
        facebookIdElement.innerText = id0;
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js'],
        });
      }
    } else {
      pageNo.classList.remove('hidden');
    }
  });
}());
