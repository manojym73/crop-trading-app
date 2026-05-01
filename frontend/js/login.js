let isLogin = true;

// ===============================
// 🔁 TOGGLE LOGIN / SIGNUP
// ===============================
function toggleForm() {

    isLogin = !isLogin;

    document.getElementById("form-title").innerText =
        isLogin ? "Login" : "Sign Up";

    document.getElementById("name").style.display =
        isLogin ? "none" : "block";

    document.getElementById("phone").style.display =
        isLogin ? "none" : "block";

    document.getElementById("toggle-text").innerHTML =
        isLogin
            ? "Don't have an account? <a href='#' onclick='toggleForm()'>Sign Up</a>"
            : "Already have an account? <a href='#' onclick='toggleForm()'>Login</a>";
}


// ===============================
// 🚀 SUBMIT FORM
// ===============================
function submitForm() {

    let role = document.getElementById("role").value;
    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    // ================= LOGIN =================
    if (isLogin) {

        if (!email || !password) {
            alert("Enter email & password");
            return;
        }

        fetch(API + "/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
        .then(res => {
            if (!res.ok) throw new Error("Invalid login");
            return res.json();
        })
        .then(data => {

            // SAVE USER
            localStorage.setItem("name", data.name);
            localStorage.setItem("email", data.email);
            localStorage.setItem("phone", data.phone);

            if (data.role === "farmer") {
                localStorage.setItem("farmer_id", data.id);
                localStorage.removeItem("salesman_id");
                window.location = "farmer.html";
            }
            else if (data.role === "salesman") {
                localStorage.setItem("salesman_id", data.id);
                localStorage.removeItem("farmer_id");
                window.location = "salesman.html";
            }

        })
        .catch(err => {
            console.error(err);
            alert(err.message);
        });
    }

    // ================= SIGNUP =================
    else {

        if (!name || !email || !password || !phone) {
            alert("Fill all fields");
            return;
        }

        let url = role === "farmer"
            ? "/register_farmer"
            : "/register_salesman";

        fetch(API + url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, phone })
        })
        .then(res => {
            if (!res.ok) throw new Error("Signup failed");
            return res.json();
        })
        .then(data => {

            alert(data.message || "Registered successfully");

            toggleForm(); // go to login
        })
        .catch(err => {
            console.error(err);
            alert(err.message);
        });
    }
}