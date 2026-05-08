function getUser() {
  const farmerId = localStorage.getItem("farmerid");
  const salesmanId = localStorage.getItem("salesmanid");
  const role = localStorage.getItem("role");

  return {
    farmerId: farmerId || "",
    salesmanId: salesmanId || "",
    id: farmerId || salesmanId || "",
    role: role || "",
    name: localStorage.getItem("name") || "",
    email: localStorage.getItem("email") || "",
    phone: localStorage.getItem("phone") || "",
    profileimage: localStorage.getItem("profileimage") || ""
  };
}

function isLoggedIn() {
  return !!getUser().role;
}

function clearSession() {
  localStorage.removeItem("farmerid");
  localStorage.removeItem("salesmanid");
  localStorage.removeItem("name");
  localStorage.removeItem("email");
  localStorage.removeItem("phone");
  localStorage.removeItem("role");
  localStorage.removeItem("profileimage");
}

function logout() {
  clearSession();
  window.location.href = "index.html";
}

function checkFarmer() {
  const user = getUser();
  if (user.role !== "farmer") {
    if (typeof showNotification === "function") {
      showNotification("Please login as Farmer", "warning");
    }
    window.location.href = "login.html";
    return false;
  }
  return true;
}

function checkSalesman() {
  const user = getUser();
  if (user.role !== "salesman") {
    if (typeof showNotification === "function") {
      showNotification("Please login as Salesman", "warning");
    }
    window.location.href = "login.html";
    return false;
  }
  return true;
}

function goHomeSmart(event) {
  if (event) event.preventDefault();
  const user = getUser();
  if (!user.role) {
    window.location.href = "index.html";
    return;
  }
  window.location.href = user.role === "farmer" ? "farmer.html" : "salesman.html";
}
function handleAddCrop() {
  if (!checkFarmer()) return;
  if (typeof addCrop === "function") addCrop();
}

function handleBuy(cropId) {
  if (!checkSalesman()) return;
  if (typeof placeOrder === "function") placeOrder(cropId);
}