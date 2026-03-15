// ADD CROP
function addCrop() {

    let farmer_id = localStorage.getItem("farmer_id")

    let formData = new FormData()

    formData.append("farmer_id", farmer_id)
    formData.append("crop_name", document.getElementById("crop_name").value)
    formData.append("quantity", document.getElementById("quantity").value)
    formData.append("price", document.getElementById("price").value)
    formData.append("location", document.getElementById("location").value)
    formData.append("image", document.getElementById("image").files[0])

    fetch(API + "/add_crop", {
        method: "POST",
        body: formData
    })
        .then(res => res.json())
        .then(data => alert(data.message))

}


// LOAD CROPS
function loadCrops() {

    fetch(API + "/crops")

        .then(res => res.json())

        .then(data => {

            let html = ""

            data.crops.forEach(crop => {

                html += `
<div class="card">

<img src="http://127.0.0.1:5000/uploads/${crop.image}"
style="width:200px;height:150px;object-fit:cover;margin-bottom:10px;">

<h3>${crop.crop_name}</h3>

<p><b>Farmer:</b> ${crop.farmer_name}</p>

<p><b>Available Quantity:</b> ${crop.quantity}</p>

<p><b>Price:</b> ₹${crop.price}</p>

<p><b>Location:</b> ${crop.location}</p>

<input id="qty-${crop.crop_id}" placeholder="Enter quantity">

<button onclick="placeOrder(${crop.crop_id})">
Buy Crop
</button>

</div>
`
            })

            document.getElementById("crop-list").innerHTML = html

        })

}


// PLACE ORDER
function placeOrder(crop_id) {

    let salesman_id = localStorage.getItem("salesman_id")

    let quantity = document.getElementById(`qty-${crop_id}`).value

    fetch(API + "/place_order", {

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

            showNotification("New Order Placed")

            loadCrops()

        })

}

// search crops
function searchCrops() {

    let cropName = document.getElementById("searchCrop").value.toLowerCase()

    let location = document.getElementById("searchLocation").value.toLowerCase()

    fetch(API + "/crops")

        .then(res => res.json())

        .then(data => {

            let html = ""

            data.crops.forEach(crop => {

                if (
                    crop.crop_name.toLowerCase().includes(cropName) &&
                    crop.location.toLowerCase().includes(location)
                ) {

                    html += `
<div class="card">

<img src="http://127.0.0.1:5000/uploads/${crop.image}"
style="width:200px;height:150px;object-fit:cover;margin-bottom:10px;">

<h3>${crop.crop_name}</h3>

<p><b>Farmer:</b> ${crop.farmer_name}</p>

<p><b>Available Quantity:</b> ${crop.quantity}</p>

<p><b>Price:</b> ₹${crop.price}</p>

<p><b>Location:</b> ${crop.location}</p>

<input id="qty-${crop.crop_id}" placeholder="Enter quantity">

<button onclick="placeOrder(${crop.crop_id})">Buy Crop</button>

</div>
`
                }

            })

            document.getElementById("crop-list").innerHTML = html

        })

}

// LOAD STATS
function loadStats() {

    fetch(API + "/stats")

        .then(res => res.json())

        .then(data => {

            document.getElementById("totalCrops").innerText = data.total_crops
            document.getElementById("totalOrders").innerText = data.total_orders
            document.getElementById("totalFarmers").innerText = data.total_farmers
            document.getElementById("totalSalesmen").innerText = data.total_salesmen

        })

}