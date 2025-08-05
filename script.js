// ===== LOADING SCREEN =====
function showPreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.display = 'flex';
        preloader.style.opacity = '1';
    }
}

function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 300);
    }
}

// ===== SECURITY MEASURES COMPLETELY REMOVED =====
// All security measures have been completely removed for development purposes

// ===== WHATSAPP CONFIGURATION =====
const WHATSAPP_CONFIG = {
    // Günlere göre numaralar (0: Pazar, 1: Pazartesi, 2: Salı, 3: Çarşamba, 4: Perşembe, 5: Cuma, 6: Cumartesi)
    dailyNumbers: {
        0: { // Pazar
            morning: '905555555550', // 09:00-18:00
            evening: '905555555551'  // 18:00-09:00
        },
        1: { // Pazartesi
            morning: '905555555552',
            evening: '905555555553'
        },
        2: { // Salı
            morning: '905555555554',
            evening: '905555555555'
        },
        3: { // Çarşamba
            morning: '905555555556',
            evening: '905555555557'
        },
        4: { // Perşembe
            morning: '905555555558',
            evening: '905555555559'
        },
        5: { // Cuma
            morning: '905555555560',
            evening: '905555555561'
        },
        6: { // Cumartesi
            morning: '905555555562',
            evening: '905555555563'
        }
    },
    messages: {
        visa: 'Merhaba! Vize danışmanlığı hizmetleri hakkında bilgi almak istiyorum.',
        ticketing: 'Merhaba! Biletleme hizmetleri hakkında bilgi almak istiyorum.',
        contact: 'Merhaba! Cihanturizm ile iletişime geçmek istiyorum.'
    },
    adminSettings: {
        enabled: true,
        username: 'admin',
        password: 'cihan123'
    }
};

// Enhanced config loading with multiple sources
function loadWhatsAppConfig() {
    // Try multiple sources for config
    let savedConfig = localStorage.getItem('whatsapp_config');
    
    // If not in localStorage, try sessionStorage
    if (!savedConfig) {
        savedConfig = sessionStorage.getItem('whatsapp_config');
    }
    
    // If still no config, try to load from server
    if (!savedConfig && typeof window.loadFromServer === 'function') {
        savedConfig = window.loadFromServer('whatsapp_config');
    }
    
    if (savedConfig) {
        try {
            const config = JSON.parse(savedConfig);
            Object.assign(WHATSAPP_CONFIG, config);
        } catch (e) {
            console.error('WhatsApp config loading error:', e);
        }
    }
}

// ===== WHATSAPP FUNCTIONS =====

