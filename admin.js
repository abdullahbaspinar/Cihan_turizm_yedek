// ===== ADMIN PANEL =====
// Full admin panel with content, image, and WhatsApp management

// Basic authentication check
function checkAdminAuthentication() {
    const session = localStorage.getItem('admin_session');
    if (!session) {
        window.location.href = 'index.html';
        return false;
    }
    
    try {
        const sessionData = JSON.parse(session);
        if (!sessionData.loggedIn) {
            localStorage.removeItem('admin_session');
            window.location.href = 'index.html';
            return false;
        }
        return true;
    } catch (e) {
        localStorage.removeItem('admin_session');
        window.location.href = 'index.html';
        return false;
    }
}

// Enhanced save function with server sync
function secureSave(key, data) {
    try {
        // Save to localStorage
        localStorage.setItem(key, JSON.stringify(data));
        
        // Also save to sessionStorage for cross-tab sync
        sessionStorage.setItem(key, JSON.stringify(data));
        
        // Try to sync with server (if available)
        if (typeof window.syncToServer === 'function') {
            window.syncToServer(key, data);
        }
        
        return true;
    } catch (e) {
        console.error('Kaydetme hatası:', e);
        return false;
    }
}

// Enhanced load function with fallback
function secureLoad(key) {
    try {
        // Try localStorage first
        let data = localStorage.getItem(key);
        
        // If not in localStorage, try sessionStorage
        if (!data) {
            data = sessionStorage.getItem(key);
        }
        
        // If still no data, try to load from server
        if (!data && typeof window.loadFromServer === 'function') {
            data = window.loadFromServer(key);
        }
        
        if (!data) return null;
        return JSON.parse(data);
    } catch (e) {
        console.error('Yükleme hatası:', e);
        return null;
    }
}

// ===== ADMIN PANEL CONFIGURATION =====
const ADMIN_CONFIG = {
    // WhatsApp settings
    whatsappDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    whatsappMessages: ['visa-message', 'ticketing-message', 'contact-message']
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication first
    if (!checkAdminAuthentication()) {
        return;
    }
    
    initializeAdminPanel();
});

function initializeAdminPanel() {
    // Load saved data
    loadSavedData();
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize tabs
    initializeTabs();
    
    // Initialize image uploads

    
    // Update dashboard
    updateDashboard();
    
    // Auto-save functionality
    initializeAutoSave();
    
    // Real-time updates
    setInterval(updateDashboard, 30000);
    
    // Initialize Firebase (optional)
    if (typeof initializeFirebase === 'function') {
        initializeFirebase();
    }
}

// ===== NAVIGATION =====
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const sectionTitle = document.getElementById('section-title');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Show corresponding section
            const targetSection = this.getAttribute('data-section');
            const section = document.getElementById(targetSection);
            if (section) {
                section.classList.add('active');
                sectionTitle.textContent = this.querySelector('span:last-child').textContent;
            }
        });
    });
    
    // Sidebar toggle for mobile
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('admin-sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
        });
    }
}

// ===== TABS =====
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding content
            const content = document.getElementById(`${targetTab}-tab`);
            if (content) {
                content.classList.add('active');
            }
        });
    });
}

// ===== DATA MANAGEMENT =====
function loadSavedData() {
    // Check authentication first
    if (!checkAdminAuthentication()) {
        return;
    }
    

    
    // Load WhatsApp settings
    const savedWhatsApp = localStorage.getItem('whatsapp_config');
    if (savedWhatsApp) {
        const whatsapp = JSON.parse(savedWhatsApp);
        
        // Load daily numbers
        const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        dayNames.forEach((day, index) => {
            const morningInput = document.getElementById(`${day}-morning`);
            const eveningInput = document.getElementById(`${day}-evening`);
            
            if (whatsapp.dailyNumbers && whatsapp.dailyNumbers[index]) {
                if (morningInput) morningInput.value = whatsapp.dailyNumbers[index].morning || '';
                if (eveningInput) eveningInput.value = whatsapp.dailyNumbers[index].evening || '';
            }
        });
        
        // Load messages
        if (whatsapp.messages) {
            Object.keys(whatsapp.messages).forEach(key => {
                const element = document.getElementById(`${key}-message`);
                if (element) {
                    element.value = whatsapp.messages[key];
                }
            });
        }
        
        // Debug log
        console.log('WhatsApp ayarları yüklendi:', whatsapp);
    }
    
    // Load site settings
    const savedSettings = localStorage.getItem('admin_settings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        Object.keys(settings).forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (element) {
                element.value = settings[fieldId];
            }
        });
    }
}

