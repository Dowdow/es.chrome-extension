const iconBase = 'icon/es_128.png';
const iconGreen = 'icon/es_128_green.png';
const iconOrange = 'icon/es_128_orange.png';
const iconRed = 'icon/es_128_red.png';

const regexFacebookEvent = /facebook\.com\/events/g;
const regexFacebookEventId = /(?<=facebook\.com\/events\/)(.+?)(?=\/|$)/g;

let apiKey = null;

function getEventData(id) {
  return new Promise((resolve, reject) => {
    if (apiKey === null) {
      reject(new Error('No Api Key provided'));
    }

    const url = new URL(`https://event-sonar.com/scrap/event/${id}`);

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('X-AUTH-TOKEN', apiKey);

    fetch(url, { method: 'GET', headers })
      .then((response) => (response.ok ? resolve(response.json()) : resolve(null)))
      .catch((err) => reject(err));
  });
}

function urlChanged(url) {
  const match = url.match(regexFacebookEvent);
  if (match !== null) {
    const id = url.match(regexFacebookEventId);
    if (id !== null) {
      getEventData(id[0])
        .then((data) => {
          if (data !== null) {
            if (data.name !== null && data.start !== null && data.end !== null && data.image !== null) {
              chrome.action.setIcon({ path: iconGreen });
            } else {
              chrome.action.setIcon({ path: iconOrange });
            }
          } else {
            chrome.action.setIcon({ path: iconRed });
          }
        });
    }
  }
}

chrome.storage.local.get('apiKey', (data) => {
  if (data.apiKey) {
    apiKey = data.apiKey;
  }
});

chrome.tabs.onActivated.addListener((e) => {
  chrome.action.setIcon({ path: iconBase });
  const { tabId } = e;
  chrome.tabs.get(tabId, (tab) => {
    const { url } = tab;
    urlChanged(url);
  });
});