// Test function to check WhatsApp configuration
function testWhatsAppConfig() {
    const whatsappData = localStorage.getItem('whatsapp_config');
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
    
    console.log('WhatsApp Config Test:', {
        originalDayOfWeek: dayOfWeek,
        effectiveDayOfWeek: effectiveDayOfWeek,
        adminIndex: adminIndex,
        hour: hour,
        isNightTime: isNightTime,
        isDayTime: hour >= 9 && hour < 18,
        whatsappData: whatsappData,
        currentNumber: getWhatsAppNumber()
    });
    
    if (whatsappData) {
        try {
            const whatsapp = JSON.parse(whatsappData);
            console.log('Parsed WhatsApp Data:', whatsapp);
            
            if (whatsapp.dailyNumbers) {
                console.log('Daily Numbers:', whatsapp.dailyNumbers);
                if (whatsapp.dailyNumbers[adminIndex]) {
                    console.log('Current Day Data:', whatsapp.dailyNumbers[adminIndex]);
                }
            }
            
            // Test WhatsApp button functionality
            const testNumber = getWhatsAppNumber();
            const testMessage = WHATSAPP_CONFIG.messages.contact;
            const cleanNumber = testNumber.replace(/\D/g, '');
            const testUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(testMessage)}`;
            
            console.log('WhatsApp Button Test:', {
                testNumber: testNumber,
                cleanNumber: cleanNumber,
                testMessage: testMessage,
                testUrl: testUrl
            });
        } catch (e) {
            console.error('Parse error:', e);
        }
    }
}

function getWhatsAppNumber() {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 for Sunday, 1 for Monday, etc.
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
    
    // Admin panelindeki index'e çevir (0=Pazar -> 6, 1=Pazartesi -> 0, 2=Salı -> 1, ...)
    let adminIndex;
    if (effectiveDayOfWeek === 0) { // Pazar
        adminIndex = 6;
    } else {
        adminIndex = effectiveDayOfWeek - 1; // Pazartesi=0, Salı=1, ...
    }
    
    // Firebase'den gelen veriyi kontrol et
    const whatsappData = localStorage.getItem('whatsapp_config');
    let dayNumber = null;
    
    if (whatsappData) {
        try {
            const whatsapp = JSON.parse(whatsappData);
            
            // Firebase'den gelen veri yapısını kontrol et
            if (whatsapp.dailyNumbers) {
                // Array formatından object formatına çevir
                if (Array.isArray(whatsapp.dailyNumbers)) {
                    dayNumber = whatsapp.dailyNumbers[adminIndex];
                } else {
                    // Object formatında ise direkt kullan
                    dayNumber = whatsapp.dailyNumbers[adminIndex];
                }
            }
        } catch (e) {
            console.error('WhatsApp config parse error:', e);
        }
    }
    
    // Eğer Firebase'den veri yoksa, varsayılan config'i kullan
    if (!dayNumber) {
        dayNumber = WHATSAPP_CONFIG.dailyNumbers[adminIndex];
    }
    
    // Debug log
    console.log('WhatsApp Numara Debug:', {
        originalDayOfWeek: dayOfWeek,
        effectiveDayOfWeek: effectiveDayOfWeek,
        adminIndex: adminIndex,
        hour: hour,
        isNightTime: isNightTime,
        dayNumber: dayNumber,
        isDayTime: hour >= 9 && hour < 18,
        whatsappData: whatsappData
    });
    
    // Eğer numara yoksa varsayılan numara kullan
    if (!dayNumber) {
        console.warn(`Gün ${effectiveDayOfWeek} (admin index: ${adminIndex}) için numara bulunamadı, varsayılan numara kullanılıyor`);
        return '905555555550';
    }
    
    // 09:00-18:00 arası gündüz numarası, diğer saatler gece numarası
    if (hour >= 9 && hour < 18) {
        return dayNumber.morning || dayNumber.evening || '905555555550';
    } else {
        return dayNumber.evening || dayNumber.morning || '905555555550';
    }
}

function openWhatsApp(type = 'contact') {
    const number = getWhatsAppNumber();
    
    // Firebase'den gelen mesajları kontrol et
    const whatsappData = localStorage.getItem('whatsapp_config');
    let message = WHATSAPP_CONFIG.messages[type] || WHATSAPP_CONFIG.messages.contact;
    
    if (whatsappData) {
        try {
            const whatsapp = JSON.parse(whatsappData);
            if (whatsapp.messages && whatsapp.messages[type]) {
                message = whatsapp.messages[type];
            }
        } catch (e) {
            console.error('WhatsApp messages parse error:', e);
        }
    }
    
    // Numarayı temizle (sadece rakamları al)
    const cleanNumber = number.replace(/\D/g, '');
    
    // WhatsApp URL'sini oluştur
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    
    // Update WhatsApp number element
    const whatsappElement = document.getElementById('whatsapp-number');
    if (whatsappElement) {
        whatsappElement.href = whatsappUrl;
        whatsappElement.textContent = `WhatsApp: +${number}`;
    }
    
    // Debug: URL'yi konsola yazdır
    console.log('WhatsApp Debug:', {
        type: type,
        originalNumber: number,
        cleanNumber: cleanNumber,
        message: message,
        url: whatsappUrl,
        config: WHATSAPP_CONFIG,
        whatsappData: whatsappData
    });
    
    // Yeni sekmede WhatsApp'ı aç
    window.open(whatsappUrl, '_blank');
    
    // Console log
    console.log(`WhatsApp açıldı:`, {
        type: type,
        number: number,
        cleanNumber: cleanNumber,
        message: message,
        url: whatsappUrl
    });
}

// ===== ADMIN PANEL FUNCTIONS =====
function showLoginModal() {
    const modal = document.getElementById('admin-login-modal');
    if (modal) {
        modal.classList.add('show');
        modal.style.display = 'flex';
        
        // Input'ları temizle ve focus'u ayarla
        const usernameInput = document.getElementById('admin-username');
        const passwordInput = document.getElementById('admin-password');
        
        if (usernameInput) {
            usernameInput.value = '';
            usernameInput.focus();
        }
        if (passwordInput) {
            passwordInput.value = '';
        }
        
        // Modal dışına tıklandığında kapatma
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideLoginModal();
            }
        });
        
        // Enter tuşu ile giriş - her input için ayrı event listener
        const handleEnterKey = function(e) {
            if (e.key === 'Enter') {
                e.preventDefault(); // Form submit'i engelle
                loginAdmin();
            }
        };
        
        // Önceki event listener'ları temizle
        if (usernameInput) {
            usernameInput.removeEventListener('keypress', handleEnterKey);
            usernameInput.addEventListener('keypress', handleEnterKey);
        }
        if (passwordInput) {
            passwordInput.removeEventListener('keypress', handleEnterKey);
            passwordInput.addEventListener('keypress', handleEnterKey);
        }
    }
}

function hideLoginModal() {
    const modal = document.getElementById('admin-login-modal');
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        
        // Input'ları temizle
        const usernameInput = document.getElementById('admin-username');
        const passwordInput = document.getElementById('admin-password');
        
        if (usernameInput) usernameInput.value = '';
        if (passwordInput) passwordInput.value = '';
    }
}

function loginAdmin() {
    // Create session for admin access
    const sessionData = {
        loggedIn: true,
        timestamp: Date.now()
    };
    localStorage.setItem('admin_session', JSON.stringify(sessionData));
    
    hideLoginModal();
    showNotification('Admin paneline başarıyla giriş yapıldı!', 'success');
    
    // Redirect to admin page
    setTimeout(() => {
        window.location.href = 'admin.html';
    }, 1000);
}

function checkAdminSession() {
    return true; // Always allow access
}

function logoutAdmin() {
    showNotification('Admin panelinden çıkış yapıldı!', 'info');
    
    // Redirect to main page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// ===== CONTENT MANAGEMENT =====
function loadContentFromAdmin() {
    // Try multiple sources for content
    let savedContent = localStorage.getItem('admin_content');
    
    // If not in localStorage, try sessionStorage
    if (!savedContent) {
        savedContent = sessionStorage.getItem('admin_content');
    }
    
    // If still no content, try to load from server
    if (!savedContent && typeof window.loadFromServer === 'function') {
        savedContent = window.loadFromServer('admin_content');
    }
    
    if (savedContent) {
        try {
            const content = JSON.parse(savedContent);
        
        // Update hero content
        if (content['hero-title-1']) {
            const titleLines = document.querySelectorAll('.hero-title .title-line');
            if (titleLines.length >= 3) {
                titleLines[0].textContent = content['hero-title-1'];
                titleLines[1].textContent = content['hero-title-2'];
                titleLines[2].textContent = content['hero-title-3'];
            }
        }
        
        if (content['hero-subtitle']) {
            const subtitle = document.querySelector('.hero-subtitle');
            if (subtitle) subtitle.textContent = content['hero-subtitle'];
        }
        
        if (content['hero-cta-text']) {
            const ctaButton = document.querySelector('.cta-button span:first-child');
            if (ctaButton) ctaButton.textContent = content['hero-cta-text'];
        }
        
        // Update about content
        if (content['vision-title']) {
            const visionTitle = document.querySelector('.vision-card h3');
            if (visionTitle) visionTitle.textContent = content['vision-title'];
        }
        
        if (content['vision-description']) {
            const visionDesc = document.querySelector('.vision-card p');
            if (visionDesc) visionDesc.textContent = content['vision-description'];
        }
        
        if (content['mission-title']) {
            const missionTitle = document.querySelector('.mission-card h3');
            if (missionTitle) missionTitle.textContent = content['mission-title'];
        }
        
        if (content['mission-description']) {
            const missionDesc = document.querySelector('.mission-card p');
            if (missionDesc) missionDesc.textContent = content['mission-description'];
        }
        
        // Update services content
        if (content['services-title']) {
            const servicesTitle = document.querySelector('.services .section-title');
            if (servicesTitle) servicesTitle.textContent = content['services-title'];
        }
        
        if (content['services-subtitle']) {
            const servicesSubtitle = document.querySelector('.services .section-subtitle');
            if (servicesSubtitle) servicesSubtitle.textContent = content['services-subtitle'];
        }
        
        if (content['visa-title']) {
            const visaTitle = document.querySelector('.visa-service h3');
            if (visaTitle) visaTitle.textContent = content['visa-title'];
        }
        
        if (content['visa-description']) {
            const visaDesc = document.querySelector('.visa-service .service-description');
            if (visaDesc) visaDesc.textContent = content['visa-description'];
        }
        
        if (content['ticketing-title']) {
            const ticketingTitle = document.querySelector('.ticketing-service h3');
            if (ticketingTitle) ticketingTitle.textContent = content['ticketing-title'];
        }
        
        if (content['ticketing-description']) {
            const ticketingDesc = document.querySelector('.ticketing-service .service-description');
            if (ticketingDesc) ticketingDesc.textContent = content['ticketing-description'];
        }
        
        // Update contact content
        if (content['contact-title']) {
            const contactTitle = document.querySelector('.contact .section-title');
            if (contactTitle) contactTitle.textContent = content['contact-title'];
        }
        
        if (content['contact-subtitle']) {
            const contactSubtitle = document.querySelector('.contact .section-subtitle');
            if (contactSubtitle) contactSubtitle.textContent = content['contact-subtitle'];
        }
        
        if (content['contact-address']) {
            const address = document.querySelector('.contact address');
            if (address) address.textContent = content['contact-address'];
        }
        
        if (content['contact-phone']) {
            const phone = document.querySelector('.contact a[href^="tel:"]');
            if (phone) {
                phone.textContent = content['contact-phone'];
                phone.href = `tel:${content['contact-phone']}`;
            }
        }
        
        if (content['contact-email']) {
            const email = document.querySelector('.contact a[href^="mailto:"]');
            if (email) {
                email.textContent = content['contact-email'];
                email.href = `mailto:${content['contact-email']}`;
            }
        }
        
        // Update footer content
        if (content['footer-description']) {
            const footerDesc = document.querySelector('.footer-description');
            if (footerDesc) footerDesc.textContent = content['footer-description'];
        }
        
        if (content['footer-copyright']) {
            const copyright = document.querySelector('.footer-copyright p');
            if (copyright) copyright.textContent = content['footer-copyright'];
        }
        } catch (e) {
            console.error('İçerik yükleme hatası:', e);
        }
    }
}

function loadImagesFromAdmin() {
    const savedImages = localStorage.getItem('admin_images');
    if (savedImages) {
        try {
            const images = JSON.parse(savedImages);
        
        // Update hero images
        if (images['hero-image-1']) {
            const heroSlide1 = document.querySelector('.hero-slide:nth-child(1) img');
            if (heroSlide1) heroSlide1.src = images['hero-image-1'];
        }
        
        if (images['hero-image-2']) {
            const heroSlide2 = document.querySelector('.hero-slide:nth-child(2) img');
            if (heroSlide2) heroSlide2.src = images['hero-image-2'];
        }
        
        if (images['hero-image-3']) {
            const heroSlide3 = document.querySelector('.hero-slide:nth-child(3) img');
            if (heroSlide3) heroSlide3.src = images['hero-image-3'];
        }
        
        if (images['hero-image-4']) {
            const heroSlide4 = document.querySelector('.hero-slide:nth-child(4) img');
            if (heroSlide4) heroSlide4.src = images['hero-image-4'];
        }
        
        if (images['hero-image-5']) {
            const heroSlide5 = document.querySelector('.hero-slide:nth-child(5) img');
            if (heroSlide5) heroSlide5.src = images['hero-image-5'];
        }
        

        
        // Update partner logos
        if (images['partner-thy']) {
            const thyLogos = document.querySelectorAll('.partner-logo img[src*="thy_logo"]');
            thyLogos.forEach(logo => {
                logo.src = images['partner-thy'];
            });
        }
        
        if (images['partner-turmed']) {
            const turmedLogos = document.querySelectorAll('.partner-logo img[src*="turmed-logo"]');
            turmedLogos.forEach(logo => {
                logo.src = images['partner-turmed'];
            });
        }
        
        if (images['partner-paribu']) {
            const paribuLogos = document.querySelectorAll('.partner-logo img[src*="paribu_logo"]');
            paribuLogos.forEach(logo => {
                logo.src = images['partner-paribu'];
            });
        }
        
        if (images['partner-papara']) {
            const paparaLogos = document.querySelectorAll('.partner-logo img[src*="Papara_Logo"]');
            paparaLogos.forEach(logo => {
                logo.src = images['partner-papara'];
            });
        }
        
        if (images['partner-okx']) {
            const okxLogos = document.querySelectorAll('.partner-logo img[src*="OKX_logo"]');
            okxLogos.forEach(logo => {
                logo.src = images['partner-okx'];
            });
        }
        
        if (images['partner-architect']) {
            const architectLogos = document.querySelectorAll('.partner-logo img[src*="logo-architecht"]');
            architectLogos.forEach(logo => {
                logo.src = images['partner-architect'];
            });
        }
        
        if (images['partner-gamak']) {
            const gamakLogos = document.querySelectorAll('.partner-logo img[src*="gamak_logo"]');
            gamakLogos.forEach(logo => {
                logo.src = images['partner-gamak'];
            });
        }
        } catch (e) {
            console.error('Görsel yükleme hatası:', e);
        }
    }
}

// ===== INITIALIZATION =====
function initializeWhatsApp() {
    // WhatsApp butonlarına hover efekti ekle
    const whatsappButtons = document.querySelectorAll('.whatsapp-button, .whatsapp-fab');
    whatsappButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Admin linkine tıklama olayı ekle
    const adminLink = document.getElementById('admin-login-link');
    if (adminLink) {
        adminLink.addEventListener('click', function(e) {
            e.preventDefault();
            showLoginModal();
        });
    }
    
    // Login butonuna tıklama olayı ekle
    const loginButton = document.querySelector('.login-submit');
    if (loginButton) {
        loginButton.addEventListener('click', function(e) {
            e.preventDefault();
            loginAdmin();
        });
    }
    
    // Modal dışına tıklayınca kapatma
    const modal = document.getElementById('admin-login-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideLoginModal();
            }
        });
    }
    
    // Enter tuşu ile giriş yapma
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const modal = document.getElementById('admin-login-modal');
            if (modal && modal.style.display === 'flex') {
                e.preventDefault(); // Form submit'i engelle
            loginAdmin();
            }
        }
    });
    
    // Test WhatsApp configuration
    testWhatsAppConfig();
    
    // Global function for WhatsApp buttons
    window.openWhatsApp = openWhatsApp;
    window.getWhatsAppNumber = getWhatsAppNumber;
    window.testWhatsAppConfig = testWhatsAppConfig;
    
    console.log('WhatsApp sistemi başlatıldı:', {
        currentNumber: getWhatsAppNumber(),
        config: WHATSAPP_CONFIG,
        firebaseData: localStorage.getItem('whatsapp_config')
    });
}

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    // Show preloader
    showPreloader();
    
    // WhatsApp config'ini yükle
    loadWhatsAppConfig();
    
    // Initialize app immediately
    initializeApp();
    
    // Hide preloader when everything is loaded
    window.addEventListener('load', function() {
        setTimeout(() => {
            hidePreloader();
        }, 1000); // Show for at least 1 second
    });
});

// ===== OPTIMIZED INITIALIZE APP =====
function initializeApp() {
    // Critical functions first
    loadContentFromAdmin();
    loadImagesFromAdmin();
    handleNavbarScroll();
    handleMobileMenu();
    handleSmoothScroll();
    initializeWhatsApp();
    
    // Defer non-critical functions
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
    initializeFormHandling();
    initializeAOS();
    handleServiceCards();
    handleParallaxEffects();
    initializeCounterAnimation();
    initializeHeroSlider();
    initializeSEOOptimizations();
    initializeAnalytics();
        });
    } else {
        // Fallback for older browsers
        setTimeout(() => {
            initializeFormHandling();
            initializeAOS();
            handleServiceCards();
            handleParallaxEffects();
            initializeCounterAnimation();
            initializeHeroSlider();
            initializeSEOOptimizations();
            initializeAnalytics();
        }, 100);
    }
}

// ===== PRELOADER =====
// Loading screen functionality restored

// ===== NAVBAR SCROLL EFFECT =====
function handleNavbarScroll() {
    const navbar = safeQuerySelector('#navbar');
    if (!navbar) return;
    
    let lastScrollTop = 0;
    let ticking = false;
    
    function updateNavbar() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class for styling
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll (optional)
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });
}

// ===== MOBILE MENU =====
function handleMobileMenu() {
    const navToggle = safeQuerySelector('#nav-toggle');
    const navMenu = safeQuerySelector('#nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!navToggle || !navMenu) return;
    
    // Toggle mobile menu
    safeAddEventListener(navToggle, 'click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        safeAddEventListener(link, 'click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===== SMOOTH SCROLL =====
function handleSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for navbar height
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
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

// ===== AOS INITIALIZATION =====
function initializeAOS() {
    // Simple AOS implementation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);
    
    // Observe all elements with data-aos attribute
    const aosElements = document.querySelectorAll('[data-aos]');
    aosElements.forEach(element => {
        observer.observe(element);
    });
}

// ===== SERVICE CARDS =====
function handleServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click functionality for CTA buttons
        const ctaButton = card.querySelector('.service-cta');
        if (ctaButton) {
            ctaButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                const serviceType = card.classList.contains('visa-service') ? 'Vize Danışmanlığı' : 'Biletleme Hizmetleri';
                showNotification(`${serviceType} hakkında detaylı bilgi için bizimle iletişime geçin!`, 'info');
            });
        }
    });
}

// ===== PARALLAX EFFECTS =====
function handleParallaxEffects() {
    const heroParticles = document.querySelector('.hero-particles');
    
    if (heroParticles) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            heroParticles.style.transform = `translateY(${rate}px)`;
        });
    }
}

// ===== COUNTER ANIMATION =====
function initializeCounterAnimation() {
    const counterNumbers = document.querySelectorAll('.counter-number');
    let animated = false;
    
    const animateCounters = () => {
        if (animated) return;
        
        const counterSection = document.querySelector('.success-counter');
        if (!counterSection) return;
        
        const sectionTop = counterSection.offsetTop;
        const sectionHeight = counterSection.offsetHeight;
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        // Check if counter section is in view (trigger when section is 50% visible)
        if (scrollTop + windowHeight > sectionTop + (sectionHeight * 0.5)) {
            animated = true;
            
            counterNumbers.forEach((counter, index) => {
                const target = parseInt(counter.getAttribute('data-target'));
                const symbol = counter.nextElementSibling.textContent;
                let current = 0;
                const increment = target / 200; // Daha yavaş artış için 200 adım
                const duration = 4000; // 4 saniye (daha yavaş)
                const stepTime = duration / 200;
                
                // Her sayaç için farklı delay ekle
                setTimeout(() => {
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        
                        // Format number with commas for thousands
                        const formattedNumber = Math.floor(current).toLocaleString();
                        counter.textContent = formattedNumber;
                        
                        // Add animation class
                        counter.classList.add('animate');
                        
                        // Remove animation class after animation completes
                        setTimeout(() => {
                            counter.classList.remove('animate');
                        }, 500);
                        
                    }, stepTime);
                }, index * 300); // Her kart için 300ms delay
            });
        }
    };
    
    // Initial check
    animateCounters();
    
    // Check on scroll with debounce
    window.addEventListener('scroll', debounce(animateCounters, 50));
}

// ===== HERO SLIDER =====
function initializeHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    const slideInterval = 3500; // 3.5 saniye (daha hızlı geçiş)
    
    function nextSlide() {
        // Mevcut slide'ı gizle
        slides[currentSlide].classList.remove('active');
        
        // Sonraki slide'a geç (sonsuz döngü)
        currentSlide = (currentSlide + 1) % totalSlides;
        
        // Yeni slide'ı göster
        slides[currentSlide].classList.add('active');
        
        // Console log (debug için)
        console.log(`Slide değişti: ${currentSlide + 1}/${totalSlides}`);
    }
    
    // İlk slide'ı göster
    slides[0].classList.add('active');
    console.log(`Hero slider başlatıldı: ${totalSlides} fotoğraf`);
    
    // Otomatik geçiş başlat (sonsuz döngü)
    let intervalId = setInterval(nextSlide, slideInterval);
    
    // Hover'da durdur (opsiyonel)
    const heroSection = document.querySelector('.hero');
    
    heroSection.addEventListener('mouseenter', () => {
        clearInterval(intervalId);
        console.log('Slider durduruldu (hover)');
    });
    
    heroSection.addEventListener('mouseleave', () => {
        intervalId = setInterval(nextSlide, slideInterval);
        console.log('Slider devam ediyor');
    });
    
    // Touch cihazlar için touch events
    heroSection.addEventListener('touchstart', () => {
        clearInterval(intervalId);
    });
    
    heroSection.addEventListener('touchend', () => {
        intervalId = setInterval(nextSlide, slideInterval);
    });
}

// ===== UTILITY FUNCTIONS =====
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 70;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// ===== PERFORMANCE OPTIMIZATION =====
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

// ===== RESIZE HANDLER =====
window.addEventListener('resize', debounce(function() {
    // Handle responsive adjustments
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
}, 250));

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', function(e) {
    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// ===== OPTIMIZED LAZY LOADING =====
function lazyLoadImages() {
    // Use native lazy loading if supported
    if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.src = img.dataset.src;
            img.loading = 'lazy';
        });
    } else {
        // Fallback for older browsers
        const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    }
}

// ===== ANALYTICS (placeholder) =====
function trackEvent(eventName, eventData = {}) {
    // Google Analytics or other analytics tracking
    console.log('Event tracked:', eventName, eventData);
    
    // Example: track form submissions, button clicks, etc.
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Send error to analytics or logging service
});

// ===== PERFORMANCE & SAFETY IMPROVEMENTS =====
function safeQuerySelector(selector) {
    try {
        return document.querySelector(selector);
    } catch (error) {
        console.error('Query selector error:', error);
        return null;
    }
}

function safeAddEventListener(element, event, handler) {
    if (element && typeof element.addEventListener === 'function') {
        try {
            element.addEventListener(event, handler);
            return true;
        } catch (error) {
            console.error('Event listener error:', error);
            return false;
        }
    }
    return false;
}

// ===== DOM READY CHECK =====
function isDOMReady() {
    return document.readyState === 'loading' || document.readyState === 'interactive' || document.readyState === 'complete';
}

// ===== EXPORT FUNCTIONS FOR GLOBAL USE =====
window.scrollToSection = scrollToSection;
window.showNotification = showNotification;
window.trackEvent = trackEvent;
window.showPrivacyPolicy = showPrivacyPolicy;
window.showTermsOfService = showTermsOfService;
window.hideLegalModal = hideLegalModal;

// ===== FORM HANDLING =====
function initializeFormHandling() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form verilerini al
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const message = formData.get('message');
            
            // Form verilerini doğrula
            if (!name || !email || !phone || !message) {
                showNotification('Lütfen tüm alanları doldurun.', 'error');
                return;
            }
            
            // Email formatını kontrol et
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Lütfen geçerli bir e-posta adresi girin.', 'error');
                return;
            }
            
            // Mail içeriğini hazırla
            const subject = 'Cihanturizm İletişim Formu - Yeni Mesaj';
            const body = `
Merhaba,

Aşağıdaki bilgilerle iletişim formu doldurulmuştur:

Ad Soyad: ${name}
E-posta: ${email}
Telefon: ${phone}

Mesaj:
${message}

---
Bu mesaj Cihanturizm web sitesi üzerinden gönderilmiştir.
            `.trim();
            
            // Mailto linki oluştur
            const mailtoLink = `mailto:baspnr19@hotmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            try {
                // Kullanıcının mail uygulamasını aç (daha güvenli yöntem)
                const mailLink = document.createElement('a');
                mailLink.href = mailtoLink;
                mailLink.style.display = 'none';
                document.body.appendChild(mailLink);
                mailLink.click();
                document.body.removeChild(mailLink);
                
                // Başarı mesajı göster
                showNotification('Mail uygulamanız açıldı. Mesajınızı gönderebilirsiniz.', 'success');
                
                // Formu temizle
                this.reset();
                
                // Console log
                console.log('Mail uygulaması açıldı:', {
                    to: 'baspnr19@hotmail.com',
                    subject: subject,
                    from_name: name,
                    from_email: email,
                    from_phone: phone,
                    message: message
                });
                
                // Event tracking
                trackEvent('form_submitted', {
                    form_type: 'contact',
                    user_email: email
                });
                
            } catch (error) {
                console.error('Mail açma hatası:', error);
                showNotification('Mail uygulaması açılamadı. Lütfen manuel olarak mail gönderin.', 'error');
                
                // Alternatif: Mail linkini kopyala
                navigator.clipboard.writeText(mailtoLink).then(() => {
                    showNotification('Mail linki panoya kopyalandı. Manuel olarak mail gönderebilirsiniz.', 'info');
                }).catch(() => {
                    showNotification('Mail linki: ' + mailtoLink, 'info');
                });
            }
        });
    }
} 

