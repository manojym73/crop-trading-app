const API = "http://127.0.0.1:5000";


function addCrop() {

    let farmer_id = localStorage.getItem("farmer_id");

    let crop_name = document.getElementById("crop_name").value;
    let quantity = document.getElementById("quantity").value;
    let price = document.getElementById("price").value;
    let location = document.getElementById("location").value;

    fetch("http://127.0.0.1:5000/add_crop", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            farmer_id: farmer_id,
            crop_name: crop_name,
            quantity: quantity,
            price: price,
            location: location

        })

    })

        .then(res => res.json())
        .then(data => {

            alert(data.message);

        });

}


function loadCrops() {

    fetch(API + "/crops")

        .then(res => res.json())

        .then(data => {

            let html = ""

            data.crops.forEach(crop => {

                html += `

<div class="crop-card">

<h3>${crop.crop_name}</h3>

<p>Farmer: ${crop.farmer_name}</p>

<p>Price: ₹${crop.price}</p>

<p>Quantity: ${crop.quantity}</p>

<input id="qty-${crop.crop_id}" placeholder="Quantity">

<button onclick="placeOrder(${crop.crop_id})">Buy</button>

</div>

`

            })

            document.getElementById("crop-list").innerHTML = html

        })

}



function placeOrder(crop_id) {

    let qty = document.getElementById(`qty-${crop_id}`).value

    fetch(API + "/place_order", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            salesman_id: 10,
            crop_id: crop_id,
            quantity: qty

        })

    })

        .then(res => res.json())

        .then(data => {

            alert(data.message)

        })

}



function loadOrders() {

    fetch(API + "/orders")

        .then(res => res.json())

        .then(data => {

            let html = ""

            data.orders.forEach(order => {

                html += `

<div class="crop-card">

<p>Crop: ${order.crop_name}</p>

<p>Farmer: ${order.farmer_name}</p>

<p>Salesman: ${order.salesman_name}</p>

<p>Quantity: ${order.quantity}</p>

<p>Status: ${order.status}</p>

</div>

`

            })

            document.getElementById("orders").innerHTML = html

        })

}

// load crops and orders on page load
function loadCrops() {

    fetch("http://127.0.0.1:5000/crops")

        .then(response => response.json())

        .then(data => {

            let html = "";

            data.crops.forEach(crop => {

                html += `
<div class="crop-card">

<h3>${crop.crop_name}</h3>

<p>Farmer: ${crop.farmer_name}</p>

<p>Quantity: ${crop.quantity}</p>

<p>Price: ₹${crop.price}</p>

<input id="qty-${crop.crop_id}" placeholder="Quantity">

<button onclick="placeOrder(${crop.crop_id})">Buy</button>

</div>
`;

            });

            document.getElementById("crop-list").innerHTML = html;

        });

}

// place order function
function placeOrder(crop_id) {

    let salesman_id = localStorage.getItem("salesman_id");

    let quantity = document.getElementById(`qty-${crop_id}`).value;

    fetch("http://127.0.0.1:5000/place_order", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            salesman_id: salesman_id,
            crop_id: crop_id,
            quantity: quantity

        })

    })

        .then(res => res.json())

        .then(data => {

            alert(data.message);

            loadCrops();

        });

}

function loadOrders() {

    fetch("http://127.0.0.1:5000/orders")

        .then(response => response.json())

        .then(data => {

            let html = "";

            data.orders.forEach(order => {

                html += `
<div class="crop-card">

<h3>${order.crop_name}</h3>

<p>Farmer: ${order.farmer_name}</p>

<p>Salesman: ${order.salesman_name}</p>

<p>Quantity: ${order.quantity}</p>

<p>Status: ${order.status}</p>

<p>Date: ${order.order_date}</p>

</div>
`;

            });

            document.getElementById("orders-list").innerHTML = html;

        });

}