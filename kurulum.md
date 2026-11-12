//Dosyanın içerisinde cmd satırına;
(BACKEND)

cd backend
npm install
npx wrangler d1 execute movie-portal-db --local --file=./schema.sql

//(FRONTEND)

cd frontend
npm install

//Keyler
.env.example
.dev.vars.example
Dosyalarının içerisi kontrol edilmeli.

frontend/.env.example dosyasının adını .env.local olarak değiştirin:

backend/.dev.vars.example dosyasının adını .dev.vars olarak değiştirin ve içerisine kendi TMDB API Read Access Token (Bearer) anahtarınızı ekleyin:

//yerel sunucu
npx wrangler d1 execute movie-portal-db --local --file=./schema.sql


//Auth
- `user1@proje.com` (`movie_only`): Sadece popüler filmleri listeler, arama yapar, puan/not verir ve film önerir.
- `user2@proje.com` (`actor_only`): Sadece popüler oyuncuları listeler ve oyuncu araması yapar.
- `user3@proje.com` (`both`): Hem film hem oyuncu ekranlarına tam erişim sağlar.
Hepsinin şifresi: Patatesadam0912_
Eğer farklı bir hesapla giriş yapmak denenirse ('both') yetkisi verilir.