// ===== FIREBASE CONFIGURATION =====
// Firebase configuration for Cihanturizm Admin Panel - Realtime Database

// Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyAyo2dgEsqLHaI6zFKl-NTOr0rOFwmcRJY",
    authDomain: "cihan-turizm.firebaseapp.com",
    databaseURL: "https://cihan-turizm-default-rtdb.firebaseio.com",
    projectId: "cihan-turizm",
    storageBucket: "cihan-turizm.appspot.com",
    messagingSenderId: "590961604070",
    appId: "1:590961604070:web:c1273b0ec4cb17d2bad227"
};

// Initialize Firebase
let app;
try {
    app = firebase.initializeApp(firebaseConfig);
    console.log('Firebase başarıyla başlatıldı:', app.name);
} catch (error) {
    console.error('Firebase başlatma hatası:', error);
    throw error;
}

// Initialize Firebase services
let database, auth, storage;
try {
    database = firebase.database();
    auth = firebase.auth();
    storage = firebase.storage();
    console.log('Firebase servisleri başlatıldı');
} catch (error) {
    console.error('Firebase servisleri başlatma hatası:', error);
    throw error;
}

// ===== FIREBASE REALTIME DATABASE FUNCTIONS =====

// Save data to Firebase Realtime Database
async function saveToFirebase(path, data) {
    try {
        console.log('Firebase\'e kaydediliyor:', { path, data });
        
        // Check if database is initialized
        if (!database) {
            throw new Error('Firebase database not initialized');
        }
        
        // Check if ref is available
        const ref = database.ref(path);
        if (!ref) {
            throw new Error('Firebase ref not available');
        }
        
        await ref.set(data);
        console.log('Firebase Realtime Database\'e başarıyla kaydedildi:', path);
        return true;
    } catch (error) {
        console.error('Firebase kaydetme hatası:', error);
        if (error.code === 'permission_denied') {
            console.error('Firebase permission hatası - Database kurallarını kontrol edin!');
            console.error('Gerekli kurallar: {"rules": {"' + path + '": {".write": true, ".read": true}}}');
        }
        console.error('Hata detayları:', {
            message: error.message,
            code: error.code,
            path: path,
            data: data
        });
        return false;
    }
}

// Load data from Firebase Realtime Database
async function loadFromFirebase(path) {
    try {
        const snapshot = await database.ref(path).once('value');
        if (snapshot.exists()) {
            console.log('Firebase Realtime Database\'den yüklendi:', path);
            return snapshot.val();
        } else {
            console.log('Firebase\'de veri bulunamadı:', path);
            return null;
        }
    } catch (error) {
        console.error('Firebase yükleme hatası:', error);
        if (error.code === 'permission_denied') {
            console.error('Firebase permission hatası - Database kurallarını kontrol edin!');
            console.error('Gerekli kurallar: {"rules": {"' + path + '": {".write": true, ".read": true}}}');
        }
        return null;
    }
}

// Listen for real-time updates
function listenForFirebaseUpdates(path, callback) {
    database.ref(path).on('value', (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            console.log('Firebase Realtime Database\'den güncelleme:', path, data);
            callback(data);
        }
    }, (error) => {
        console.error('Firebase dinleme hatası:', error);
        if (error.code === 'permission_denied') {
            console.error('Firebase permission hatası - Database kurallarını kontrol edin!');
            console.error('Gerekli kurallar: {"rules": {"' + path + '": {".write": true, ".read": true}}}');
        }
    });
}

// Upload image to Firebase Storage
async function uploadImageToFirebase(file, path) {
    try {
        const storageRef = storage.ref();
        const fileRef = storageRef.child(path);
        const snapshot = await fileRef.put(file);
        const downloadURL = await snapshot.ref.getDownloadURL();
        console.log('Görsel Firebase\'e yüklendi:', path);
        return downloadURL;
    } catch (error) {
        console.error('Firebase görsel yükleme hatası:', error);
        return null;
    }
}

// Delete image from Firebase Storage
async function deleteImageFromFirebase(path) {
    try {
        const storageRef = storage.ref();
        const fileRef = storageRef.child(path);
        await fileRef.delete();
        console.log('Firebase\'den görsel silindi:', path);
        return true;
    } catch (error) {
        console.error('Firebase görsel silme hatası:', error);
        return false;
    }
}

// ===== WHATSAPP DATA MANAGEMENT =====

// Save WhatsApp data to Firebase
async function saveWhatsAppDataToFirebase(whatsappData) {
    console.log('saveWhatsAppDataToFirebase çağrıldı');
    console.log('Gelen veri:', whatsappData);
    
    const data = {
        dailyNumbers: whatsappData.dailyNumbers,
        messages: whatsappData.messages,
        lastUpdated: new Date().toISOString()
    };
    
    console.log('Firebase\'e gönderilecek veri:', data);
    
    try {
        const success = await saveToFirebase('/whatsapp', data);
        console.log('saveToFirebase sonucu:', success);
        return success;
    } catch (error) {
        console.error('saveWhatsAppDataToFirebase hatası:', error);
        return false;
    }
}

// ===== CONTENT DATA MANAGEMENT =====

