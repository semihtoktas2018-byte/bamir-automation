/* 🦅BAMİR Online Mağazası — Shopify Express Otomasyon Çekirdeği
   Fonksiyonlar:
   - Sağlık kontrol: GET /api/health
   - Ürün listesi: GET /api/products?limit=50
   - Tekil ürün oluşturma: POST /api/products
   - Toplu ürün yükleme: POST /api/products/bulk
   - Toplu fiyat güncellemesi: POST /api/products/price-bulk
   - Toplu stok güncellemesi: POST /api/envanter/toplu
*/

"ekspres" kelimesinden "ekspres"i içe aktar;

sabit uygulama = ekspres();
app.use(express.json({ limit: "5mb" }));

// === Ortam ===
const SHOP_NAME = process.env.SHOP_NAME || "bamir-online-mağaza";
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_ TOKEN || process.env.SHOPIFY_API_KEY || process.env.SHOPIFY_API_ SECRET; // geriye dönük
sabit API_VERSION = "2024-04";
sabit BASE = `https://${MAĞAZA_ADI} .myshopif y.com/admin/api/${API_VERSION} ` ;

// === Yardımcılar ===
asenkron fonksiyon çağrısıShopify(yol, yöntem = "GET", gövde) {
  eğer (!ERİŞİM_JETONU) {
    throw new Error("ACCESS_TOKEN yok. Vercel → Ayarlar → Ortam Değişkenleri: SHOPIFY_ACCESS_TOKEN ve SHOP_NAME ekle.");
  }
  sabit res = await fetch(`${BASE}${path}`, {
    yöntem,
    başlıklar: {
      "İçerik Türü": "uygulama/json",
      "X-Shopify-Erişim-Belirteci": ERİŞİM_BELİRTECİ,
    },
    gövde: gövde ? JSON.stringify(gövde) : tanımsız,
  });
  sabit metin = await res.text();
  json'a izin ver;
  dene { json = metin ? JSON.parse(metin): {}; } yakala { json = { ham: metin }; }
  eğer (!res.ok) {
    sabit mesaj = json?.errors ? JSON.stringify(json.errors) : metin || `HTTP ${res.status}`;
    yeni Hata(msg) fırlat;
  }
  json'u döndür;
}

const ok = (res, data) => res.status(200).json({ ok: true, ...data, brand: "BAMİR Online Mağazası" });
const fail = (res, e) => res.status(400).json({ ok: false, error: String(e?.message || e), brand: "BAMİR Online Mağazası" });

// === 1) Sağlık kontrolü ===
app.get("/api/sağlık", (istek, çözüm) => {
  eğer (!ACCESS_TOKEN) return res.status(500).send("ACCESS_TOKEN eksik");
  res.status(200).send("Tamam"); ​​döndür
});

// === 2) Ürün listeleme ===
app.get("/api/ürünler", async (istek, çözüm) => {
  denemek {
    sabit sınır = Sayı(istek.sorgu.sınırı || 50);
    sabit veri = await callShopify(`/ürünler.json? sınır=${limit}`);
    tamam(res, { sayım: data.products?.length || 0, ürünler: data.products || [] });
  } yakala (e) { başarısız(res, e); }
});

// === 3) Tekil ürün oluşturma ===
// gövde: { başlık, gövde_html, fiyat, sku }
app.post ("/api/ürünler", async (istek, çözüm) => {
  denemek {
    sabit { başlık, gövde_html, fiyat, sku } = req.body || {};
    if (!title) throw new Error("title zorunlu");
    sabit yük = {
      ürün: {
        başlık,
        gövde_html: gövde_html || `<p>${title}</p>`,
        satıcı: "BAMİR Online Mağazası",
        ürün_türü: "Genel",
        varyantlar: [{ fiyat: String(fiyat || "0.00"), sku: sku || tanımsız }]
      }
    };
    const out = await callShopify("/products.json", "POST", yük);
    tamam(res, { ürün: çıktı.ürün });
  } yakala (e) { başarısız(res, e); }
});

