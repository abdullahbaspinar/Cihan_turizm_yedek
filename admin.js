// ===== SECURITY MEASURES COMPLETELY REMOVED =====
// All security measures have been completely removed for development purposes

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
    // Content management
    contentFields: {
        hero: ['hero-title-1', 'hero-title-2', 'hero-title-3', 'hero-subtitle', 'hero-cta-text'],
        about: ['vision-title', 'vision-description', 'mission-title', 'mission-description'],
        services: ['services-title', 'services-subtitle', 'visa-title', 'visa-description', 'ticketing-title', 'ticketing-description'],
        contact: ['contact-title', 'contact-subtitle', 'contact-address', 'contact-phone', 'contact-email'],
        footer: ['footer-description', 'footer-copyright']
    },
    
    // Image management
    imageFields: {
        hero: ['hero-image-1', 'hero-image-2', 'hero-image-3', 'hero-image-4', 'hero-image-5'],
        partners: ['partner-thy', 'partner-turmed', 'partner-paribu', 'partner-papara', 'partner-okx', 'partner-architect', 'partner-gamak']
    },
    
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
    initializeImageUploads();
    
    // Update dashboard
    updateDashboard();
    
    // Auto-save functionality
    initializeAutoSave();
    
    // Real-time updates
    setInterval(updateDashboard, 30000);
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
    
    // Load content data
    const savedContent = secureLoad('admin_content');
    if (savedContent) {
        Object.keys(savedContent).forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (element) {
                element.value = savedContent[fieldId];
            }
        });
    }
    
    // Load image data
    const savedImages = secureLoad('admin_images');
    if (savedImages) {
        Object.keys(savedImages).forEach(imageId => {
            const element = document.getElementById(imageId);
            if (element) {
                element.src = savedImages[imageId];
            }
        });
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

function saveAllChanges() {
    // Check authentication first
    if (!checkAdminAuthentication()) {
        showNotification('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.', 'error');
        return;
    }
    
    // Save content
    const contentData = {};
    Object.values(ADMIN_CONFIG.contentFields).flat().forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            contentData[fieldId] = element.value;
        }
    });
    secureSave('admin_content', contentData);
    
    // Save images
    const imageData = {};
    Object.values(ADMIN_CONFIG.imageFields).flat().forEach(imageId => {
        const element = document.getElementById(imageId);
        if (element) {
            imageData[imageId] = element.src;
        }
    });
    secureSave('admin_images', imageData);
    
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
    
    let adminIndex;
    if (dayOfWeek === 0) {
        adminIndex = 6;
    } else {
        adminIndex = dayOfWeek - 1;
    }
    
    console.log('Test - Güncel Durum:', {
        dayOfWeek: dayOfWeek,
        adminIndex: adminIndex,
        hour: hour,
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
    
    // Save to server for cross-device sync
    fetch('admin/save.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            content: contentData,
            images: imageData,
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
    updateDashboard();
}

// ===== IMAGE MANAGEMENT =====
function initializeImageUploads() {
    // Add event listeners for all file inputs
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                handleImageUpload(file, this);
            }
        });
    });
}

function handleImageUpload(file, inputElement) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showNotification('Lütfen geçerli bir görsel dosyası seçin!', 'error');
        return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('Dosya boyutu 5MB\'dan küçük olmalıdır!', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageId = inputElement.id.replace('-file', '-image');
        const imageElement = document.getElementById(imageId);
        
        if (imageElement) {
            imageElement.src = e.target.result;
            showNotification('Görsel başarıyla yüklendi!', 'success');
        }
    };
    
    reader.readAsDataURL(file);
}

