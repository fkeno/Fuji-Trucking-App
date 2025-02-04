const API_BASE_URL = "https://tycoon-2epova.users.cfx.re/status"; // Change if necessary
let apiKey = localStorage.getItem("tycoonApiKey");

function requestAPIKey() {
    apiKey = prompt("Enter your Transport Tycoon API Key:");
    if (apiKey) {
        localStorage.setItem("tycoonApiKey", apiKey);
        verifyUser();
    }
}

async function verifyUser() {
    if (!apiKey) {
        document.getElementById("status").innerText = "No API key provided!";
        return;
    }

    try {
        let response = await fetch(`${API_BASE_URL}/data`, {
            headers: { "X-Tycoon-Key": apiKey }
        });
        
        if (!response.ok) throw new Error("Invalid API key or no charges left.");

        let data = await response.json();
        document.getElementById("status").innerText = `Welcome, ${data.user_id}!`;

        checkJobStatus(data.user_id);
    } catch (error) {
        document.getElementById("status").innerText = error.message;
    }
}

async function checkJobStatus(userId) {
    try {
        let response = await fetch(`${API_BASE_URL}/map/positions.json`, {
            headers: { "X-Tycoon-Key": apiKey }
        });

        let positionData = await response.json();
        let player = positionData.players.find(p => p[2] == userId);

        if (!player || player[6].group !== "trucker") {
            document.getElementById("status").innerText = "Error: You are not a trucker!";
            return;
        }

        document.getElementById("status").innerText += " - Trucker Verified!";
    } catch (error) {
        console.error(error);
    }
}

if (apiKey) {
    verifyUser();
}
