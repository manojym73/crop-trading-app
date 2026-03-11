function login(){

let email = document.getElementById("email").value;
let password = document.getElementById("password").value;

fetch("http://127.0.0.1:5000/login",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
email:email,
password:password
})
})

.then(response => response.json())
.then(data => {

console.log(data);

if(data.role === "farmer"){

localStorage.setItem("user_role","farmer");
localStorage.setItem("farmer_id", data.user.farmer_id);

window.location = "farmer.html";

}

else if(data.role === "salesman"){

localStorage.setItem("user_role","salesman");
localStorage.setItem("salesman_id", data.user.salesman_id);

window.location = "salesman.html";

}

else{
alert("Invalid login");
}

});

}