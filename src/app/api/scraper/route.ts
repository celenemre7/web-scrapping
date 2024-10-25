import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const { siteUrl } = await request.json();
    console.log("Hedef URL:", siteUrl);

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(siteUrl);

    // Ürün bilgilerini çıkarma
    const products = await page.evaluate(() => {
      const productElements = document.querySelectorAll('article.product_pod');
      return Array.from(productElements).map(el => ({
        name: el.querySelector('h3 a')?.getAttribute('title'),
        price: el.querySelector('.price_color')?.textContent,
      }));
    });

    await browser.close();

    return Response.json({ siteUrl, products });
  } catch (error: any) {
    console.error("Scraper hatası:", error);
    return Response.json(
      { error: "Scraping sırasında bir hata oluştu", details: error.message },
      { status: 500 }
    );
  }
}