function previewImage(input, imageId) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageElement = document.getElementById(imageId);
            if (imageElement) {
                imageElement.src = e.target.result;
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// ===== DASHBOARD =====
function updateDashboard() {
    // Update edited content count
    const contentData = localStorage.getItem('admin_content');
    if (contentData) {
        const content = JSON.parse(contentData);
        const editedCount = Object.keys(content).length;
        const editedElement = document.getElementById('edited-content-count');
        if (editedElement) {
            editedElement.textContent = editedCount;
        }
    }
    
    // Update changed images count
    const imageData = localStorage.getItem('admin_images');
    if (imageData) {
        const images = JSON.parse(imageData);
        const changedCount = Object.keys(images).length;
        const changedElement = document.getElementById('changed-images-count');
        if (changedElement) {
            changedElement.textContent = changedCount;
        }
    }
    
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
        
        // Admin panelindeki index'e çevir (0=Pazar -> 6, 1=Pazartesi -> 0, 2=Salı -> 1, ...)
        let adminIndex;
        if (dayOfWeek === 0) { // Pazar
            adminIndex = 6;
        } else {
            adminIndex = dayOfWeek - 1; // Pazartesi=0, Salı=1, ...
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
function showContentEditor() {
    const contentNav = document.querySelector('[data-section="content"]');
    if (contentNav) {
        contentNav.click();
    }
}

function showImageManager() {
    const imagesNav = document.querySelector('[data-section="images"]');
    if (imagesNav) {
        imagesNav.click();
    }
}

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

// ===== DATA EXPORT/IMPORT =====
function exportData() {
    const data = {
        content: JSON.parse(localStorage.getItem('admin_content') || '{}'),
        images: JSON.parse(localStorage.getItem('admin_images') || '{}'),
        whatsapp: JSON.parse(localStorage.getItem('whatsapp_config') || '{}'),
        settings: JSON.parse(localStorage.getItem('admin_settings') || '{}'),
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cihanturizm-admin-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Veriler başarıyla dışa aktarıldı!', 'success');
}

function importData() {
    const input = document.getElementById('import-file');
    if (input) {
        input.click();
    }
}

function handleImportFile(input) {
    const file = input.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Import content
            if (data.content) {
                localStorage.setItem('admin_content', JSON.stringify(data.content));
                Object.keys(data.content).forEach(fieldId => {
                    const element = document.getElementById(fieldId);
                    if (element) {
                        element.value = data.content[fieldId];
                    }
                });
            }
            
            // Import images
            if (data.images) {
                localStorage.setItem('admin_images', JSON.stringify(data.images));
                Object.keys(data.images).forEach(imageId => {
                    const element = document.getElementById(imageId);
                    if (element) {
                        element.src = data.images[imageId];
                    }
                });
            }
            
            // Import WhatsApp settings
            if (data.whatsapp) {
                localStorage.setItem('whatsapp_config', JSON.stringify(data.whatsapp));
                
                // Update form fields
                const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                dayNames.forEach((day, index) => {
                    const morningInput = document.getElementById(`${day}-morning`);
                    const eveningInput = document.getElementById(`${day}-evening`);
                    
                    if (data.whatsapp.dailyNumbers && data.whatsapp.dailyNumbers[index]) {
                        if (morningInput) morningInput.value = data.whatsapp.dailyNumbers[index].morning || '';
                        if (eveningInput) eveningInput.value = data.whatsapp.dailyNumbers[index].evening || '';
                    }
                });
                
                if (data.whatsapp.messages) {
                    Object.keys(data.whatsapp.messages).forEach(key => {
                        const element = document.getElementById(`${key}-message`);
                        if (element) {
                            element.value = data.whatsapp.messages[key];
                        }
                    });
                }
            }
            
            // Import settings
            if (data.settings) {
                localStorage.setItem('admin_settings', JSON.stringify(data.settings));
                Object.keys(data.settings).forEach(fieldId => {
                    const element = document.getElementById(fieldId);
                    if (element) {
                        element.value = data.settings[fieldId];
                    }
                });
            }
            
            showNotification('Veriler başarıyla içe aktarıldı!', 'success');
            updateDashboard();
            
        } catch (error) {
            showNotification('Dosya formatı geçersiz!', 'error');
            console.error('Import error:', error);
        }
    };
    
    reader.readAsText(file);
    input.value = ''; // Reset input
}

function resetData() {
    if (confirm('Tüm verileri sıfırlamak istediğinizden emin misiniz? Bu işlem geri alınamaz!')) {
        localStorage.removeItem('admin_content');
        localStorage.removeItem('admin_images');
        localStorage.removeItem('whatsapp_config');
        localStorage.removeItem('admin_settings');
        
        // Reset form fields
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.value = '';
        });
        
        // Reset images to original
        const images = document.querySelectorAll('img[id*="-image"]');
        images.forEach(img => {
            img.src = img.getAttribute('data-original') || img.src;
        });
        
        showNotification('Tüm veriler sıfırlandı!', 'success');
        updateDashboard();
    }
}