// ===== SAVE ALL CHANGES =====
function saveAllChanges() {
    // Check authentication first
    if (!checkAdminAuthentication()) {
        showNotification('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.', 'error');
        return;
    }
    

    

    
    // Save WhatsApp settings
    const whatsappData = {
        dailyNumbers: {},
        messages: {}
    };
    
    // Save daily numbers
    ADMIN_CONFIG.whatsappDays.forEach((day, index) => {
        const morningInput = document.getElementById(`${day}-morning`);
        const eveningInput = document.getElementById(`${day}-evening`);
        
        if (morningInput && eveningInput) {
            // Numaraları temizle (sadece rakamları al)
            const morningNumber = morningInput.value.trim().replace(/\D/g, '');
            const eveningNumber = eveningInput.value.trim().replace(/\D/g, '');
            
            whatsappData.dailyNumbers[index] = {
                morning: morningNumber,
                evening: eveningNumber
            };
        }
    });
    
    // Save messages
    ADMIN_CONFIG.whatsappMessages.forEach(messageKey => {
        const element = document.getElementById(messageKey);
        if (element) {
            const key = messageKey.replace('-message', '');
            whatsappData.messages[key] = element.value;
        }
    });
    
    localStorage.setItem('whatsapp_config', JSON.stringify(whatsappData));
    
    // Debug log
    console.log('WhatsApp ayarları kaydedildi:', whatsappData);
    
    // Test için güncel numarayı hesapla ve göster
    const now = new Date();
    const dayOfWeek = now.getDay();
    const hour = now.getHours();
    
    // Gece saatlerinde (18:00-09:00) bir önceki günün gece numarası kullanılmalı
    let effectiveDayOfWeek = dayOfWeek;
    let isNightTime = false;
    
    if (hour >= 18 || hour < 9) {
        isNightTime = true;
        // Gece saatlerinde bir önceki günün gece numarası kullanılır
        if (hour >= 18) {
            // 18:00'dan sonra aynı günün gece numarası
            effectiveDayOfWeek = dayOfWeek;
        } else {
            // 09:00'dan önce bir önceki günün gece numarası
            effectiveDayOfWeek = (dayOfWeek + 6) % 7; // Bir önceki gün
        }
    }
    
    let adminIndex;
    if (effectiveDayOfWeek === 0) {
        adminIndex = 6;
    } else {
        adminIndex = effectiveDayOfWeek - 1;
    }
    
    console.log('Test - Güncel Durum:', {
        originalDayOfWeek: dayOfWeek,
        effectiveDayOfWeek: effectiveDayOfWeek,
        adminIndex: adminIndex,
        hour: hour,
        isNightTime: isNightTime,
        currentDayNumber: whatsappData.dailyNumbers[adminIndex],
        isDayTime: hour >= 9 && hour < 18,
        expectedNumber: (hour >= 9 && hour < 18) 
            ? whatsappData.dailyNumbers[adminIndex]?.morning 
            : whatsappData.dailyNumbers[adminIndex]?.evening
    });
    
    // Save site settings
    const settingsData = {};
    const settingsFields = ['site-title', 'site-description', 'admin-username', 'admin-password'];
    settingsFields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            settingsData[fieldId] = element.value;
        }
    });
    localStorage.setItem('admin_settings', JSON.stringify(settingsData));
    
    showNotification('Tüm değişiklikler başarıyla kaydedildi!', 'success');
    


    // Save WhatsApp data to Firebase Realtime Database
    if (typeof saveWhatsAppDataToFirebase === 'function') {
        console.log('Firebase fonksiyonu bulundu, kaydetme başlatılıyor...');
        console.log('Kaydedilecek veri:', whatsappData);
        
        // Firebase kaydetme işlemini timeout ile sınırla
        const firebasePromise = saveWhatsAppDataToFirebase(whatsappData);
        const timeoutPromise = new Promise((resolve) => {
            setTimeout(() => resolve(false), 10000); // 10 saniye timeout
        });
        
        Promise.race([firebasePromise, timeoutPromise]).then(success => {
            console.log('Firebase kaydetme sonucu:', success);
            if (success) {
                console.log('Firebase Realtime Database\'e kaydedildi - Cross-device sync aktif');
                showNotification('WhatsApp ayarları Firebase\'de senkronize edildi!', 'success');
            } else {
                console.error('Firebase kaydı başarısız veya timeout');
                showNotification('Yerel kayıt başarılı, Firebase kaydı başarısız', 'warning');
            }
        }).catch(error => {
            console.error('Firebase kaydetme hatası:', error);
            console.error('Hata detayları:', {
                message: error.message,
                code: error.code,
                stack: error.stack
            });
            showNotification('Firebase kaydetme hatası: ' + error.message, 'error');
        });
    } else {
        console.warn('saveWhatsAppDataToFirebase fonksiyonu bulunamadı, Firebase yüklenmemiş olabilir');
        console.log('Mevcut window fonksiyonları:', Object.keys(window).filter(key => key.includes('firebase') || key.includes('Firebase')));
        // Fallback to server sync
        fetch('admin/save.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                whatsapp: whatsappData
            })
        })
        .then(res => res.json())
        .then(res => {
            if (res.status === 'success') {
                console.log('Sunucuya kaydedildi - Cross-device sync aktif');
                showNotification('Değişiklikler tüm cihazlarda senkronize edildi!', 'success');
            } else {
                console.error('Sunucu kaydı başarısız:', res.message);
                showNotification('Yerel kayıt başarılı, sunucu kaydı başarısız', 'warning');
            }
        })
        .catch(error => {
            console.error('Sunucu kaydı hatası:', error);
            showNotification('Yerel kayıt başarılı, sunucu bağlantısı yok', 'warning');
        });
    }
    
    updateDashboard();
}



