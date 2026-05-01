// ===============================
// 🔐 AUTH + USER HELPERS
// ===============================

function getUser() {
    return {
        farmer: localStorage.getItem("farmer_id"),
        salesman: localStorage.getItem("salesman_id"),
        name: localStorage.getItem("name"),
        email: localStorage.getItem("email"),
        phone: localStorage.getItem("phone")
    };
}

// ===============================
// 🚪 LOGOUT
// ===============================
function logout() {
    localStorage.clear();
    window.location = "index.html";
}

// ===============================
// 🧑‍💼 NAVBAR (ALL PAGES)
// ===============================
function loadNavbar() {

    let nav = document.getElementById("nav-right");

    let farmer = localStorage.getItem("farmer_id");
    let salesman = localStorage.getItem("salesman_id");
    let name = localStorage.getItem("name");
    let email = localStorage.getItem("email");
    let phone = localStorage.getItem("phone");

    // ❌ NOT LOGGED
    if (!farmer && !salesman) {
        nav.innerHTML = `
            <a href="login.html" class="btn btn-light">Sign In</a>
            <a href="login.html" class="btn btn-outline-light">Sign Up</a>
        `;
        return;
    }

    // ✅ LOGGED
    nav.innerHTML = `
        <div class="dropdown">
            <button class="btn btn-light dropdown-toggle" data-bs-toggle="dropdown">
                👤 ${name}
            </button>

            <ul class="dropdown-menu dropdown-menu-end p-3 shadow">

                <li><strong>${name}</strong></li>
                <li class="text-muted small">${email}</li>
                <li class="text-muted small">${phone}</li>

                <hr>

                <li>
                    <button class="btn btn-danger w-100" onclick="logout()">Logout</button>
                </li>

            </ul>
        </div>
    `;
}

function logout() {
    localStorage.clear();
    window.location = "index.html";
}

// ===============================
// 🚀 NAVIGATION WITH ROLE CHECK
// ===============================

function goFarmer() {
    let user = getUser();

    if (user.salesman && !user.farmer) {
        alert("❌ You are logged in as Salesman.\nLogout first.");
        return;
    }

    window.location = "farmer.html";
}

function goSalesman() {
    let user = getUser();

    if (user.farmer && !user.salesman) {
        alert("❌ You are logged in as Farmer.\nLogout first.");
        return;
    }

    window.location = "salesman.html";
}

// ===============================
// 🌾 FARMER ACTION
// ===============================
function handleAddCrop() {
    let user = getUser();

    if (!user.farmer) {
        alert("Login as Farmer first");
        return;
    }

    addCrop();
}

// ===============================
// 🛒 SALESMAN ACTION
// ===============================
function handleBuy(crop_id) {
    let user = getUser();

    if (!user.salesman) {
        alert("Login as Salesman first");
        return;
    }

    placeOrder(crop_id);
}