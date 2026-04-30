function loadFarmerOrders(){

    let farmer_id = localStorage.getItem("farmer_id")

    fetch(API + "/farmer_orders/" + farmer_id)
    .then(res => res.json())
    .then(data => {

        let html = ""

        if(data.orders.length === 0){
            html = "<p>No orders received</p>"
        }

        data.orders.forEach(order => {

            html += `
<div class="card">

<h3>${order.crop_name}</h3>

<p><b>Salesman:</b> ${order.salesman_name}</p>

<p><b>Quantity:</b> ${order.quantity} kg</p>

<p><b>Status:</b> ${order.status}</p>
`

            // ✅ show phone after approval
            if(order.status === "Approved"){
                html += `<p>📞 Salesman: ${order.salesman_phone}</p>`
            }

            // ✅ show buttons if pending
            if(order.status === "Pending"){
                html += `
<button onclick="updateOrder(${order.order_id}, 'Approved')">Approve</button>
<button onclick="updateOrder(${order.order_id}, 'Rejected')">Reject</button>
`
            }

            html += `</div>`
        })

        document.getElementById("farmer-orders").innerHTML = html
    })
}