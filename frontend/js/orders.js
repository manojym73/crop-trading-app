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


async function loadSalesmanOrders() {
  const salesmanId = localStorage.getItem("salesmanid");
  const container = document.getElementById("orders-list");

  if (!container) return;

  if (!salesmanId) {
    container.innerHTML = `<p class="text-center text-danger">Please login as Salesman</p>`;
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

    const myOrders = allOrders.filter(order =>
      String(order.salesmanid || order.salesman_id || order.salesmanId) === String(salesmanId)
    );

    console.log("ALL ORDERS:", allOrders);
    console.log("LOGGED SALESMAN ID:", salesmanId);
    console.log("MATCHED SALESMAN ORDERS:", myOrders);

    if (myOrders.length === 0) {
      container.innerHTML = `<p class="text-center text-muted">No orders yet</p>`;
      return;
    }

    let html = `<div class="row g-4">`;

    myOrders.forEach(order => {
      const cropName = order.cropname || order.crop_name || "Unknown Crop";
      const farmerName = order.farmername || order.farmer_name || "N/A";
      const farmerPhone = order.farmerphone || order.farmer_phone || "N/A";
      const quantity = Number(order.quantity || 0);
      const price = Number(order.price || 0);
      const total = quantity * price;
      const status = String(order.status || "pending").toLowerCase();

      const badgeClass =
        status === "accepted" || status === "approved"
          ? "bg-success"
          : status === "rejected"
            ? "bg-danger"
            : "bg-warning text-dark";

      html += `
        <div class="col-md-4">
          <div class="card p-3 shadow-sm h-100 order-card">
            <h5 class="fw-bold mb-3">${cropName}</h5>
            <p class="mb-1"><b>Farmer:</b> ${farmerName}</p>
            <p class="mb-1"><b>Quantity:</b> ${quantity} kg</p>
            <p class="mb-1"><b>Price:</b> ${price}/kg</p>
            <p class="mb-1"><b>Total:</b> ${total}</p>
            <p class="mb-1"><b>Status:</b> <span class="badge ${badgeClass}">${status}</span></p>
            ${status === "accepted" || status === "approved"
          ? `<p class="mb-0"><b>Farmer Phone:</b> ${farmerPhone}</p>`
          : ``
        }
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;

  } catch (err) {
    console.error("Salesman orders error:", err);
    container.innerHTML = `<p class="text-danger text-center">${err.message}</p>`;
  }
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