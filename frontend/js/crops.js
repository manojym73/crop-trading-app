
// ===============================
// SEARCH CROPS
// ===============================
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

                    html += getCropCard(crop)
                }

            })

            document.getElementById("crop-list").innerHTML = html
        })
}


// ===============================
// LOAD CROPS
// ===============================
function loadCrops() {

    fetch(API + "/crops")
        .then(res => res.json())
        .then(data => {

            let html = ""

            // ✅ if no crops
            if (!data.crops || data.crops.length === 0) {
                html = "<p>No crops available</p>"
            }

            data.crops.forEach(crop => {

                // ✅ safe values
                let quantity = crop.quantity || 0
                let price = crop.price || 0
                let image = crop.image || ""

                // ❌ skip if no stock (optional)
                if (quantity <= 0) return

                html += `
<div class="card">

<img src="http://127.0.0.1:5000/uploads/${image}"
style="width:100%;height:150px;object-fit:cover;">

<h3>${crop.crop_name}</h3>

<p><b>Farmer:</b> ${crop.farmer_name}</p>

<p><b>Price:</b> ₹${price} / kg</p>

<p><b>Available:</b> ${quantity} kg</p>

<p><b>Location:</b> ${crop.location}</p>

<input id="qty-${crop.crop_id}" placeholder="Enter quantity (kg)">

<button onclick="handleBuy(${crop.crop_id})">
Buy Crop
</button>

</div>
`
            })

            // ✅ SAFE UPDATE (NO ERROR)
            let container = document.getElementById("crop-list")
            if (container) {
                container.innerHTML = html
            }

        })
        .catch(err => {
            console.error("Load crops error:", err)
        })
}

// ===============================
// COMMON CARD TEMPLATE (REUSE)
// ===============================
function getCropCard(crop) {

    return `
<div class="col-md-4">

<div class="card shadow-sm">

<img src="http://127.0.0.1:5000/uploads/${crop.image}"
class="card-img-top" style="height:200px; object-fit:cover;">

<div class="card-body">

<h5 class="card-title">${crop.crop_name}</h5>

<p class="card-text">
<b>Farmer:</b> ${crop.farmer_name}<br>
<b>Price:</b> ₹${crop.price}/kg<br>
<b>Available:</b> ${crop.quantity} kg<br>
<b>Location:</b> ${crop.location}
</p>

<input id="qty-${crop.crop_id}" 
class="form-control mb-2" 
placeholder="Enter quantity (kg)">

<button class="btn btn-success w-100"
onclick="handleBuy(${crop.crop_id})">
Buy Crop
</button>

</div>
</div>

</div>
`
}


// ===============================
// ADD CROP
// ===============================
function addCrop() {

    let farmer_id = localStorage.getItem("farmer_id")

    if (!farmer_id) {
        alert("Please login first")
        return
    }

    let formData = new FormData()

    formData.append("farmer_id", farmer_id)
    formData.append("crop_name", document.getElementById("crop_name").value)
    formData.append("quantity", document.getElementById("quantity").value)
    formData.append("price", document.getElementById("price").value)
    formData.append("location", document.getElementById("location").value)

    let imageFile = document.getElementById("image").files[0]

    if (imageFile) {
        formData.append("image", imageFile)
    }

    fetch(API + "/add_crop", {
        method: "POST",
        body: formData
    })
        .then(res => res.json())
        .then(data => {

            if (data.error) {
                alert(data.error)
                return
            }

            alert(data.message)

            loadCrops()   // refresh crops
        })
        .catch(err => {
            console.error("ADD CROP ERROR:", err)
            alert("Failed to add crop")
        })
}


// ===============================
// PLACE ORDER
// ===============================
function placeOrder(crop_id) {

    let salesman_id = localStorage.getItem("salesman_id")
    let quantity = document.getElementById(`qty-${crop_id}`).value

    // ✅ validation
    if (!salesman_id) {
        alert("Please login first")
        return
    }

    if (!quantity || quantity <= 0) {
        alert("Enter valid quantity")
        return
    }

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
        .then(res => {
            if (!res.ok) {
                return res.json().then(err => {
                    throw new Error(err.message || "Order failed")
                })
            }
            return res.json()
        })
        .then(data => {
            alert(data.message)
            loadCrops()
        })
        .catch(err => {
            console.error("ORDER ERROR:", err)
            alert(err.message)
        })
}


// ===============================
// STATS
// ===============================
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