
// ===============================
// 🔍 GET USER INFO
// ===============================
function getUser() {
    return {
        farmer: localStorage.getItem("farmer_id"),
        salesman: localStorage.getItem("salesman_id"),
        name: localStorage.getItem("name")
    }
}


// ===============================
// 👋 NAVBAR (OPTIONAL)
// ===============================
function loadNavbar(){

    let farmer = localStorage.getItem("farmer_id")
    let salesman = localStorage.getItem("salesman_id")
    let name = localStorage.getItem("name")

    let html = ""

    // ✅ LOGGED IN
    if(farmer || salesman){
        html = `
            <span>Welcome👋</span>
            <button onclick="logout()">Logout</button>
        `
    }

    // ❌ NOT LOGGED
    else{
        html = `
            <a href="login.html">Sign In</a>
            <a href="login.html">Sign Up</a>
        `
    }

    document.getElementById("nav-right").innerHTML = html
}

// ===============================
// 🚀 login BUTTON
// ===============================
function goLogin() {
    window.location = "login.html"
}

// ===============================
// 🚀 FARMER BUTTON
// ===============================
function goFarmer(){
    window.location = "farmer.html"
}


// ===============================
// 🚀 SALESMAN BUTTON
// ===============================
function goSalesman(){
    window.location = "salesman.html"
}


// ===============================
// 🔓 LOGOUT
// ===============================
function logout() {
    localStorage.clear()
    window.location = "index.html"
}


// ===============================
// 🌾 ADD CROP (FARMER ONLY)
// ===============================
function handleAddCrop(){

    let farmer_id = localStorage.getItem("farmer_id")

    if(!farmer_id){
        alert("You are not logged in. Please login first.")
        return
    }

    addCrop()
}


// ===============================
// 🛒 BUY CROP (SALESMAN ONLY)
// ===============================
function handleBuy(crop_id){

    let salesman_id = localStorage.getItem("salesman_id")

    if(!salesman_id){
        alert("You are not logged in. Please login first.")
        return
    }

    placeOrder(crop_id)
}