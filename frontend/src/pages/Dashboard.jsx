import ProductList from "../components/ProductList";
import OrderForm from "../components/OrderForm";
import Stats from "../components/Stats";

export default function Dashboard() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>Inventory Concurrency Simulator</h1>

      <ProductList />
      <hr />
      <OrderForm />
      <hr />
      <Stats />
    </div>
  );
}