// ===== DASHBOARD =====
function updateDashboard() {
    // Update last update time
    const lastUpdateElement = document.getElementById('last-update-time');
    if (lastUpdateElement) {
        lastUpdateElement.textContent = new Date().toLocaleString('tr-TR');
    }
    
    // Update current WhatsApp number
    const whatsappData = localStorage.getItem('whatsapp_config');
    if (whatsappData) {
        const whatsapp = JSON.parse(whatsappData);
        const now = new Date();
        const dayOfWeek = now.getDay();
        const hour = now.getHours();
        
        // Gece saatlerinde (18:00-09:00) bir önceki günün gece numarası kullanılmalı
        let effectiveDayOfWeek = dayOfWeek;
        
        if (hour >= 18 || hour < 9) {
            // Gece saatlerinde bir önceki günün gece numarası kullanılır
            if (hour >= 18) {
                // 18:00'dan sonra aynı günün gece numarası
                effectiveDayOfWeek = dayOfWeek;
            } else {
                // 09:00'dan önce bir önceki günün gece numarası
                effectiveDayOfWeek = (dayOfWeek + 6) % 7; // Bir önceki gün
            }
        }
        
        // Admin panelindeki index'e çevir (0=Pazar -> 6, 1=Pazartesi -> 0, 2=Salı -> 1, ...)
        let adminIndex;
        if (effectiveDayOfWeek === 0) { // Pazar
            adminIndex = 6;
        } else {
            adminIndex = effectiveDayOfWeek - 1; // Pazartesi=0, Salı=1, ...
        }
        
        if (whatsapp.dailyNumbers && whatsapp.dailyNumbers[adminIndex]) {
            const currentNumber = (hour >= 9 && hour < 18) 
                ? whatsapp.dailyNumbers[adminIndex].morning 
                : whatsapp.dailyNumbers[adminIndex].evening;
            
            const currentElement = document.getElementById('current-whatsapp');
            if (currentElement) {
                currentElement.textContent = currentNumber || '-';
            }
        }
    }
}

// ===== AUTO-SAVE =====
function initializeAutoSave() {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', debounce(() => {
            // Auto-save after 2 seconds of inactivity
            setTimeout(saveAllChanges, 2000);
        }, 1000));
    });
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    container.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===== QUICK ACTIONS =====
function showWhatsAppSettings() {
    const whatsappNav = document.querySelector('[data-section="whatsapp"]');
    if (whatsappNav) {
        whatsappNav.click();
    }
}

