chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchContainers") {
        fetch(request.url, {
            headers: { "X-API-Key": request.apiKey }
        })
        .then(response => response.json())
        .then(data => sendResponse({ success: true, data }))
        .catch(error => {
            console.error("Error in background fetch:", error);
            sendResponse({ success: false, error: error.message });
        });

        return true;
    }

    if (request.action === "restartContainer") {
        const url = `${request.baseUrl}/api/endpoints/${request.environmentId}/docker/containers/${request.containerId}/restart`;

        fetch(url, {
            method: "POST",
            headers: {
                "X-API-Key": request.apiKey,
                "Content-Type": "application/json"
            },
            mode: "cors",
            credentials: "omit"
        })
        .then(response => {
            if (response.ok) {
                sendResponse({ success: true, message: "✅ Conteneur redémarré avec succès !" });
            } else {
                sendResponse({ success: false, message: "❌ Échec du redémarrage du conteneur." });
            }
        })
        .catch(error => {
            console.error("Erreur lors du redémarrage :", error);
            sendResponse({ success: false, message: "❌ Erreur réseau." });
        });

        return true;
    }

    if (request.action === "stackAction") {
        const url = `${request.baseUrl}/api/stacks/${request.stackId}/${request.verb}?endpointId=${request.environmentId}`;
    
        fetch(url, {
            method: "POST",
            headers: {
                "X-API-Key": request.apiKey,
                "Content-Type": "application/json"
            },
            mode: "cors",
            credentials: "omit"
        })
        .then(response =>
            response.json().catch(() => ({}))
            .then(data => ({ response, data }))
        )
        .then(({ response, data }) => {
            if (response.ok || response.status === 409) {
                sendResponse({ success: true, message: `✅ Stack ${request.verb} réalisée avec succès !` });
            } else if (response.status === 400 && request.verb === "stop") {
                console.warn(`⚠️ Échec de l'arrêt de la stack (400). Tentative de démarrage à la place...`);
    
                fetch(`${request.baseUrl}/api/stacks/${request.stackId}/start?endpointId=${request.environmentId}`, {
                    method: "POST",
                    headers: {
                        "X-API-Key": request.apiKey,
                        "Content-Type": "application/json"
                    },
                    mode: "cors",
                    credentials: "omit"
                })
                .then(startResponse => {
                    if (startResponse.ok) {
                        sendResponse({ success: true, message: "✅ Stack démarrée automatiquement après échec de l'arrêt." });
                    } else {
                        sendResponse({ success: false, message: "❌ Échec du démarrage automatique de la stack." });
                    }
                })
                .catch(error => {
                    console.error("❌ Erreur réseau lors du démarrage automatique :", error);
                    sendResponse({ success: false, message: "❌ Erreur réseau." });
                });
    
                return;
            } else {
                console.error(`Échec de l'action '${request.verb}' sur la stack :`, response.status);
                sendResponse({ success: false, message: `❌ Échec de l'action '${request.verb}' sur la stack.` });
            }
        })
        .catch(error => {
            console.error(`Erreur lors de l'action '${request.verb}' sur la stack :`, error);
            sendResponse({ success: false, message: "❌ Erreur réseau." });
        });
    
        return true;
    }
});