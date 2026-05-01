// ===============================
function loadOrders() {

    fetch(API + "/orders")
        .then(res => res.json())
        .then(data => {

            let html = ""

            if (data.orders.length === 0) {
                html = "<p>No orders available</p>"
            }

            data.orders.forEach(order => {

                let badgeClass = "bg-warning"

                if (order.status === "Approved") {
                    badgeClass = "bg-success"
                }
                else if (order.status === "Rejected") {
                    badgeClass = "bg-danger"
                }

                html += `
<div class="card">

<h3>${order.crop_name}</h3>

<p><b>Farmer:</b> ${order.farmer_name}</p>
<p><b>Salesman:</b> ${order.salesman_name}</p>

<p><b>Quantity:</b> ${order.quantity} kg</p>

<p><b>Price:</b> ₹${order.price} / kg</p>

<p><b>Total:</b> ₹${order.quantity * order.price}</p>

<p>Status: <span class="badge ${badgeClass}">${order.status}</span></p>
`

                // ✅ show contact AFTER approval
                if (order.status === "Approved") {
                    html += `<p>📞 Contact: ${order.salesman_phone}</p>`
                }

                // ✅ only show buttons if pending
                if (order.status === "Pending") {
                    html += `
<button onclick="updateOrder(${order.order_id}, 'Approved')">Approve</button>
<button onclick="updateOrder(${order.order_id}, 'Rejected')">Reject</button>
`
                }

                html += `</div>`
            })

            document.getElementById("orders-list").innerHTML = html
        })
}

// ===============================
// UPDATE ORDER STATUS
// ===============================

function updateOrder(order_id, status) {

    fetch(API + "/update_order_status", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ order_id, status })
    })
        .then(res => {
            // handle non-OK responses
            if (!res.ok) {
                return res.json().then(err => {
                    throw new Error(err.message || "Server error")
                })
            }
            return res.json()
        })
        .then(data => {
            alert(data.message)

            loadFarmerOrders()   // ✅ only this

            // ❌ REMOVE THIS LINE
            // loadCrops()
        })
        .catch(err => {
            alert(err.message || "Something went wrong")
        })
}


// ===============================
// LOAD ORDERS FOR SPECIFIC SALESMAN
// ===============================
function loadSalesmanOrders() {

    let salesman_id = localStorage.getItem("salesman_id")

    fetch(API + "/salesman_orders/" + salesman_id)
        .then(res => res.json())
        .then(data => {

            let html = ""

            if (data.orders.length === 0) {
                html = "<p>No orders yet</p>"
            }

            data.orders.forEach(order => {

                html += `
<div class="card">

<h3>${order.crop_name}</h3>

<p><b>Farmer:</b> ${order.farmer_name}</p>

<p><b>Quantity:</b> ${order.quantity} kg</p>

<p><b>Status:</b> ${order.status}</p>
`

                // ✅ show farmer contact after approval
                if (order.status === "Approved") {
                    html += `<p>📞 Farmer: ${order.farmer_phone}</p>`
                }

                html += `</div>`
            })

            document.getElementById("orders-list").innerHTML = html
        })
}

// Show salesman orders section
function showOrders() {
    document.getElementById("orders-section").style.display = "block";
    document.getElementById("crop-list").style.display = "none";

    loadOrders();
}

// Go back to crop marketplace
function goBackToMarket() {
    document.getElementById("orders-section").style.display = "none";
    document.getElementById("crop-list").style.display = "flex";
}