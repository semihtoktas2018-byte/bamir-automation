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

// Uygulama dışa aktarımı
export default app;
