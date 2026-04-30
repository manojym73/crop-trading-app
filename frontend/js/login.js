let isLogin = true;

// ===============================
// 🔁 TOGGLE LOGIN / SIGNUP
// ===============================
function toggleForm() {

    isLogin = !isLogin

    if (isLogin) {
        document.getElementById("form-title").innerText = "Login"
        document.getElementById("name").style.display = "none"
        document.getElementById("phone").style.display = "none"

        document.getElementById("toggle-text").innerHTML =
            "Don't have an account? <a href='#' onclick='toggleForm()'>Sign Up</a>"
    }
    else {
        document.getElementById("form-title").innerText = "Sign Up"
        document.getElementById("name").style.display = "block"
        document.getElementById("phone").style.display = "block"

        document.getElementById("toggle-text").innerHTML =
            "Already have an account? <a href='#' onclick='toggleForm()'>Login</a>"
    }
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

        // ✅ only email + password needed
        if (!email || !password) {
            alert("Please enter email and password");
            return;
        }

        fetch(API + "/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })

        .then(res => {
            if (!res.ok) throw new Error("Login failed");
            return res.json();
        })

        .then(data => {

            console.log("LOGIN RESPONSE:", data);

            if (data.role === "farmer") {

                localStorage.setItem("farmer_id", data.id);
                localStorage.removeItem("salesman_id");
                localStorage.setItem("name", data.name);

                window.location = "farmer.html";
            }

            else if (data.role === "salesman") {

                localStorage.setItem("salesman_id", data.id);
                localStorage.removeItem("farmer_id");
                localStorage.setItem("name", data.name);

                window.location = "salesman.html";
            }

            else {
                alert(data.message || "Invalid login");
            }
        })

        .catch(err => {
            console.error("LOGIN ERROR:", err);
            alert(err.message);
        });
    }

    // ================= SIGNUP =================
    else {

        // ✅ validation
        if (!name || !email || !password || !phone) {
            alert("Please fill all fields including phone");
            return;
        }

        let url = role === "farmer"
            ? "/register_farmer"
            : "/register_salesman";

        fetch(API + url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
                phone: phone   // ✅ FIXED (important)
            })
        })

        .then(res => {
            if (!res.ok) {
                return res.json().then(err => {
                    throw new Error(err.message || "Signup failed");
                });
            }
            return res.json();
        })

        .then(data => {

            console.log("SIGNUP RESPONSE:", data);

            alert(data.message || "Registered successfully");

            toggleForm(); // back to login
        })

        .catch(err => {
            console.error("SIGNUP ERROR:", err);
            alert(err.message);
        });
    }
}