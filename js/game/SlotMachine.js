// SlotMachine.js - Kelas SlotMachine yang diperbarui untuk asset baru

class SlotMachine {
    constructor(config) {
        // Konfigurasi dasar
        this.config = config;
        this.reelsCount = config.reels.count || 5;
        this.rowsCount = config.reels.rows || 3;
        this.payLines = config.payLines || [];
        
        // State permainan
        this.bet = config.defaultBet || 50000;
        this.activeLines = config.defaultLines || 5;
        this.balance = 0;
        this.lastWin = 0;
        this.totalSpins = 0;
        this.consecutiveLosses = 0;
        this.isSpinning = false;
        this.autoSpinEnabled = false;
        this.soundEnabled = true;
        
        // Progressive jackpot
        this.progressiveJackpot = config.jackpot ? config.jackpot.basePayout : 100000;
        
        // Komponen game
        this.symbolManager = null;
        this.reels = [];
        
        // Callback handlers
        this.onSpinStart = null;
        this.onSpinComplete = null;
        this.onWin = null;
        this.onBalanceChange = null;
        this.onError = null;
        this.onJackpot = null;
        
        // Admin mode settings
        this.adminSettings = null;
        this.nextForcedResult = null;
        
        // Username untuk admin tracking
        this.currentUsername = null;
        
        // Inisialisasi komponen
        this.init();
        
        // Set global reference untuk akses dari Symbol class
        window.slotMachine = this;
    }
    
    // Inisialisasi mesin slot
    init() {
        // Buat symbol manager
        this.symbolManager = new SymbolManager(this.config.reels.symbols);
        
        // Buat reels
        for (let i = 0; i < this.reelsCount; i++) {
            const reel = new Reel(i, this.symbolManager, {
                rows: this.rowsCount,
                spinDuration: this.config.spinDuration
            });
            this.reels.push(reel);
        }
        
        // Load pengaturan admin
        this.loadAdminSettings();
    }
    
    // Load pengaturan admin dari localStorage
    loadAdminSettings() {
        this.adminSettings = getAdminSettings();
    }
    
    // Set username untuk pelacakan admin
    setUsername(username) {
        this.currentUsername = username;
        
        // Load saldo dari localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.username === username);
        if