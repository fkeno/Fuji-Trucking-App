const API_BASE_URL = "https://tycoon-2epova.users.cfx.re/status"; // Change if necessary
let apiKey = localStorage.getItem("tycoonApiKey");
let userData = {};
let recipes = [];
let locations = [];
let vehicles = {};

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
        document.getElementById("location").innerText = `Position: (${userData.pos_x}, ${userData.pos_y}, ${userData.pos_z})`;
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

// Resizing functionality
resizeElement(document.getElementById("app"));

function resizeElement(elmnt) {
    const resizeHandle = document.getElementById("resizeHandle");
    let startX, startY, startWidth, startHeight;

    resizeHandle.addEventListener("mousedown", initResize);

    function initResize(e) {
        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(document.defaultView.getComputedStyle(elmnt).width, 10);
        startHeight = parseInt(document.defaultView.getComputedStyle(elmnt).height, 10);
        document.documentElement.addEventListener("mousemove", doResize);
        document.documentElement.addEventListener("mouseup", stopResize);
    }

    function doResize(e) {
        elmnt.style.width = (startWidth + e.clientX - startX) + "px";
        elmnt.style.height = (startHeight + e.clientY - startY) + "px";
    }

    function stopResize() {
        document.documentElement.removeEventListener("mousemove", doResize);
        document.documentElement.removeEventListener("mouseup", stopResize);
    }
}

// Load JSON data
fetch('recipes.json')
    .then(response => response.json())
    .then(data => recipes = data);

fetch('locations.json')
    .then(response => response.json())
    .then(data => locations = data);

fetch('vehicles.json')
    .then(response => response.json())
    .then(data => vehicles = data);

document.getElementById("settingsButton").addEventListener("click", openSettings);
document.getElementById("playButton").addEventListener("click", startManufacturing);
document.getElementById("stopButton").addEventListener("click", stopManufacturing);

function openSettings() {
    alert("Settings page will be implemented here.");
}

function startManufacturing() {
    let item = prompt("Enter the item you want to manufacture:");
    if (item) {
        // Check cache for progress or start new process
        alert(`Starting manufacturing process for ${item}`);
    }
}

function stopManufacturing() {
    if (confirm("Are you sure you want to stop the current manufacturing process?")) {
        alert("Manufacturing process stopped.");
    }
}
