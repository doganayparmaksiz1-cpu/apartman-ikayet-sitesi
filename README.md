# Apartman Şikayet Sistemi

Bu proje, apartman yönetim süreçlerini dijitalleştirmek, sakinlerin taleplerini toplamak ve takip etmek için geliştirilmiş **Full-Stack** bir web uygulamasıdır.

## 🚀 Kullanılan Teknolojiler

- **Frontend:** React, Vite, React Router, CSS (Glassmorphism)
- **Backend:** Node.js, Express.js
- **Veritabanı:** SQLite
- **Diğer:** UUID, CORS

## 📂 Proje Yapısı

### Frontend (`src/`)
- **`features/auth`**: Giriş işlemleri ve sayfaları.
- **`features/admin`**: Yönetici paneli (Kullanıcı ekleme, şikayet yönetimi).
- **`features/resident`**: Sakin paneli (Şikayet oluşturma, takip etme).
- **`context/`**: Proje genelindeki veri akışını yöneten yapılar (`AuthContext`, `ComplaintContext`).

### Backend (`server/`)
- **`index.js`**: Sunucu ve API kodları.
- **`setup.js`**: Veritabanı ve tablo kurulumu.
- **`database.sqlite`**: Verilerin tutulduğu dosya.

## 🛠️ Kurulum ve Çalıştırma

Projeyi bilgisayarınızda çalıştırmak için şu adımları izleyin:

1.  **Bağımlılıkları Yükleyin:**
    ```bash
    npm install
    cd server
    npm install
    cd ..
    ```

2.  **Veritabanını Kurun:**
    ```bash
    node server/setup.js
    ```

3.  **Projeyi Başlatın:**
    *   **Yöntem 1 (Tek Komutla):** `yayina_hazirla.bat` dosyasını çalıştırın, ardından `node server/index.js` yazın.
    *   **Yöntem 2 (Geliştirici Modu):** İki ayrı terminal açın, birinde `npm run dev`, diğerinde `node server/index.js` komutlarını çalıştırın.

## ✨ Özellikler

- **Admin Paneli:** Yönetici kullanıcı ekleyebilir, şikayetlerin durumunu (Bekliyor, Çözüldü vb.) güncelleyebilir.
- **Sakin Paneli:** Sakinler şikayet oluşturabilir ve apartmandaki diğer şikayetleri görebilir.
- **Güvenlik:** Kullanıcı adı ve şifre ile giriş sistemi.
- **Responsive Tasarım:** Telefonda ve bilgisayarda uyumlu modern arayüz.
