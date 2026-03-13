const API = "http://127.0.0.1:5000";

function loadOrders(){

fetch(API + "/orders")

.then(res=>res.json())

.then(data=>{

let html=""

data.orders.forEach(order=>{

html+=`
<div class="card">

<h3>${order.crop_name}</h3>

<p><b>Farmer:</b> ${order.farmer_name}</p>

<p><b>Salesman:</b> ${order.salesman_name}</p>

<p><b>Quantity:</b> ${order.quantity}</p>

<p><b>Status:</b> ${order.status}</p>

<button onclick="updateOrder(${order.order_id},'Approved')">Approve</button>

<button onclick="updateOrder(${order.order_id},'Rejected')">Reject</button>

</div>
`
})

document.getElementById("orders-list").innerHTML=html

})

}


function updateOrder(order_id,status){

fetch(API + "/update_order_status",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
order_id:order_id,
status:status
})

})

.then(res=>res.json())

.then(data=>{
alert(data.message)
loadOrders()
})

}