// 
function loadNavbar() {
  const mount = document.getElementById("nav-right");
  if (!mount) return;

  const user = getUser();
  const safeName = user.name || "User";
  const safeEmail = user.email || "No email";

  if (!user.role) {
    mount.innerHTML = `
      <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbarMenu" aria-controls="mainNavbarMenu" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end" id="mainNavbarMenu">
        <div class="d-flex flex-column flex-lg-row align-items-lg-center gap-2 mt-3 mt-lg-0">
          <a href="login.html" class="btn btn-light btn-sm fw-semibold px-3 rounded-pill">Sign In</a>
          <a href="login.html" class="btn btn-outline-light btn-sm fw-semibold px-3 rounded-pill">Sign Up</a>
        </div>
      </div>
    `;
    return;
  }

  const links = user.role === "farmer"
    ? `
      <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
      <li class="nav-item"><a class="nav-link" href="farmer.html#add-crop">Add Crop</a></li>
      <li class="nav-item"><a class="nav-link" href="farmer.html#my-crops">My Crops</a></li>
      <li class="nav-item"><a class="nav-link" href="farmer-orders.html">Orders</a></li>
      <li class="nav-item"><a class="nav-link active" href="profile.html">Profile</a></li>
    `
    : `
      <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
      <li class="nav-item"><a class="nav-link" href="salesman.html">Marketplace</a></li>
      <li class="nav-item"><a class="nav-link" href="orders.html">My Orders</a></li>
      <li class="nav-item"><a class="nav-link active" href="profile.html">Profile</a></li>
    `;

  mount.innerHTML = `
    <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbarMenu" aria-controls="mainNavbarMenu" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse justify-content-end" id="mainNavbarMenu">
      <ul class="navbar-nav align-items-lg-center gap-lg-2 me-lg-3">
        ${links}
      </ul>

      <div class="dropdown mt-3 mt-lg-0">
        <button class="btn btn-light btn-sm dropdown-toggle fw-semibold px-3 rounded-pill" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          ${safeName}
        </button>
        <ul class="dropdown-menu dropdown-menu-end shadow border-0 p-2">
          <li class="px-2 py-1"><strong>${safeName}</strong></li>
          <li class="px-2 py-1 text-muted small">${safeEmail}</li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="profile.html">My Profile</a></li>
          <li><button class="dropdown-item text-danger fw-semibold" onclick="logout()">Logout</button></li>
        </ul>
      </div>
    </div>
  `;
}