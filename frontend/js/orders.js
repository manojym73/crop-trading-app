// function loadOrders() {

//     fetch(API + "/orders")

//         .then(res => res.json())

//         .then(data => {

//             let html = ""

//             data.orders.forEach(order => {

//                 html += `
// <div class="card">

// <h3>${order.crop_name}</h3>

// <p><b>Farmer:</b> ${order.farmer_name}</p>

// <p><b>Salesman:</b> ${order.salesman_name}</p>

// <p><b>Quantity:</b> ${order.quantity}</p>

// <p><b>Status:</b> ${order.status}</p>

// <button onclick="updateOrder(${order.order_id},'Approved')">Approve</button>

// <button onclick="updateOrder(${order.order_id},'Rejected')">Reject</button>

// </div>
// `
//             })

//             document.getElementById("orders-list").innerHTML = html

//         })

// }


// function updateOrder(order_id, status) {

//     fetch(API + "/update_order_status", {

//         method: "POST",

//         headers: {
//             "Content-Type": "application/json"
//         },

//         body: JSON.stringify({
//             order_id: order_id,
//             status: status
//         })

//     })

//         .then(res => res.json())

//         .then(data => {
//             alert(data.message)
//             loadOrders()
//         })

// }

// // order for specific salesman
// function loadSalesmanOrders(){

// let salesman_id = localStorage.getItem("salesman_id")

// fetch(API + "/salesman_orders/" + salesman_id)

// .then(res=>res.json())

// .then(data=>{

// let html=""

// data.orders.forEach(order=>{

// html+=`
// <div class="card">

// <h3>${order.crop_name}</h3>

// <p><b>Farmer:</b> ${order.farmer_name}</p>

// <p><b>Quantity:</b> ${order.quantity}</p>

// <p><b>Status:</b> ${order.status}</p>

// </div>
// `

// })

// document.getElementById("orders-list").innerHTML=html

// })

// }
// ===============================
// LOAD ALL ORDERS (For Farmer)
// ===============================

function loadOrders() {

    // Call backend API to get all orders
    fetch(API + "/orders")

        .then(res => res.json())

        .then(data => {

            let html = ""

            // If there are no orders
            if (data.orders.length === 0) {
                html = "<p>No orders available</p>"
            }

            // Loop through each order
            data.orders.forEach(order => {

                html += `
<div class="card">

<h3>${order.crop_name}</h3>

<p><b>Farmer:</b> ${order.farmer_name}</p>

<p><b>Salesman:</b> ${order.salesman_name}</p>

<p><b>Quantity:</b> ${order.quantity}</p>

<p><b>Status:</b> ${order.status}</p>

<!-- Farmer can approve or reject order -->
<button onclick="updateOrder(${order.order_id},'Approved')">Approve</button>

<button onclick="updateOrder(${order.order_id},'Rejected')">Reject</button>

</div>
`
            })

            // Display orders on page
            document.getElementById("orders-list").innerHTML = html

        })

}


// ===============================
// UPDATE ORDER STATUS
// ===============================

function updateOrder(order_id, status) {

    // Send request to backend to update order
    fetch(API + "/update_order_status", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            order_id: order_id,
            status: status
        })

    })

        .then(res => res.json())

        .then(data => {

            // Show confirmation message
            alert(data.message)

            // Reload orders after update
            loadOrders()

        })

}


// ===============================
// LOAD ORDERS FOR SPECIFIC SALESMAN
// ===============================

function loadSalesmanOrders() {

    // Get salesman ID from browser storage
    let salesman_id = localStorage.getItem("salesman_id")

    // Call backend API
    fetch(API + "/salesman_orders/" + salesman_id)

        .then(res => res.json())

        .then(data => {

            let html = ""

            // If no orders
            if (data.orders.length === 0) {
                html = "<p>You have no orders yet</p>"
            }

            // Loop through orders
            data.orders.forEach(order => {

                html += `
<div class="card">

<h3>${order.crop_name}</h3>

<p><b>Farmer:</b> ${order.farmer_name}</p>

<p><b>Quantity:</b> ${order.quantity}</p>

<p><b>Status:</b> ${order.status}</p>

</div>
`
            })

            // Display orders on page
            document.getElementById("orders-list").innerHTML = html

        })

}

// Show salesman orders section
function showOrders() {

    // hide crop marketplace
    document.getElementById("crop-list").style.display = "none"

    // show orders section
    document.getElementById("orders-section").style.display = "block"

    // load orders for this salesman
    loadSalesmanOrders()

}