const API_BASE_URL = "https://tycoon-2epova.users.cfx.re/status"; // Change if necessary
let apiKey = localStorage.getItem("tycoonApiKey");
let userData = {};

window.addEventListener("message", (event) => {
    if (event.data.type === "userData") {
        userData = event.data;
        verifyUser();
    }
});

function requestAPIKey() {
    apiKey = prompt("Enter your Transport Tycoon API Key:");
    if (apiKey) {
        localStorage.setItem("tycoonApiKey", apiKey);
        verifyUser();
    }
}

function verifyUser() {
    if (!userData.user_id) {
        document.getElementById("status").innerText = "No user data provided!";
        return;
    }

    document.getElementById("status").innerText = `Welcome, ${userData.user_id}!`;
    checkJobStatus();
}

function checkJobStatus() {
    if (userData.job !== "trucker") {
        document.getElementById("status").innerText = "Error: You are not a trucker!";
        return;
    }

    document.getElementById("status").innerText += " - Trucker Verified!";
    fetchPlayerDetails();
}

function fetchPlayerDetails() {
    document.getElementById("status").innerText += ` - Wealth: $${userData.wallet}`;
    document.getElementById("status").innerText += ` - Cab: ${userData.cab}, Trunk: ${userData.trailer}`;
    document.getElementById("status").innerText += ` - Inventory: ${JSON.stringify(userData.inventory)}`;

    startPositionUpdates();
}

function startPositionUpdates() {
    setInterval(() => {
        document.getElementById("status").innerText += ` - Position: (${userData.pos_x}, ${userData.pos_y}, ${userData.pos_z})`;
    }, 1000);
}

if (apiKey) {
    verifyUser();
}

// Dragging functionality
dragElement(document.getElementById("app"));

function dragElement(elmnt) {
    const header = document.getElementById("windowHeader");
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    if (header) {
        header.onmousedown = dragMouseDown;
    } else {
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
