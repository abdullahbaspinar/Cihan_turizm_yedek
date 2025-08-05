# Cihanturizm Admin Panel

Modern, responsive admin panel for managing website content and settings.

## Özellikler

### 🎨 Modern Tasarım
- Responsive tasarım (mobil, tablet, desktop)
- Modern gradient renkler ve animasyonlar
- Material Design ikonları
- Kullanıcı dostu arayüz

### 📝 İçerik Yönetimi
- **Ana Sayfa**: Hero başlıkları, alt başlık, CTA butonu
- **Hakkımızda**: Vizyon ve misyon metinleri
- **Hizmetler**: Hizmet başlıkları ve açıklamaları
- **İletişim**: Adres, telefon, e-posta bilgileri
- **Footer**: Footer açıklaması ve copyright metni

### 🖼️ Görsel Yönetimi
- Ana sayfa arka plan görselleri (5 adet)
- Hizmet görselleri (Vize ve Biletleme)
- Sürükle-bırak görsel yükleme
- Görsel önizleme
- Otomatik boyutlandırma

### 📱 WhatsApp Ayarları
- Günlük numara yönetimi (7 gün)
- Sabah/akşam numara ayarları
- Bölüm bazlı mesaj ayarları
- Otomatik numara değişimi

### ⚙️ Genel Ayarlar
- Site başlığı ve açıklaması
- Admin kullanıcı adı ve şifresi
- Veri dışa/içe aktarma
- Tüm verileri sıfırlama

## Kullanım

### Giriş
1. Ana sayfada footer'da "Yönetici Girişi" linkine tıklayın
2. Kullanıcı adı: `admin`
3. Şifre: `cihan123`

### Dashboard
- Düzenlenen içerik sayısı
- Değiştirilen görsel sayısı
- Son güncelleme zamanı
- Aktif WhatsApp numarası
- Hızlı işlem butonları

### İçerik Düzenleme
1. "İçerik Yönetimi" sekmesine gidin
2. İlgili tab'ı seçin (Ana Sayfa, Hakkımızda, Hizmetler, İletişim, Footer)
3. Metinleri düzenleyin
4. "Tüm Değişiklikleri Kaydet" butonuna tıklayın

### Görsel Yönetimi
1. "Görsel Yönetimi" sekmesine gidin
2. Değiştirmek istediğiniz görseli seçin
3. "Görsel Yükle" butonuna tıklayın
4. Yeni görseli seçin (max 5MB)
5. Otomatik olarak kaydedilir

### WhatsApp Ayarları
1. "WhatsApp Ayarları" sekmesine gidin
2. Günlük numaraları ayarlayın
3. Mesajları düzenleyin
4. Değişiklikler otomatik kaydedilir

### Veri Yönetimi
- **Dışa Aktar**: Tüm ayarları JSON dosyası olarak indirin
- **İçe Aktar**: Önceden kaydedilmiş ayarları yükleyin
- **Sıfırla**: Tüm verileri temizleyin

## Teknik Özellikler

### Responsive Tasarım
- Mobil: Sidebar gizli, hamburger menü
- Tablet: Küçültülmüş sidebar
- Desktop: Tam sidebar

### Otomatik Kaydetme
- İçerik değişiklikleri 2 saniye sonra otomatik kaydedilir
- Görsel yüklemeleri anında kaydedilir
- WhatsApp ayarları anında güncellenir

### Güvenlik
- Session tabanlı giriş (30 dakika)
- Otomatik çıkış
- Güvenli veri saklama (localStorage)

### Performans
- Lazy loading görseller
- Debounced auto-save
- Optimized animations
- Minimal re-renders

## Dosya Yapısı

```
├── index.html          # Ana sayfa
├── admin.html          # Admin panel
├── admin.js            # Admin panel JavaScript
├── admin.css           # Admin panel CSS
├── script.js           # Ana sayfa JavaScript
├── style.css           # Ana sayfa CSS
└── assets/             # Görseller
    ├── anasayfa/       # Hero görselleri
    ├── header/         # Hizmet görselleri
    └── partners/       # Partner logoları
```

## Tarayıcı Desteği

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Lisans

Bu proje Cihanturizm için özel olarak geliştirilmiştir.

## İletişim

Teknik destek için: info@cihanturizm.com 