// ===== LOGOUT =====
function logoutAdmin() {
    if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
        // Clear session
        localStorage.removeItem('admin_session');
        
        // Redirect to main page
        window.location.href = 'index.html';
    }
}

// ===== DYNAMIC IMAGE MANAGEMENT =====
function addHeroImage() {
    const grid = document.getElementById('hero-images-grid');
    const currentCount = grid.children.length;
    const newIndex = currentCount + 1;
    
    const newImageItem = document.createElement('div');
    newImageItem.className = 'image-item';
    newImageItem.innerHTML = `
        <label>Hero Görsel ${newIndex}</label>
        <div class="image-preview">
            <img id="hero-image-${newIndex}" src="assets/anasayfa/header-1.webp" alt="Hero ${newIndex}">
        </div>
        <input type="file" id="hero-file-${newIndex}" accept="image/*" onchange="previewImage(this, 'hero-image-${newIndex}')">
        <button class="upload-btn" onclick="document.getElementById('hero-file-${newIndex}').click()">
            <span class="material-icons">upload</span>
            Görsel Yükle
        </button>
    `;
    
    grid.appendChild(newImageItem);
    
    // Update admin config
    ADMIN_CONFIG.imageFields.hero.push(`hero-image-${newIndex}`);
    
    showNotification(`Hero Görsel ${newIndex} eklendi!`, 'success');
}

function removeHeroImage() {
    const grid = document.getElementById('hero-images-grid');
    const currentCount = grid.children.length;
    
    if (currentCount <= 1) {
        showNotification('En az 1 görsel olmalıdır!', 'error');
        return;
    }
    
    const lastItem = grid.lastElementChild;
    const imageId = lastItem.querySelector('img').id;
    
    // Remove from DOM
    grid.removeChild(lastItem);
    
    // Remove from admin config
    const index = ADMIN_CONFIG.imageFields.hero.indexOf(imageId);
    if (index > -1) {
        ADMIN_CONFIG.imageFields.hero.splice(index, 1);
    }
    
    // Update labels
    const items = grid.querySelectorAll('.image-item');
    items.forEach((item, index) => {
        const label = item.querySelector('label');
        if (label) {
            label.textContent = `Hero Görsel ${index + 1}`;
        }
    });
    
    showNotification('Son görsel silindi!', 'success');
}

// ===== GLOBAL FUNCTIONS =====
window.saveAllChanges = saveAllChanges;
window.showContentEditor = showContentEditor;
window.showImageManager = showImageManager;
window.showWhatsAppSettings = showWhatsAppSettings;
window.previewChanges = previewChanges;
window.exportData = exportData;
window.importData = importData;
window.resetData = resetData;
window.logoutAdmin = logoutAdmin;
window.previewImage = previewImage;
window.handleImportFile = handleImportFile;
window.addHeroImage = addHeroImage;
window.removeHeroImage = removeHeroImage;

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
    
    // Admin panelindeki index'e çevir
    let adminIndex;
    if (dayOfWeek === 0) {
        adminIndex = 6;
    } else {
        adminIndex = dayOfWeek - 1;
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
                <p><strong>Gün:</strong> ${currentDayName}</p>
                <p><strong>Saat:</strong> ${hour}:00</p>
                <p><strong>Zaman:</strong> ${timeType} (${isDayTime ? '09:00-18:00' : '18:00-09:00'})</p>
                <p><strong>Aktif Numara:</strong> ${currentNumber || 'Numara bulunamadı'}</p>
                <p><strong>Admin Index:</strong> ${adminIndex}</p>
            </div>
        `;
    }
    
    console.log('WhatsApp Test Sonucu:', {
        dayOfWeek: dayOfWeek,
        adminIndex: adminIndex,
        currentDayName: currentDayName,
        hour: hour,
        isDayTime: isDayTime,
        timeType: timeType,
        currentNumber: currentNumber,
        allNumbers: whatsapp.dailyNumbers
    });
    
    showNotification('Test tamamlandı! Sonuçları aşağıda görebilirsiniz.', 'success');
}; 