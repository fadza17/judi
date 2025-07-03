// Ini adalah perbaikan untuk bagian checkUserLogin di game.js

// --- Auth Functions ---

// Fungsi untuk cek user login
function checkUserLogin() {
    // Cek localStorage untuk session
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    console.log("Current user from localStorage:", currentUser);
    
    if (!currentUser) {
        console.log("No current user found, redirecting to login page");
        // Redirect ke halaman login
        window.location.href = 'index.html';
        return false;
    }
    
    // Set username global dan untuk slot machine
    currentUsername = currentUser.username;
    console.log("Current username set to:", currentUsername);
    
    // Tambahkan username ke slotMachine
    if (slotMachine) {
        slotMachine.setUsername(currentUsername);
    } else {
        console.error("SlotMachine instance is not initialized");
    }
    
    // Cek jika user adalah admin
    if (currentUser.role === 'admin') {
        console.log("User is admin, redirecting to admin page");
        // Redirect ke admin page
        window.location.href = 'admin.html';
        return false;
    }
    
    // Update UI dengan username
    if (usernameDisplay) {
        usernameDisplay.textContent = currentUsername;
    }
    
    return true;
}

// Tambahkan kode ini di bagian initGame() untuk memperbaiki masalah login di game.js

function initGame() {
    console.log("Initializing game...");
    
    // Cek user login, jika tidak valid akan di-redirect
    if (!checkUserLogin()) {
        return; // Hentikan inisialisasi jika login tidak valid
    }
    
    // Buat instance SlotMachine
    slotMachine = new SlotMachine(CONFIG);
    console.log("SlotMachine instance created");
    
    // Set event handlers
    slotMachine.onSpinStart = handleSpinStart;
    slotMachine.onSpinComplete = handleSpinComplete;
    slotMachine.onWin = handleWin;
    slotMachine.onBalanceChange = updateBalanceDisplay;
    slotMachine.onError = showError;
    
    // Set username ke slot machine
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        slotMachine.setUsername(currentUser.username);
        console.log("Username set in slot machine:", currentUser.username);
    }
    
    // Render game
    slotMachine.renderTo(reelsContainer);
    console.log("Game rendered to reels container");
    
    // Setup event listeners
    setupEventListeners();
    
    // Render pay table
    renderPayTable();
    
    // Update UI
    updateUI();
    
    console.log("Game initialization complete");
}

// Fungsi untuk logout yang perlu diperbaiki
function logout() {
    console.log("Logging out user...");
    
    // Clear session
    localStorage.removeItem('currentUser');
    
    // Redirect ke login page
    window.location.href = 'index.html';
}