// ===== SEO & PERFORMANCE OPTIMIZATIONS =====
function initializeSEOOptimizations() {
    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Preload critical resources
    const criticalResources = [
        'assets/ercihanlogo-transparent.png',
        'assets/anasayfa/header-1.webp'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = resource;
        document.head.appendChild(link);
    });
    
    // Service Worker registration (if available)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
}

// ===== ANALYTICS & TRACKING =====
function initializeAnalytics() {
    // Google Analytics (if available)
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
            page_title: 'Cihanturizm - Ana Sayfa',
            page_location: window.location.href,
            custom_map: {
                'custom_dimension1': 'user_type',
                'custom_dimension2': 'service_interest'
            }
        });
    }
    
    // Track page views
    trackEvent('page_view', {
        page_title: 'Cihanturizm Ana Sayfa',
        page_url: window.location.href,
        user_agent: navigator.userAgent
    });
    
    // Track form interactions
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            trackEvent('form_submit', {
                form_type: 'contact',
                form_location: 'contact_section'
            });
        });
    }
    
    // Track button clicks
    const ctaButtons = document.querySelectorAll('.cta-button, .service-cta');
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            trackEvent('button_click', {
                button_text: e.target.textContent.trim(),
                button_location: e.target.closest('section')?.id || 'unknown'
            });
        });
    });
} 

// ===== LEGAL MODAL FUNCTIONS =====
function showPrivacyPolicy() {
    const modal = document.getElementById('privacy-modal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
}

function showTermsOfService() {
    const modal = document.getElementById('terms-modal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
}

function hideLegalModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const legalModals = document.querySelectorAll('.legal-modal');
    legalModals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                const modalId = modal.id;
                hideLegalModal(modalId);
            }
        });
    });
});

// ===== CROSS-DEVICE SYNC =====
// Listen for storage changes to sync across tabs/devices
window.addEventListener('storage', function(e) {
    if (e.key === 'admin_content' || e.key === 'whatsapp_config' || e.key === 'admin_images') {
        console.log('Content updated from another tab/device:', e.key);
        
        // Reload content if it was updated
        if (e.key === 'admin_content') {
            loadContentFromAdmin();
        }
        
        // Reload WhatsApp config if it was updated
        if (e.key === 'whatsapp_config') {
            loadWhatsAppConfig();
        }
        
        // Reload images if they were updated
        if (e.key === 'admin_images') {
            loadImagesFromAdmin();
        }
    }
});

// ===== SECURITY MEASURES COMPLETELY REMOVED =====
// All security measures have been completely removed for development purposes
