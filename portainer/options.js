const form = document.getElementById('optionsForm');
const portainerUrlInput = document.getElementById('portainerUrl');
const apiKeyInput = document.getElementById('apiKey');
const statusMessage = document.getElementById('statusMessage');
const createTokenLink = document.getElementById('createTokenLink');

function updateTokenLink() {
	const portainerUrl = portainerUrlInput.value.trim();
	if (portainerUrl) {
		const cleanUrl = portainerUrl.replace(/\/+$/, '');
		createTokenLink.href = `${cleanUrl}/#!/account`;
		createTokenLink.classList.remove('hidden');
	} else {
		createTokenLink.href = '#';
		createTokenLink.classList.add('hidden');
	}
}

chrome.storage.sync.get(['portainerUrl', 'apiKey'], (data) => {
	if (data.portainerUrl) portainerUrlInput.value = data.portainerUrl;
	if (data.apiKey) apiKeyInput.value = data.apiKey;
	updateTokenLink();
});

portainerUrlInput.addEventListener('input', updateTokenLink);

form.addEventListener('submit', (e) => {
	e.preventDefault();
	const portainerUrl = portainerUrlInput.value.trim();
	const apiKey = apiKeyInput.value.trim();
	chrome.storage.sync.set({ portainerUrl: portainerUrl, apiKey: apiKey }, () => {
	  statusMessage.textContent = 'Paramètres enregistrés !';
	  setTimeout(() => { statusMessage.textContent = ''; }, 3000);
	});
});