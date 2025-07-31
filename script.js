// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ===== INITIALIZE APP =====
function initializeApp() {
    // Preloader
    handlePreloader();
    
    // Navbar scroll effect
    handleNavbarScroll();
    
    // Mobile menu toggle
    handleMobileMenu();
    
    // Smooth scrolling for anchor links
    handleSmoothScroll();
    
    // Form handling
    initializeFormHandling();
    
    // AOS (Animate On Scroll) initialization
    initializeAOS();
    
    // Service card interactions
    handleServiceCards();
    
    // Parallax effects
    handleParallaxEffects();
    
    // Counter animation
    initializeCounterAnimation();
    
    // Hero slider
    initializeHeroSlider();
    
    // SEO optimizations
    initializeSEOOptimizations();
    
    // Analytics
    initializeAnalytics();
}

// ===== PRELOADER =====
function handlePreloader() {
    const preloader = document.getElementById('preloader');
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1000);
    });
}

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
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
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

// ===== LAZY LOADING (if needed) =====
function lazyLoadImages() {
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