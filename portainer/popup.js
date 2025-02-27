const searchInput = document.getElementById('searchInput');
const resultsBody = document.getElementById('resultsBody');
const infoMessage = document.getElementById('infoMessage');

let containersData = [];

function showInfo(msg) {
	infoMessage.textContent = msg;
}

function displayResults(filteredList, baseUrl) {
	resultsBody.innerHTML = '';
	if (filteredList.length === 0) {
	  	showInfo('Aucun conteneur ne correspond à votre recherche.');
		return;
	} else {
	  	showInfo('');
	}
	filteredList.forEach(item => {
		const row = document.createElement('tr');

		const nameCell = document.createElement('td');
		const containerLink = document.createElement('a');
		containerLink.href = `${baseUrl}/#!/${item.environmentId}/docker/containers/${item.containerId}`;
		containerLink.textContent = item.containerName;
		containerLink.target = "_blank";
		containerLink.className = 'text-blue-600 hover:underline';
		nameCell.appendChild(containerLink);
		nameCell.className = 'py-1 px-2 w-[100px] break-all whitespace-normal overflow-hidden';

		const statusCell = document.createElement('td');
		statusCell.textContent = item.containerStatus;
		statusCell.className = 'py-1 px-2 w-[60px] break-all whitespace-normal overflow-hidden';

		const envCell = document.createElement('td');
		const envLink = document.createElement('a');
		envLink.href = `${baseUrl}/#!/${item.environmentId}/docker/dashboard`;
		envLink.textContent = item.environmentName;
		envLink.target = "_blank";
		envLink.className = 'text-blue-600 hover:underline';
		envCell.appendChild(envLink);
		envCell.className = 'py-1 px-2 w-[150px] break-all whitespace-normal overflow-hidden';

		const stackCell = document.createElement('td');
		if (item.stackName !== "N/A" && item.stackId) {
		    const stackLink = document.createElement('a');
		    stackLink.href = `${baseUrl}/#!/${item.environmentId}/docker/stacks/${item.stackName}?id=${item.stackId}&type=2&regular=true`;
		    stackLink.textContent = item.stackName;
		    stackLink.target = "_blank";
		    stackLink.className = 'text-blue-600 hover:underline';
		    stackCell.appendChild(stackLink);
		} else {
		    stackCell.textContent = "N/A";
		}
		stackCell.className = 'py-1 px-2 w-[100px] break-all whitespace-normal overflow-hidden';

		const actionsCell = document.createElement('td');
		actionsCell.className = 'py-1 px-2 flex gap-2 w-[250px] break-all whitespace-normal overflow-hidden';

		const logsButton = document.createElement('button');
		logsButton.textContent = "📝";
		logsButton.title = "Logs du conteneur";
		logsButton.className = 'bg-gray-200 px-2 py-1 rounded hover:bg-gray-300';
		logsButton.onclick = () => window.open(`${baseUrl}/#!/${item.environmentId}/docker/containers/${item.containerId}/logs`, '_blank');
		actionsCell.appendChild(logsButton);

		const consoleButton = document.createElement('button');
		consoleButton.textContent = "🖥️";
		consoleButton.title = "Console du conteneur";
		consoleButton.className = 'bg-gray-200 px-2 py-1 rounded hover:bg-gray-300';
		consoleButton.onclick = () => window.open(`${baseUrl}/#!/${item.environmentId}/docker/containers/${item.containerId}/exec`, '_blank');
		actionsCell.appendChild(consoleButton);

		const restartButton = document.createElement('button');
		restartButton.textContent = "🔄";
		restartButton.title = "Redémarrer le conteneur";
		restartButton.className = 'bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600';
		restartButton.onclick = () => restartContainer(item.containerId, item.environmentId, item.containerName);
		actionsCell.appendChild(restartButton);

		if (item.stackName !== "N/A" && item.stackId) {
		    const redeployButton = document.createElement('button');
		    redeployButton.textContent = "🚀";
		    redeployButton.title = "Redéployer la stack";
		    redeployButton.className = 'bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600';
		    redeployButton.onclick = () => redeployStack(item.stackId, item.environmentId, item.stackName);
		    actionsCell.appendChild(redeployButton);
		}
		setLoadingState(false);

		row.appendChild(nameCell);
		row.appendChild(statusCell);
		row.appendChild(envCell);
		row.appendChild(stackCell);
		row.appendChild(actionsCell);
		resultsBody.appendChild(row);
	});
}

function filterResults(query, baseUrl) {
	const q = query.toLowerCase();
	const filtered = containersData.filter(item => 
		item.containerName.toLowerCase().includes(q) ||
		item.containerStatus.toLowerCase().includes(q) ||
		item.environmentName.toLowerCase().includes(q) ||
		item.stackName.toLowerCase().includes(q)
	);
	displayResults(filtered, baseUrl);
}

function setLoadingState(isLoading) {
	const loader = document.getElementById('loader');
	if (isLoading) {
		loader.classList.remove('hidden');
		searchInput.disabled = true;
	} else {
		loader.classList.add('hidden');
		searchInput.disabled = false;
	}
}  

