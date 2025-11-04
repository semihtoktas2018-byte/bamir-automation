import express from "express";

const app = express();
app.use(express.json());

// Ana rota testi
app.get("/", (req, res) => {
  res.send("🦅 BAMİR Online Store’s Otomasyon Aktif 🦅");
});

// Sağlık kontrolü (Vercel için doğru endpoint)
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "BAMİR Automation Active",
  });
});
// Shopify ürün listesi
app.get("/api/products", async (req, res) => {
  const url = `https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2023-10/products.json?limit=5`;
  try {
    const response = await fetch(url, {
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_API_TOKEN,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Uygulama dışa aktarımı
export default app;