// === 4) Toplu ürün yükleme ===
// gövde: { ürünler: [{başlık, gövde_html, fiyat, sku}, ...] }
app.post ("/api/ürünler/toplu", async (istek, çözüm) => {
  denemek {
    sabit öğeler = Array.isArray(req.body? .ürünler) ? req.body.ürünler : [];
    if (!items.length) throw new Error("ürünler boş");
    sabit sonuçlar = [];
    (öğelerin p sabiti için) {
      denemek {
        sabit yük = {
          ürün: {
            başlık: s.başlık,
            gövde_html: p.gövde_html || `<p>${p.title}</p>`,
            satıcı: "BAMİR Online Mağazası",
            ürün_türü: p.ürün_türü || "Genel",
            varyantlar: [{ fiyat: String(p.fiyat || "0.00"), sku: p.sku || tanımsız }]
          }
        };
        const out = await callShopify("/products.json", "POST", yük);
        sonuçlar.push({ başlık: p.başlık, id: çıktı.ürün?.id, tamam: doğru });
      } yakala (e) {
        sonuçlar.push({ başlık: p.başlık, tamam: false, hata: String(e.mesaj || e) });
      }
    }
    tamam(res, { sonuçlar });
  } yakala (e) { başarısız(res, e); }
});

// === 5) Toplu fiyat güncellemesi ===
// gövde: { güncellemeler: [{ürün_kimliği, varyant_kimliği, fiyat}, ...] }
app.post ("/api/ürünler/fiyat- toplu", async (istek, çözünürlük) => {
  denemek {
    sabit güncellemeler = Array.isArray(req.body? .güncellemeler) ? req.body.güncellemeler : [];
    if (!updates.length) throw new Error("updates boş");
    sabit sonuçlar = [];
    (güncellemelerin sabit u'su için) {
      denemek {
        if (!u.product_id || !u.variant_id) throw new Error("product_id ve variant_id zorunlu");
        sabit yük = { değişken: { id: u.variant_id, fiyat: String(u.price) } };
        const out = await callShopify(`/variants/${u.variant_id }.json`, "PUT", yük);
        sonuçlar.push({ varyant_id: u.variant_id, tamam: doğru, fiyat: out.variant?.fiyat });
      } yakala (e) {
        sonuçlar.push({ varyant_id: u.variant_id, tamam: false, hata: String(e.mesaj || e) });
      }
    }
    tamam(res, { sonuçlar });
  } yakala (e) { başarısız(res, e); }
});

// === 6) Toplu stok güncellemesi ===
// gövde: { güncellemeler: [{envanter_öğesi_kimliği, kullanılabilir, konum_kimliği}], not: "isteğe bağlı" }
app.post ("/api/envanter/toplu" , async (istek, çözüm) => {
  denemek {
    sabit güncellemeler = Array.isArray(req.body? .güncellemeler) ? req.body.güncellemeler : [];
    if (!updates.length) throw new Error("updates boş");
    sabit sonuçlar = [];
    (güncellemelerin sabit u'su için) {
      denemek {
        eğer (!u.inventory_item_id || typeof u.available === "tanımsız" || !u.location_id) {
          throw new Error("inventory_item_id, available, location_id zorunlu");
        }
        sabit yük = {
          konum_kimliği: u.konum_kimliği,
          envanter_öğesi_kimliği: u.envanter_öğesi_kimliği,
          mevcut: Sayı(u.mevcut)
        };
        const out = await callShopify("/envanter_seviyeleri /set.json", "POST", yük);
        sonuçlar.push({ envanter_öğesi_kimliği: u.envanter_öğesi_kimliği, tamam: doğru, seviye: dışarı.envanter_seviyesi || dışarı });
      } yakala (e) {
        sonuçlar.push({ envanter_öğesi_kimliği: u.envanter_öğesi_kimliği, tamam: false, hata: String(e.mesaj || e) });
      }
    }
    tamam(res, { sonuçlar });
  } yakala (e) { başarısız(res, e); }
});

export default app;
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "BAMİR Automation Active" });
});
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "BAMİR Automation Active" });
});
