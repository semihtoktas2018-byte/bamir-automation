import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🦅 BAMİR Online Store’s Otomasyon Aktif");
});

app.post("/bamir-upload", async (req, res) => {
  const API_TOKEN = "shpat_xxxxxxxx"; // Shopify'dan aldığın Private Access Token
  const STORE = "bamir-online-store"; // mağaza adresin
  
  const sampleProduct = {
    product: {
      title: "BAMİR X7 Eagle Pro Drone",
      body_html: "<strong>4K Kamera • GPS • Premium Uçuş</strong>",
      vendor: "BAMİR",
      variants: [{ price: "199.99" }]
    }
  };

  const response = await fetch(`https://${STORE}.myshopify.com/admin/api/2025-01/products.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": API_TOKEN
    },
    body: JSON.stringify(sampleProduct)
  });

  const data = await response.json();
  console.log(data);
  res.send("Ürün yükleme tamamlandı — B@MİR Online Store’s");
});

export default app;
