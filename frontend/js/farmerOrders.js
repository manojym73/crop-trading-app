// function getFarmerStatusUI(order) {
//     const status = String(order.status || "").toLowerCase();
//     const orderId = order.order_id;

//     if (status === "accepted") {
//         return `<span class="badge bg-success">Accepted</span>`;
//     }

//     if (status === "rejected") {
//         return `<span class="badge bg-danger">Rejected</span>`;
//     }

//     return `
//     <button class="btn btn-success btn-sm me-2" onclick="updateOrderStatus(${orderId}, 'accepted')">
//       <i class="bi bi-check-circle me-1"></i>Accept
//     </button>
//     <button class="btn btn-danger btn-sm" onclick="updateOrderStatus(${orderId}, 'rejected')">
//       <i class="bi bi-x-circle me-1"></i>Reject
//     </button>
//   `;
// }

// async function loadFarmerOrders() {
//     const farmerId = localStorage.getItem("farmerid");
//     const container = document.getElementById("farmer-orders");

//     if (!container) return;

//     if (!farmerId) {
//         container.innerHTML = `<p class="text-center text-danger">Farmer not logged in</p>`;
//         return;
//     }

//     container.innerHTML = `<p class="text-center text-muted">Loading orders...</p>`;

//     try {
//         const res = await fetch(`${API}/orders`);
//         const text = await res.text();

//         let data;
//         try {
//             data = JSON.parse(text);
//         } catch {
//             throw new Error("Backend returned HTML instead of JSON. Check Flask route.");
//         }

//         if (!res.ok) {
//             throw new Error(data.message || "Failed to load orders");
//         }

//         const allOrders = Array.isArray(data.orders) ? data.orders : [];

//         console.log("ALL ORDERS:", allOrders);
//         console.log("LOGGED FARMER ID:", farmerId);

//         const farmerOrders = allOrders.filter(order =>
//             String(order.farmerid || order.farmer_id || order.farmerId) === String(farmerId)
//         );

//         console.log("MATCHED FARMER ORDERS:", farmerOrders);

//         if (farmerOrders.length === 0) {
//             container.innerHTML = `<p class="text-center text-muted">No orders yet</p>`;
//             return;
//         }


//         container.innerHTML = farmerOrders.map(order => {
//             const cropName = order.cropname || "Unknown Crop";
//             const buyerName = order.salesmanname || order.name || "N/A";
//             const buyerPhone = order.salesmanphone || order.phone || "N/A";
//             const buyerEmail = order.salesmanemail || order.email || "N/A";
//             const quantity = Number(order.quantity || 0);
//             const status = String(order.status || "pending").toLowerCase();

//             return `
//         <div class="col-md-4">
//           <div class="card p-3 shadow-sm h-100">
//             <h5>${cropName}</h5>
//             <p><b>Buyer:</b> ${buyerName}</p>
//             <p><b>Phone:</b> ${buyerPhone}</p>
//             <p><b>Email:</b> ${buyerEmail}</p>
//             <p><b>Quantity:</b> ${quantity} kg</p>
//             <div class="mt-2">
//               ${status === "accepted" || status === "approved"
//                     ? `<span class="badge bg-success">Accepted</span>`
//                     : status === "rejected"
//                         ? `<span class="badge bg-danger">Rejected</span>`
//                         : `
//                     <button class="btn btn-success btn-sm me-2" onclick="updateOrderStatus(${order.orderid}, 'accepted')">Accept</button>
//                     <button class="btn btn-danger btn-sm" onclick="updateOrderStatus(${order.orderid}, 'rejected')">Reject</button>
//                   `
//                 }
//             </div>
//           </div>
//         </div>
//       `;
//         }).join("");
//     } catch (err) {
//         console.error("Farmer orders error:", err);
//         container.innerHTML = `<p class="text-center text-danger">${err.message}</p>`;
//     }
// }

// async function updateOrderStatus(orderId, status) {
//     try {
//         const res = await fetch(`${API}/updateorderstatus`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ orderid: orderId, status: status })
//         });

//         const data = await res.json();

//         if (!res.ok) {
//             throw new Error(data.message || "Failed to update order");
//         }

//         alert(data.message || "Order updated successfully");
//         loadFarmerOrders();
//     } catch (err) {
//         console.error("Update order error:", err);
//         alert(err.message);
//     }
// }
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
    container.innerHTML = `<p class="text-center text-danger">Farmer not logged in</p>`;
    return;
  }

  container.innerHTML = `<p class="text-center text-muted">Loading orders...</p>`;

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

    const farmerOrders = allOrders.filter(order =>
      String(order.farmerid || order.farmer_id || order.farmerId) === String(farmerId)
    );

    console.log("ALL ORDERS:", allOrders);
    console.log("LOGGED FARMER ID:", farmerId);
    console.log("MATCHED FARMER ORDERS:", farmerOrders);

    if (farmerOrders.length === 0) {
      container.innerHTML = `<p class="text-center text-muted">No orders yet</p>`;
      return;
    }

    container.innerHTML = farmerOrders.map(order => {
      const cropName = order.cropname || order.crop_name || "Unknown Crop";
      const buyerName = order.salesmanname || order.salesman_name || order.name || "N/A";
      const buyerPhone = order.salesmanphone || order.salesman_phone || order.phone || "N/A";

      const quantity = Number(order.quantity || 0);
      const status = String(order.status || "pending").toLowerCase();
      const orderId = order.orderid || order.order_id;

      return `
        <div class="col-md-4">
          <div class="card p-3 shadow-sm h-100">
            <h5>${cropName}</h5>
            <p><b>Buyer:</b> ${buyerName}</p>
            <p><b>Phone:</b> ${buyerPhone}</p>
            
            <p><b>Quantity:</b> ${quantity} kg</p>
            <div class="mt-2">
              ${status === "accepted" || status === "approved"
          ? `<span class="badge bg-success">Accepted</span>`
          : status === "rejected"
            ? `<span class="badge bg-danger">Rejected</span>`
            : `
                    <button class="btn btn-success btn-sm me-2" onclick="updateOrderStatus(${orderId}, 'accepted')">Accept</button>
                    <button class="btn btn-danger btn-sm" onclick="updateOrderStatus(${orderId}, 'rejected')">Reject</button>
                  `
        }
            </div>
          </div>
        </div>
      `;
    }).join("");

  } catch (err) {
    console.error("Farmer orders error:", err);
    container.innerHTML = `<p class="text-center text-danger">${err.message}</p>`;
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