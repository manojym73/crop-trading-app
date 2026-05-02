function getUser() {
  const farmerId = localStorage.getItem("farmerid");
  const salesmanId = localStorage.getItem("salesmanid");
  const role = localStorage.getItem("role") || (farmerId ? "farmer" : salesmanId ? "salesman" : "");

  return {
    farmerId,
    salesmanId,
    id: farmerId || salesmanId || "",
    role,
    name: localStorage.getItem("name") || "",
    email: localStorage.getItem("email") || "",
    phone: localStorage.getItem("phone") || ""
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
}

function logout() {
  clearSession();
  window.location.href = "index.html";
}

function checkFarmer() {
  const user = getUser();
  if (user.role !== "farmer") {
    showNotification("Please login as Farmer", "warning");
    window.location.href = "login.html";
    return false;
  }
  return true;
}

function checkSalesman() {
  const user = getUser();
  if (user.role !== "salesman") {
    showNotification("Please login as Salesman", "warning");
    window.location.href = "login.html";
    return false;
  }
  return true;
}

function goFarmer() {
  const user = getUser();
  if (!user.role) {
    window.location.href = "login.html";
    return;
  }
  if (user.role !== "farmer") {
    showNotification("You are logged in as Salesman", "warning");
    return;
  }
  window.location.href = "farmer.html";
}

function goSalesman() {
  const user = getUser();
  if (!user.role) {
    window.location.href = "login.html";
    return;
  }
  if (user.role !== "salesman") {
    showNotification("You are logged in as Farmer", "warning");
    return;
  }
  window.location.href = "salesman.html";
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