function previewChanges() {
    // Open main site in new tab to preview changes
    window.open('index.html', '_blank');
}

// ===== FIREBASE INITIALIZATION =====
function initializeFirebase() {
    // Check if Firebase is available
    if (typeof firebase === 'undefined') {
        console.log('Firebase SDK yüklenmedi, yerel modda çalışıyor');
        return;
    }
    
    console.log('Firebase SDK yüklendi, Firebase fonksiyonları kontrol ediliyor...');
    
    // Check if Firebase functions are available
    if (typeof saveWhatsAppDataToFirebase === 'function') {
        console.log('Firebase WhatsApp fonksiyonları mevcut');
    } else {
        console.warn('Firebase WhatsApp fonksiyonları yüklenmedi');
    }
    
    // Load WhatsApp data from Firebase
    if (typeof loadWhatsAppDataFromFirebase === 'function') {
        loadWhatsAppDataFromFirebase().then(success => {
            if (success) {
                showNotification('Firebase\'den WhatsApp verileri yüklendi!', 'success');
                updateDashboard();
            } else {
                console.log('Firebase\'den veri yüklenemedi, yerel veriler kullanılıyor');
            }
        }).catch(error => {
            console.error('Firebase veri yükleme hatası:', error);
        });
    }
    
    // Start real-time sync for WhatsApp
    if (typeof listenForWhatsAppUpdates === 'function') {
        listenForWhatsAppUpdates();
        console.log('Firebase real-time sync başlatıldı');
    }
}

// ===== LOGOUT =====
function logoutAdmin() {
    if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
        // Clear session
        localStorage.removeItem('admin_session');
        
        // Sign out from Firebase (optional)
        if (typeof signOut === 'function') {
            signOut().then(() => {
                console.log('Firebase\'den çıkış yapıldı');
            }).catch(error => {
                console.log('Firebase çıkış hatası:', error);
            });
        }
        
        // Redirect to main page
        window.location.href = 'index.html';
    }
}



// ===== GLOBAL FUNCTIONS =====
window.saveAllChanges = saveAllChanges;
window.showWhatsAppSettings = showWhatsAppSettings;
window.previewChanges = previewChanges;
window.logoutAdmin = logoutAdmin;

// Test Firebase connection function
window.testFirebaseConnection = function() {
    console.log('Firebase bağlantı testi başlatılıyor...');
    
    // Check Firebase SDK
    if (typeof firebase === 'undefined') {
        showNotification('Firebase SDK yüklenmemiş!', 'error');
        return;
    }
    
    console.log('Firebase SDK mevcut:', firebase);
    
    // Check Firebase app
    try {
        const app = firebase.app();
        console.log('Firebase app:', app);
        console.log('Firebase app name:', app.name);
    } catch (error) {
        console.error('Firebase app hatası:', error);
        showNotification('Firebase app hatası: ' + error.message, 'error');
        return;
    }
    
    // Check database
    try {
        const database = firebase.database();
        console.log('Firebase database:', database);
    } catch (error) {
        console.error('Firebase database hatası:', error);
        showNotification('Firebase database hatası: ' + error.message, 'error');
        return;
    }
    
    // Check functions
    if (typeof saveWhatsAppDataToFirebase === 'function') {
        showNotification('Firebase fonksiyonları mevcut!', 'success');
        
        // Test data
        const testData = {
            dailyNumbers: {
                0: { morning: '905551234567', evening: '905551234568' },
                1: { morning: '905551234569', evening: '905551234570' }
            },
            messages: {
                visa: 'Test mesajı - Vize',
                ticketing: 'Test mesajı - Biletleme',
                contact: 'Test mesajı - İletişim'
            }
        };
        
        console.log('Test verisi hazırlandı:', testData);
        
        saveWhatsAppDataToFirebase(testData).then(success => {
            console.log('Firebase test sonucu:', success);
            if (success) {
                showNotification('Firebase test başarılı! Veri kaydedildi.', 'success');
            } else {
                showNotification('Firebase test başarısız!', 'error');
            }
        }).catch(error => {
            console.error('Firebase test hatası:', error);
            showNotification('Firebase test hatası: ' + error.message, 'error');
        });
    } else {
        console.error('saveWhatsAppDataToFirebase fonksiyonu bulunamadı');
        showNotification('Firebase fonksiyonları yüklenmemiş!', 'error');
    }
};

