function loadFarmerOrders() {

    let farmer_id = localStorage.getItem("farmer_id");

    fetch(API + "/farmer_orders/" + farmer_id)
        .then(res => res.json())
        .then(data => {

            console.log("ORDERS:", data.orders);

            let container = document.getElementById("farmer-orders");

            let html = "";

            if (!data.orders || data.orders.length === 0) {
                container.innerHTML = "<p>No orders yet</p>";
                return;
            }

            data.orders.forEach(order => {

                // ✅ USE CORRECT KEYS FROM BACKEND
                let name  = order.salesman_name  || "N/A";
                let email = order.salesman_email || "N/A"; // (not coming yet)
                let phone = order.salesman_phone || "N/A";

                let statusUI = "";

                if (order.status === "accepted") {
                    statusUI = `<span class="badge bg-success">Accepted</span>`;
                }
                else if (order.status === "rejected") {
                    statusUI = `<span class="badge bg-danger">Rejected</span>`;
                }
                else {
                    statusUI = `
                        <button class="btn btn-success btn-sm me-2"
                            onclick="updateOrder(${order.order_id}, 'accepted')">
                            ✔ Accept
                        </button>

                        <button class="btn btn-danger btn-sm"
                            onclick="updateOrder(${order.order_id}, 'rejected')">
                            ✖ Reject
                        </button>
                    `;
                }

                html += `
                <div class="col-md-4">
                    <div class="card p-3 shadow-sm">

                        <h5>${order.crop_name}</h5>

                        <p>👤 <b>Buyer:</b> ${name}</p>

                        <p>📞 <b>Phone:</b> ${phone}</p>

                        <p>🌾 <b>Quantity:</b> ${order.quantity} kg</p>

                        <div class="mt-2">
                            ${statusUI}
                        </div>

                    </div>
                </div>
                `;
            });

            container.innerHTML = html;
        });
}