function getFarmerStatusUI(order) {
  const status = String(order.status || "pending").toLowerCase();
  const orderId = order.orderid || order.order_id;

  if (status === "accepted" || status === "approved") {
    return `<span class="badge bg-success">Accepted</span>`;
  }

  if (status === "rejected") {
    return `<span class="badge bg-danger">Rejected</span>`;
  }

  return `
    <button class="btn btn-success btn-sm me-2" onclick="updateOrderStatus(${orderId}, 'accepted')">Accept</button>
    <button class="btn btn-danger btn-sm" onclick="updateOrderStatus(${orderId}, 'rejected')">Reject</button>
  `;
}

async function loadFarmerOrders() {
  const farmerId = localStorage.getItem("farmerid");
  const container = document.getElementById("farmer-orders");

  if (!container) return;

  if (!farmerId) {
    container.innerHTML = `
      <div class="col-12">
        <p class="text-center text-danger">Farmer not logged in</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="col-12">
      <p class="text-center text-muted">Loading orders...</p>
    </div>
  `;

  try {
    const res = await fetch(`${API}/orders`);
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Backend returned HTML instead of JSON");
    }

    if (!res.ok) {
      throw new Error(data.message || "Failed to load orders");
    }

    const allOrders = Array.isArray(data.orders) ? data.orders : [];

    const farmerOrders = allOrders.filter((order) => {
      const orderFarmerId = order.farmerid || order.farmer_id || order.farmerId;
      return String(orderFarmerId) === String(farmerId);
    });

    console.log("ALL ORDERS:", allOrders);
    console.log("LOGGED FARMER ID:", farmerId);
    console.log("MATCHED FARMER ORDERS:", farmerOrders);

    if (farmerOrders.length === 0) {
      container.innerHTML = `
        <div class="col-12">
          <p class="text-center text-muted">No orders yet</p>
        </div>
      `;
      return;
    }

    container.innerHTML = farmerOrders.map((order) => {
      const cropName = "🌾 " + (order.cropname || order.crop_name || order.cropName || "Unknown Crop");
      const buyerName = order.salesmanname || order.salesman_name || order.salesmanName || order.name || "N/A";
      const buyerPhone =  (order.salesmanphone || order.salesman_phone || order.salesmanPhone || order.phone || "N/A");
      const quantity = "📦 " + Number(order.quantity || 0);
      const status = String(order.status || "pending").toLowerCase();
      const orderId = order.orderid || order.order_id || order.id;

      let statusHtml = "";
      if (status === "accepted" || status === "approved") {
        statusHtml = `<span class="badge bg-success px-3 py-2 rounded-pill">Accepted</span>`;
      } else if (status === "rejected") {
        statusHtml = `<span class="badge bg-danger px-3 py-2 rounded-pill">Rejected</span>`;
      } else {
        statusHtml = `
          <div class="d-flex flex-wrap gap-2 mt-2">
            <button class="btn btn-success btn-sm px-3"
              onclick="updateOrderStatus(${orderId}, 'accepted')">
              Accept
            </button>
            <button class="btn btn-danger btn-sm px-3"
              onclick="updateOrderStatus(${orderId}, 'rejected')">
              Reject
            </button>
          </div>
        `;
      }

      return `
        <div class="col-md-6 col-lg-4">
          <div class="card received-order-card h-100 border-0 shadow-sm">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-3 gap-2">
                <div>
                  <h5 class="card-title fw-bold mb-1">${cropName}</h5>
                  <p class="mb-0 text-muted small">Incoming order request</p>
                </div>
                <span class="badge bg-light text-dark rounded-pill px-3 py-2">
                  ${quantity} kg
                </span>
              </div>

              <div class="mb-3">
                <p class="mb-2"><strong>👩🏻‍💼 Buyer:</strong> ${buyerName}</p>
                <p class="mb-2"><strong>📞 Phone:</strong> ${buyerPhone}</p>
                <p class="mb-0"><strong>📌 Status:</strong> ${status.charAt(0).toUpperCase() + status.slice(1)}</p>
              </div>

              <div class="mt-3">
                ${statusHtml}
              </div>
            </div>
          </div>
        </div>
      `;
    }).join("");

  } catch (err) {
    console.error("Farmer orders error:", err);
    container.innerHTML = `
      <div class="col-12">
        <p class="text-center text-danger">${err.message}</p>
      </div>
    `;
  }
}

async function updateOrderStatus(orderId, status) {
  try {
    const res = await fetch(`${API}/updateorderstatus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        orderid: orderId,
        status: status
      })
    });

    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Server did not return JSON");
    }

    if (!res.ok) {
      throw new Error(data.message || "Failed to update order");
    }

    alert(data.message || "Order updated successfully");
    loadFarmerOrders();

  } catch (err) {
    console.error("Update order error:", err);
    alert(err.message);
  }
}

document.addEventListener("DOMContentLoaded", loadFarmerOrders);