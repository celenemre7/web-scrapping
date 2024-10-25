"use client";

// Why use client here? I could have dumped this into its own client component,
// but this is simpler for the sake of the example!

import { useState } from "react";

// Add this type definition
type Product = {
  name: string;
  price: string;
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleScrape() {
    setLoading(true);
    const results = await fetch("/api/scraper", {
      method: "POST",
      body: JSON.stringify({ siteUrl: url }),
    }).then((r) => r.json());
    setProducts(results.products);
    setLoading(false);
  }

  return (
    <main className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold mb-8">Ürün Çıkarıcı</h1>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Çıkarılacak URL'yi girin"
            className="input input-bordered w-full mb-4"
          />
          <button className="btn btn-primary" onClick={handleScrape} disabled={loading}>
            {loading ? "Çıkarılıyor..." : "Ürünleri Çıkar"}
          </button>
          {products.length > 0 && (
            <table className="table w-full mt-8">
              <thead>
                <tr>
                  <th>İsim</th>
                  <th>Fiyat</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={index}>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
