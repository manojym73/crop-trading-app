function loadNavbar() {
  const nav = document.getElementById("nav-right");
  if (!nav) return;

  const user = getUser();
  const safeName = user.name || "User";
  const safeEmail = user.email || "No email";
  const safePhone = user.phone || "No phone";

  if (!user.role) {
    nav.innerHTML = `
      <div class="d-flex align-items-center gap-2">
        <a href="login.html" class="btn btn-light btn-sm fw-semibold px-3 rounded-pill">Sign In</a>
        <a href="login.html" class="btn btn-outline-light btn-sm fw-semibold px-3 rounded-pill">Sign Up</a>
      </div>
    `;
    return;
  }

  if (user.role === "farmer") {
    nav.innerHTML = `
      <div class="d-flex align-items-center gap-2 flex-wrap">
        <a href="index.html" class="btn btn-outline-light btn-sm rounded-pill">Home</a>
        <a href="farmer.html" class="btn btn-outline-light btn-sm rounded-pill">Dashboard</a>
        <a href="farmer-orders.html" class="btn btn-outline-light btn-sm rounded-pill">Orders</a>

        <div class="dropdown">
          <button class="btn btn-light btn-sm dropdown-toggle fw-semibold px-3 rounded-pill" type="button" data-bs-toggle="dropdown">
            ${safeName}
          </button>
          <ul class="dropdown-menu dropdown-menu-end shadow border-0 p-2">
            <li class="px-2 py-1"><strong>${safeName}</strong></li>
            <li class="px-2 py-1 text-muted small">${safeEmail}</li>
            <li class="px-2 py-1 text-muted small">${safePhone}</li>
            <li><hr class="dropdown-divider"></li>
            <li><button class="dropdown-item text-danger fw-semibold" onclick="logout()">Logout</button></li>
          </ul>
        </div>
      </div>
    `;
    return;
  }

  nav.innerHTML = `
    <div class="d-flex align-items-center gap-2 flex-wrap">
      <a href="index.html" class="btn btn-outline-light btn-sm rounded-pill">Home</a>
      <a href="salesman.html" class="btn btn-outline-light btn-sm rounded-pill">Marketplace</a>
      <a href="orders.html" class="btn btn-outline-light btn-sm rounded-pill">My Orders</a>

      <div class="dropdown">
        <button class="btn btn-light btn-sm dropdown-toggle fw-semibold px-3 rounded-pill" type="button" data-bs-toggle="dropdown">
          ${safeName}
        </button>
        <ul class="dropdown-menu dropdown-menu-end shadow border-0 p-2">
          <li class="px-2 py-1"><strong>${safeName}</strong></li>
          <li class="px-2 py-1 text-muted small">${safeEmail}</li>
          <li class="px-2 py-1 text-muted small">${safePhone}</li>
          <li><hr class="dropdown-divider"></li>
          <li><button class="dropdown-item text-danger fw-semibold" onclick="logout()">Logout</button></li>
        </ul>
      </div>
    </div>
  `;
}