// Simple Firebase test function
window.testSimpleFirebase = function() {
    console.log('Basit Firebase testi başlatılıyor...');
    
    if (typeof testSimpleFirebaseWrite === 'function') {
        testSimpleFirebaseWrite().then(success => {
            if (success) {
                showNotification('Basit Firebase testi başarılı!', 'success');
            } else {
                showNotification('Basit Firebase testi başarısız!', 'error');
            }
        }).catch(error => {
            console.error('Basit Firebase test hatası:', error);
            showNotification('Basit Firebase test hatası: ' + error.message, 'error');
        });
    } else {
        showNotification('testSimpleFirebaseWrite fonksiyonu bulunamadı!', 'error');
    }
};

// Test WhatsApp number function
window.testWhatsAppNumber = function() {
    const whatsappData = localStorage.getItem('whatsapp_config');
    if (!whatsappData) {
        showNotification('WhatsApp ayarları bulunamadı!', 'error');
        return;
    }
    
    const whatsapp = JSON.parse(whatsappData);
    const now = new Date();
    const dayOfWeek = now.getDay();
    const hour = now.getHours();
    
    // Gece saatlerinde (18:00-09:00) bir önceki günün gece numarası kullanılmalı
    let effectiveDayOfWeek = dayOfWeek;
    let isNightTime = false;
    
    if (hour >= 18 || hour < 9) {
        isNightTime = true;
        // Gece saatlerinde bir önceki günün gece numarası kullanılır
        if (hour >= 18) {
            // 18:00'dan sonra aynı günün gece numarası
            effectiveDayOfWeek = dayOfWeek;
        } else {
            // 09:00'dan önce bir önceki günün gece numarası
            effectiveDayOfWeek = (dayOfWeek + 6) % 7; // Bir önceki gün
        }
    }
    
    // Admin panelindeki index'e çevir
    let adminIndex;
    if (effectiveDayOfWeek === 0) {
        adminIndex = 6;
    } else {
        adminIndex = effectiveDayOfWeek - 1;
    }
    
    const dayNames = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
    const currentDayName = dayNames[adminIndex];
    const isDayTime = hour >= 9 && hour < 18;
    const timeType = isDayTime ? 'Sabah' : 'Gece';
    
    const currentNumber = isDayTime 
        ? whatsapp.dailyNumbers[adminIndex]?.morning 
        : whatsapp.dailyNumbers[adminIndex]?.evening;
    
    const resultDiv = document.getElementById('test-result');
    if (resultDiv) {
        resultDiv.innerHTML = `
            <div class="test-info">
                <p><strong>Gerçek Gün:</strong> ${dayNames[dayOfWeek] || 'Bilinmiyor'}</p>
                <p><strong>Hesaplanan Gün:</strong> ${currentDayName}</p>
                <p><strong>Saat:</strong> ${hour}:00</p>
                <p><strong>Zaman:</strong> ${timeType} (${isDayTime ? '09:00-18:00' : '18:00-09:00'})</p>
                <p><strong>Gece Saati:</strong> ${isNightTime ? 'Evet' : 'Hayır'}</p>
                <p><strong>Admin Index:</strong> ${adminIndex}</p>
                <p><strong>Aktif Numara:</strong> ${currentNumber || 'Numara bulunamadı'}</p>
            </div>
        `;
    }
    
    console.log('WhatsApp Test Sonucu:', {
        originalDayOfWeek: dayOfWeek,
        effectiveDayOfWeek: effectiveDayOfWeek,
        adminIndex: adminIndex,
        currentDayName: currentDayName,
        hour: hour,
        isNightTime: isNightTime,
        isDayTime: isDayTime,
        timeType: timeType,
        currentNumber: currentNumber,
        allNumbers: whatsapp.dailyNumbers
    });
    
    showNotification('Test tamamlandı! Sonuçları aşağıda görebilirsiniz.', 'success');
}; 