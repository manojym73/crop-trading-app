function getStatusBadge(status) {
  const normalized = (status || "").toLowerCase();

  if (normalized === "accepted") return "bg-success";
  if (normalized === "rejected") return "bg-danger";
  return "bg-warning text-dark";
}

async function parseResponse(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Server returned invalid response: ${text.slice(0, 120)}`);
  }
}

async function loadOrders() {
  const container = document.getElementById("orders-list");
  if (!container) return;

  container.innerHTML = `<p class="text-center text-muted">Loading orders...</p>`;

  try {
    const res = await fetch(`${API}/orders`);
    const data = await parseResponse(res);

    if (!res.ok) throw new Error(data.message || "Failed to load orders");

    if (!data.orders || data.orders.length === 0) {
      container.innerHTML = `<p class="text-center text-muted">No orders available</p>`;
      return;
    }

    container.innerHTML = `
      <div class="row g-4">
        ${data.orders.map(order => {
      const badgeClass = getStatusBadge(order.status);
      const total = Number(order.quantity || 0) * Number(order.price || 0);

      return `
            <div class="col-lg-4 col-md-6" data-aos="fade-up">
              <div class="card p-3 border-0 shadow-lg h-100 order-card glass-card">
                <h5 class="fw-bold mb-3">${order.crop_name || "Crop"}</h5>
                <p class="mb-1"><b>Farmer:</b> ${order.farmer_name || "N/A"}</p>
                <p class="mb-1"><b>Salesman:</b> ${order.salesman_name || "N/A"}</p>
                <p class="mb-1"><b>Quantity:</b> ${order.quantity || 0} kg</p>
                <p class="mb-1"><b>Price:</b> ₹${order.price || 0}/kg</p>
                <p class="mb-1"><b>Total:</b> ₹${total}</p>
                <p class="mb-0"><b>Status:</b> <span class="badge ${badgeClass}">${order.status || "pending"}</span></p>
              </div>
            </div>
          `;
    }).join("")}
      </div>
    `;
  } catch (err) {
    console.error("Load all orders error:", err);
    container.innerHTML = `<p class="text-danger text-center">${err.message}</p>`;
  }
}


// async function loadSalesmanOrders() {
//   const salesmanId = localStorage.getItem("salesmanid");
//   const container = document.getElementById("orders-list");

//   if (!container) return;

//   if (!salesmanId) {
//     container.innerHTML = `<p class="text-center text-danger">Please login as Salesman</p>`;
//     return;
//   }

//   container.innerHTML = `<p class="text-center text-muted">Loading orders...</p>`;

//   try {
//     const res = await fetch(`${API}/orders`);
//     const text = await res.text();

//     let data;
//     try {
//       data = JSON.parse(text);
//     } catch {
//       throw new Error("Backend returned HTML instead of JSON");
//     }

//     if (!res.ok) {
//       throw new Error(data.message || "Failed to load orders");
//     }

//     const allOrders = Array.isArray(data.orders) ? data.orders : [];

//     const myOrders = allOrders.filter(order =>
//       String(order.salesmanid || order.salesman_id || order.salesmanId) === String(salesmanId)
//     );

//     console.log("ALL ORDERS:", allOrders);
//     console.log("LOGGED SALESMAN ID:", salesmanId);
//     console.log("MATCHED SALESMAN ORDERS:", myOrders);

//     if (myOrders.length === 0) {
//       container.innerHTML = `<p class="text-center text-muted">No orders yet</p>`;
//       return;
//     }

//     let html = `<div class="row g-4">`;

//     myOrders.forEach(order => {
//       const cropName = order.cropname || order.crop_name || "Unknown Crop";
//       const farmerName = order.farmername || order.farmer_name || "N/A";
//       const farmerPhone = order.farmerphone || order.farmer_phone || "N/A";
//       const quantity = Number(order.quantity || 0);
//       const price = Number(order.price || 0);
//       const total = quantity * price;
//       const status = String(order.status || "pending").toLowerCase();

//       const badgeClass =
//         status === "accepted" || status === "approved"
//           ? "bg-success"
//           : status === "rejected"
//             ? "bg-danger"
//             : "bg-warning text-dark";

//       html += `
//         <div class="col-md-4">
//           <div class="card p-3 shadow-sm h-100 order-card">
//             <h5 class="fw-bold mb-3">${cropName}</h5>
//             <p class="mb-1"><b>Farmer:</b> ${farmerName}</p>
//             <p class="mb-1"><b>Quantity:</b> ${quantity} kg</p>
//             <p class="mb-1"><b>Price:</b> ${price}/kg</p>
//             <p class="mb-1"><b>Total:</b> ${total}</p>
//             <p class="mb-1"><b>Status:</b> <span class="badge ${badgeClass}">${status}</span></p>
//             ${status === "accepted" || status === "approved"
//           ? `<p class="mb-0"><b>Farmer Phone:</b> ${farmerPhone}</p>`
//           : ``
//         }
//           </div>
//         </div>
//       `;
//     });

//     html += `</div>`;
//     container.innerHTML = html;

//   } catch (err) {
//     console.error("Salesman orders error:", err);
//     container.innerHTML = `<p class="text-danger text-center">${err.message}</p>`;
//   }
// }
function loadSalesmanOrders() {
  const salesmanId = localStorage.getItem("salesmanid");
  const container = document.getElementById("orders-list");

  if (!container) return;

  if (!salesmanId) {
    alert("Please login as Salesman.");
    window.location.href = "login.html";
    return;
  }

  container.innerHTML = `<p class="text-center text-muted">Loading orders...</p>`;

  fetch(`${API}/salesman_orders/${salesmanId}`)
    .then(async (res) => {
      const data = await parseResponse(res);
      if (!res.ok) throw new Error(data.message || "Failed to load orders");
      return data;
    })
    .then((data) => {
      const orders = Array.isArray(data.orders) ? data.orders : [];

      if (orders.length === 0) {
        container.innerHTML = `<p class="text-center text-muted">No orders yet</p>`;
        return;
      }

      const html = orders.map((order) => {
        const orderId = order.order_id ?? order.orderid;
        const cropName = order.crop_name ?? order.cropname ?? "Unknown Crop";
        const farmerName = order.farmer_name ?? order.farmername ?? "N/A";
        const farmerPhone = order.farmer_phone ?? order.farmerphone ?? "N/A";
        const quantity = Number(order.quantity || 0);
        const price = Number(order.price || 0);
        const status = String(order.status || "").toLowerCase();

        let statusBadge = `<span class="badge bg-warning text-dark">Pending</span>`;

        if (status === "accepted" || status === "approved") {
          statusBadge = `<span class="badge bg-success">Accepted</span>`;
        } else if (status === "rejected") {
          statusBadge = `<span class="badge bg-danger">Rejected</span>`;
        }

        return `
          <div class="col-md-4">
            <div class="card p-3 shadow-sm h-100 border-0">
              <h5>${cropName}</h5>
              <p>👨‍🌾 <b>Farmer:</b> ${farmerName}</p>
              <p>📦 <b>Quantity:</b> ${quantity} kg</p>
              <p>💰 <b>Price:</b> ₹${price}/kg</p>
              <p>📌 <b>Status:</b> ${statusBadge}</p>

              ${
                status === "accepted" || status === "approved"
                  ? `<p>📞 <b>Farmer Phone:</b> ${farmerPhone}</p>`
                  : ""
              }

              ${
                status === "pending"
                  ? `
                    <div class="mt-2">
                      <button class="btn btn-success btn-sm me-2"
                        onclick="openUpdateOrderModal(${orderId}, '${cropName}', ${quantity})">
                        Update
                      </button>
                      <button class="btn btn-danger btn-sm" onclick="deleteOrder(${orderId})">
                        Delete
                      </button>
                    </div>
                  `
                  : ""
              }
            </div>
          </div>
        `;
      }).join("");

      container.innerHTML = html;
    })
    .catch((err) => {
      console.error("Salesman orders error:", err);
      container.innerHTML = `<p class="text-center text-danger">Failed to load orders</p>`;
    });
}

function showOrders() {
  const ordersSection = document.getElementById("orders-section");
  const cropList = document.getElementById("market-section");

  if (ordersSection) ordersSection.style.display = "block";
  if (cropList) cropList.style.display = "none";

  loadSalesmanOrders();
}

function goBackToMarket() {
  const ordersSection = document.getElementById("orders-section");
  const cropList = document.getElementById("market-section");

  if (ordersSection) ordersSection.style.display = "none";
  if (cropList) cropList.style.display = "block";
}

function editOrder(orderId, oldQty) {
  const salesmanId = localStorage.getItem("salesmanid");
  const newQty = prompt("Enter new quantity:", oldQty);

  if (!newQty) return;

  fetch(API + "/update_salesman_order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      order_id: orderId,
      salesman_id: salesmanId,
      quantity: newQty
    })
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update order");
      return data;
    })
    .then((data) => {
      alert(data.message);
      loadSalesmanOrders();
    })
    .catch((err) => {
      alert(err.message);
    });
}

