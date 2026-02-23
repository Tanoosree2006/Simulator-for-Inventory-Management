import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function ProductList() {
  const [product, setProduct] = useState(null);

  const loadProduct = async () => {
    const res = await api.get("/products/1");
    setProduct(res.data);
  };

  useEffect(() => {
    loadProduct();
  }, []);

  return (
    <div>
      <h2>Product Status</h2>
      {product && (
        <>
          <p>Name: {product.name}</p>
          <p>Stock: {product.stock}</p>
          <p>Version: {product.version}</p>
        </>
      )}
      <button onClick={loadProduct}>Refresh</button>
    </div>
  );
}