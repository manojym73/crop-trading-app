// function login(){

// let role = document.getElementById("role").value
// let email = document.getElementById("email").value
// let password = document.getElementById("password").value

// fetch(API + "/login",{

// method:"POST",

// headers:{
// "Content-Type":"application/json"
// },

// body:JSON.stringify({
// role:role,
// email:email,
// password:password
// })

// })

// .then(res=>res.json())

// .then(data=>{

// if(data.role==="farmer"){

// localStorage.setItem("farmer_id",data.id)

// window.location="farmer.html"

// }

// else if(data.role==="salesman"){

// localStorage.setItem("salesman_id",data.id)

// window.location="salesman.html"

// }

// else{

// alert("Invalid login")

// }

// })

// }

let isLogin = true

function toggleForm() {

    isLogin = !isLogin

    if (isLogin) {
        document.getElementById("form-title").innerText = "Login"
        document.getElementById("name").style.display = "none"
        document.getElementById("toggle-text").innerHTML =
            "Don't have an account? <a href='#' onclick='toggleForm()'>Sign Up</a>"
    }
    else {
        document.getElementById("form-title").innerText = "Sign Up"
        document.getElementById("name").style.display = "block"
        document.getElementById("toggle-text").innerHTML =
            "Already have an account? <a href='#' onclick='toggleForm()'>Login</a>"
    }

}

function submitForm() {

    let role = document.getElementById("role").value
    let name = document.getElementById("name").value
    let email = document.getElementById("email").value
    let password = document.getElementById("password").value

    if (isLogin) {

        // 🔐 LOGIN
        fetch(API + "/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })

            .then(res => res.json())
            .then(data => {

                if (data.role === "farmer") {
                    localStorage.setItem("farmer_id", data.id)
                    window.location = "farmer.html"
                }
                else if (data.role === "salesman") {
                    localStorage.setItem("salesman_id", data.id)
                    window.location = "salesman.html"
                }
                else {
                    alert("Invalid login")
                }

            })

    } else {

        // 📝 SIGNUP
        let url = role === "farmer" ? "/register_farmer" : "/register_salesman"

        fetch(API + url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        })

            .then(res => res.json())
            .then(data => {
                alert("Registered successfully")
                toggleForm()
            })

    }

}