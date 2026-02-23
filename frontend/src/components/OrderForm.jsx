import { api } from "../api/api";

export default function OrderForm() {

  const placeOrder = async (type) => {
    try {
      const res = await api.post(`/orders/${type}`, {
        productId: 1,
        quantity: 10,
        userId: "react-user"
      });

      alert(res.data.message || "Order Success");
    } catch (err) {
      alert(err.response?.data?.error || "Error occurred");
    }
  };

  return (
    <div>
      <h2>Place Order</h2>

      <button onClick={() => placeOrder("pessimistic")}>
        Buy using Pessimistic Lock
      </button>

      <button onClick={() => placeOrder("optimistic")}>
        Buy using Optimistic Lock
      </button>
    </div>
  );
}