function restartContainer(containerId, environmentId, containerName) {
	if (!confirm(`Êtes-vous sûr de vouloir redémarrer le conteneur "${containerName}" ?`)) {
    	return;
	}
	chrome.storage.sync.get(["portainerUrl", "apiKey"], (data) => {
		if (!data.apiKey) {
			alert("❌ Clé API manquante. Configurez-la dans les options.");
			return;
		}
		chrome.runtime.sendMessage({
			action: "restartContainer",
			containerId,
			environmentId,
			apiKey: data.apiKey,
			baseUrl: data.portainerUrl
		}, (response) => {
			alert(response.message);
		});
	});
}

async function redeployStack(stackId, environmentId, stackName) {
	if (!confirm(`Êtes-vous sûr de vouloir redéployer la stack "${stackName}" ?`)) {
		return;
	}	
	const { apiKey, portainerUrl } = await chrome.storage.sync.get(["apiKey", "portainerUrl"]);
	if (!apiKey) {
		alert("❌ Clé API manquante. Configurez-la dans les options.");
		return;
	}	
	try {
		const stopResponse = await new Promise((resolve) => {
			chrome.runtime.sendMessage({
				action: "stackAction",
				verb: "stop",
				stackId,
				environmentId,
				apiKey,
				baseUrl: portainerUrl
			}, resolve);
		});	
		if (!stopResponse.success) {
			console.log(stopResponse);
			alert("❌ Échec de l'arrêt de la stack.");
			return;
		}
		const startResponse = await new Promise((resolve) => {
			chrome.runtime.sendMessage({
				action: "stackAction",
				verb: "start",
				stackId,
				environmentId,
				apiKey,
				baseUrl: portainerUrl
			}, resolve);
		});	
		if (startResponse.success) {
		    alert("✅ Stack redéployée avec succès !");
		} else {
			alert("❌ Échec du démarrage de la stack.");
		}
	} catch (error) {
		console.error("Erreur lors du redéploiement :", error);
		alert("❌ Erreur réseau.");
	}
}

chrome.storage.sync.get(["portainerUrl", "apiKey"], (data) => {
	const url = data.portainerUrl;
	const apiKey = data.apiKey;

	if (!url || !apiKey) {
		showInfo("Veuillez configurer l’URL de Portainer et la clé API dans les Options.");
		return;
	}

	const apiUrl = `${url.replace(/\/+$/, "")}/api/endpoints`;
	setLoadingState(true);

	chrome.runtime.sendMessage({ action: "fetchContainers", url: apiUrl, apiKey }, (response) => {
		if (response.success) {
			processEndpoints(response.data, url, apiKey);
		} else {
			showInfo("Erreur lors de la récupération des endpoints : " + response.error);
		}
	});
});
  
function processEndpoints(endpointsList, baseUrl, apiKey) {
	if (!Array.isArray(endpointsList)) {
		showInfo("Réponse API incorrecte pour les endpoints.");
    	return;
	}

	const fetchPromises = endpointsList.map(endpoint => {
		const endpointId = endpoint.Id;
		const endpointName = endpoint.Name;
		const containersUrl = `${baseUrl.replace(/\/+$/, '')}/api/endpoints/${endpointId}/docker/containers/json?all=true`;

		return new Promise((resolve) => {
			chrome.runtime.sendMessage({ action: "fetchContainers", url: containersUrl, apiKey }, (response) => {
				if (response.success) {
					const containersList = response.data.map(container => {
						let containerName = container.Names?.[0]?.replace(/^\//, '') || container.Name || container.Id;
						let containerId = container.Id;
						let containerStatus = container.State;
						let stackName = container.Labels?.['com.docker.compose.project'] || container.Labels?.['io.portainer.stack.name'] || "N/A";
						let stackId = null;
						if (container.Labels) {
							if (container.Labels['com.docker.compose.project']) {
								stackName = container.Labels['com.docker.compose.project'];
							}
							if (container.Labels['com.docker.compose.project.working_dir']) {
								const match = container.Labels['com.docker.compose.project.working_dir'].match(/\/data\/compose\/(\d+)/);
								if (match) {
								stackId = match[1];
								}
							}
						}
						return {containerName, containerStatus, containerId, environmentName: endpointName, environmentId: endpointId, stackName, stackId};
					});
					resolve(containersList);
				} else {
					console.error("Error from background.js:", response.error);
					showInfo("Erreur lors de la récupération des endpoints : " + response.error);
				}
			});
		});
	});

	Promise.all(fetchPromises)
	.then(resultsArrays => {
		containersData = resultsArrays.flat();
		displayResults(containersData, baseUrl);
	})
	.catch(error => {
		console.error("Erreur lors de la récupération des données des conteneurs :", error);
		showInfo("Impossible de récupérer les conteneurs.");
	});
}
  
searchInput.addEventListener('input', () => {
  	const query = searchInput.value;
  	chrome.storage.sync.get(["portainerUrl"], (data) => {
  		if (data.portainerUrl) {
  			filterResults(query, data.portainerUrl);
  		}
  	});
});