// Save content data to Firebase
async function saveContentDataToFirebase(contentData) {
    const data = {
        content: contentData,
        lastUpdated: new Date().toISOString()
    };
    const success = await saveToFirebase('/content', data);
    return success;
}

// Load content data from Firebase
async function loadContentDataFromFirebase() {
    const data = await loadFromFirebase('/content');
    if (data) {
        localStorage.setItem('admin_content', JSON.stringify(data));
        updateContentFormFields(data);
        return true;
    }
    return false;
}

// Update content form fields with loaded data
function updateContentFormFields(data) {
    if (data.content) {
        Object.keys(data.content).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = data.content[key];
            }
        });
    }
}

// Listen for content data updates
function listenForContentUpdates() {
    listenForFirebaseUpdates('/content', (data) => {
        if (data) {
            localStorage.setItem('admin_content', JSON.stringify(data));
            updateContentFormFields(data);
            if (typeof updateDashboard === 'function') {
                updateDashboard();
            }
            if (typeof showNotification === 'function') {
                showNotification('Firebase\'den içerik güncellemesi alındı!', 'info');
            }
        }
    });
}

// Load WhatsApp data from Firebase
async function loadWhatsAppDataFromFirebase() {
    const data = await loadFromFirebase('/whatsapp');
    if (data) {
        // Update localStorage with Firebase data
        localStorage.setItem('whatsapp_config', JSON.stringify(data));
        
        // Update form fields
        updateWhatsAppFormFields(data);
        
        return true;
    }
    return false;
}

// Update WhatsApp form fields with loaded data
function updateWhatsAppFormFields(data) {
    if (data.dailyNumbers) {
        Object.keys(data.dailyNumbers).forEach(indexStr => {
            const index = parseInt(indexStr);
            const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            const dayName = dayNames[index];
            
            if (dayName) {
                const morningInput = document.getElementById(`${dayName}-morning`);
                const eveningInput = document.getElementById(`${dayName}-evening`);
                
                if (morningInput) morningInput.value = data.dailyNumbers[index].morning || '';
                if (eveningInput) eveningInput.value = data.dailyNumbers[index].evening || '';
            }
        });
    }
    
    if (data.messages) {
        Object.keys(data.messages).forEach(key => {
            const element = document.getElementById(`${key}-message`);
            if (element) {
                element.value = data.messages[key];
            }
        });
    }
}

// ===== REAL-TIME SYNC =====

// Listen for WhatsApp data updates
function listenForWhatsAppUpdates() {
    listenForFirebaseUpdates('/whatsapp', (data) => {
        if (data) {
            // Update localStorage
            localStorage.setItem('whatsapp_config', JSON.stringify(data));
            
            // Update form fields
            updateWhatsAppFormFields(data);
            
            // Update dashboard
            if (typeof updateDashboard === 'function') {
                updateDashboard();
            }
            
            // Show notification
            if (typeof showNotification === 'function') {
                showNotification('Firebase\'den WhatsApp güncellemesi alındı!', 'info');
            }
        }
    });
}

// ===== AUTHENTICATION =====

// Sign in with email and password
async function signInWithEmail(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        console.log('Firebase giriş başarılı:', userCredential.user.email);
        return true;
    } catch (error) {
        console.error('Firebase giriş hatası:', error);
        return false;
    }
}

// Sign out
async function signOut() {
    try {
        await auth.signOut();
        console.log('Firebase çıkış başarılı');
        return true;
    } catch (error) {
        console.error('Firebase çıkış hatası:', error);
        return false;
    }
}

// Check authentication state
function onAuthStateChanged(callback) {
    auth.onAuthStateChanged(callback);
}

// ===== SIMPLE FIREBASE TEST =====
async function testSimpleFirebaseWrite() {
    console.log('Basit Firebase yazma testi başlatılıyor...');
    
    try {
        // Test verisi
        const testData = {
            test: true,
            timestamp: new Date().toISOString(),
            message: 'Firebase test yazısı'
        };
        
        console.log('Test verisi:', testData);
        
        // Firebase'e yazma
        const ref = database.ref('/test');
        await ref.set(testData);
        
        console.log('Firebase yazma başarılı!');
        return true;
    } catch (error) {
        console.error('Firebase yazma hatası:', error);
        console.error('Hata detayları:', {
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        return false;
    }
}

// ===== EXPORT FUNCTIONS =====
window.saveToFirebase = saveToFirebase;
window.loadFromFirebase = loadFromFirebase;
window.listenForFirebaseUpdates = listenForFirebaseUpdates;
window.uploadImageToFirebase = uploadImageToFirebase;
window.deleteImageFromFirebase = deleteImageFromFirebase;
window.saveWhatsAppDataToFirebase = saveWhatsAppDataToFirebase;
window.loadWhatsAppDataFromFirebase = loadWhatsAppDataFromFirebase;
window.listenForWhatsAppUpdates = listenForWhatsAppUpdates;
window.saveContentDataToFirebase = saveContentDataToFirebase;
window.loadContentDataFromFirebase = loadContentDataFromFirebase;
window.listenForContentUpdates = listenForContentUpdates;
window.signInWithEmail = signInWithEmail;
window.signOut = signOut;
window.onAuthStateChanged = onAuthStateChanged;
window.testSimpleFirebaseWrite = testSimpleFirebaseWrite; 