function deleteOrder(orderId) {
  const salesmanId = localStorage.getItem("salesmanid");
  if (!confirm("Do you want to delete this order?")) return;

  fetch(API + "/delete_salesman_order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      order_id: orderId,
      salesman_id: salesmanId
    })
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete order");
      return data;
    })
    .then((data) => {
      alert(data.message);
      loadSalesmanOrders();
    })
    .catch((err) => {
      alert(err.message);
    });
}

function openUpdateOrderModal(orderId, cropName, quantity) {
  document.getElementById("update-order-id").value = orderId;
  document.getElementById("update-crop-name").value = cropName;
  document.getElementById("update-order-quantity").value = quantity;

  const modal = new bootstrap.Modal(document.getElementById("updateOrderModal"));
  modal.show();
}

function saveUpdatedOrder() {
  const orderId = document.getElementById("update-order-id").value;
  const quantity = Number(document.getElementById("update-order-quantity").value);
  const salesmanId = localStorage.getItem("salesmanid");

  if (!salesmanId) {
    alert("Please login as Salesman.");
    return;
  }

  if (!quantity || quantity <= 0) {
    alert("Please enter valid quantity.");
    return;
  }

  fetch(`${API}/update_salesman_order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      order_id: Number(orderId),
      salesman_id: Number(salesmanId),
      quantity: quantity
    })
  })
    .then(async (res) => {
      const data = await parseResponse(res);
      if (!res.ok) throw new Error(data.message || "Failed to update order");
      return data;
    })
    .then((data) => {
      alert(data.message || "Order updated successfully");

      const modalEl = document.getElementById("updateOrderModal");
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();

      loadSalesmanOrders();
    })
    .catch((err) => {
      console.error("Update salesman order error:", err);
      alert(err.message);
    });
}

function deleteOrder(orderId) {
  const salesmanId = localStorage.getItem("salesmanid");

  if (!salesmanId) {
    alert("Please login as Salesman.");
    return;
  }

  if (!confirm("Are you sure you want to delete this order?")) return;

  fetch(`${API}/delete_salesman_order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      order_id: Number(orderId),
      salesman_id: Number(salesmanId)
    })
  })
    .then(async (res) => {
      const data = await parseResponse(res);
      if (!res.ok) throw new Error(data.message || "Failed to delete order");
      return data;
    })
    .then((data) => {
      alert(data.message || "Order deleted successfully");
      loadSalesmanOrders();
    })
    .catch((err) => {
      console.error("Delete order error:", err);
      alert(err.message);
    });
}