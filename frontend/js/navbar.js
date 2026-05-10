// // 
// function loadNavbar() {
//   const mount = document.getElementById("nav-right");
//   if (!mount) return;

//   const user = getUser();
//   const safeName = user.name || "User";
//   const safeEmail = user.email || "No email";

//   if (!user.role) {
//     mount.innerHTML = `
//       <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbarMenu" aria-controls="mainNavbarMenu" aria-expanded="false" aria-label="Toggle navigation">
//         <span class="navbar-toggler-icon"></span>
//       </button>
//       <div class="collapse navbar-collapse justify-content-end" id="mainNavbarMenu">
//         <div class="d-flex flex-column flex-lg-row align-items-lg-center gap-2 mt-3 mt-lg-0">
//           <a href="login.html" class="btn btn-light btn-sm fw-semibold px-3 rounded-pill">Sign In</a>
//           <a href="login.html" class="btn btn-outline-light btn-sm fw-semibold px-3 rounded-pill">Sign Up</a>
//         </div>
//       </div>
//     `;
//     return;
//   }

//   const links = user.role === "farmer"
//     ? `
//       <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
//       <li class="nav-item"><a class="nav-link" href="farmer.html#add-crop">Add Crop</a></li>
//       <li class="nav-item"><a class="nav-link" href="farmer.html#my-crops">My Crops</a></li>
//       <li class="nav-item"><a class="nav-link" href="farmer-orders.html">Orders</a></li>
//       <li class="nav-item"><a class="nav-link active" href="profile.html">Profile</a></li>
//     `
//     : `
//       <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
//       <li class="nav-item"><a class="nav-link" href="salesman.html">Marketplace</a></li>
//       <li class="nav-item"><a class="nav-link" href="orders.html">My Orders</a></li>
//       <li class="nav-item"><a class="nav-link active" href="profile.html">Profile</a></li>
//     `;

//   mount.innerHTML = `
//     <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbarMenu" aria-controls="mainNavbarMenu" aria-expanded="false" aria-label="Toggle navigation">
//       <span class="navbar-toggler-icon"></span>
//     </button>

//     <div class="collapse navbar-collapse justify-content-end" id="mainNavbarMenu">
//       <ul class="navbar-nav align-items-lg-center gap-lg-2 me-lg-3">
//         ${links}
//       </ul>

//       <div class="dropdown mt-3 mt-lg-0">
//         <button class="btn btn-light btn-sm dropdown-toggle fw-semibold px-3 rounded-pill" type="button" data-bs-toggle="dropdown" aria-expanded="false">
//           ${safeName}
//         </button>
//         <ul class="dropdown-menu dropdown-menu-end shadow border-0 p-2">
//           <li class="px-2 py-1"><strong>${safeName}</strong></li>
//           <li class="px-2 py-1 text-muted small">${safeEmail}</li>
//           <li><hr class="dropdown-divider"></li>
//           <li><a class="dropdown-item" href="profile.html">My Profile</a></li>
//           <li><button class="dropdown-item text-danger fw-semibold" onclick="logout()">Logout</button></li>
//         </ul>
//       </div>
//     </div>
//   `;
// }

// function getTheme() {
//   return localStorage.getItem("theme") || "light";
// }

// function applyTheme(theme) {
//   document.documentElement.setAttribute("data-theme", theme);
// }

// function themeToggleButton() {
//   const isDark = getTheme() === "dark";
//   return `
//     <button
//       type="button"
//       class="btn btn-light btn-sm rounded-pill px-3"
//       onclick="toggleTheme()"
//       title="Toggle theme"
//       aria-label="Toggle theme"
//     >
//       <i class="bi ${isDark ? "bi-sun-fill" : "bi-moon-stars-fill"}"></i>
//     </button>
//   `;
// }

// function toggleTheme() {
//   const nextTheme = getTheme() === "dark" ? "light" : "dark";
//   localStorage.setItem("theme", nextTheme);
//   applyTheme(nextTheme);
//   loadNavbar();
// }

// document.addEventListener("DOMContentLoaded", () => {
//   applyTheme(getTheme());
// });

// function loadNavbar() {
//   const nav = document.getElementById("nav-right");
//   if (!nav) return;

//   const user = getUser();
//   const safeName = user.name || "User";
//   const safeEmail = user.email || "No email";
//   const safePhone = user.phone || "No phone";

//   if (!user.role) {
//     nav.innerHTML = `
//       <div class="d-flex align-items-center gap-2">
//         ${themeToggleButton()}
//         <a href="login.html" class="btn btn-light btn-sm fw-semibold px-3 rounded-pill">Sign In</a>
//         <a href="login.html" class="btn btn-outline-light btn-sm fw-semibold px-3 rounded-pill">Sign Up</a>
//       </div>
//     `;
//     return;
//   }

//   if (user.role === "farmer") {
//     nav.innerHTML = `
//       <div class="d-flex align-items-center gap-2 flex-wrap">
//         <a href="index.html" class="btn btn-outline-light btn-sm rounded-pill">Home</a>
//         <a href="farmer.html" class="btn btn-outline-light btn-sm rounded-pill">Dashboard</a>
//         <a href="farmer-orders.html" class="btn btn-outline-light btn-sm rounded-pill">Orders</a>
//         ${themeToggleButton()}
//         <div class="dropdown">
//           <button class="btn btn-light btn-sm dropdown-toggle fw-semibold px-3 rounded-pill" type="button" data-bs-toggle="dropdown">
//             ${safeName}
//           </button>
//           <ul class="dropdown-menu dropdown-menu-end shadow border-0 p-2">
//             <li class="px-2 py-1"><strong>${safeName}</strong></li>
//             <li class="px-2 py-1 text-muted small">${safeEmail}</li>
//             <li class="px-2 py-1 text-muted small">${safePhone}</li>
//             <li><hr class="dropdown-divider"></li>
//             <li><button class="dropdown-item text-danger fw-semibold" onclick="logout()">Logout</button></li>
//           </ul>
//         </div>
//       </div>
//     `;
//     return;
//   }

//   nav.innerHTML = `
//     <div class="d-flex align-items-center gap-2 flex-wrap">
//       <a href="index.html" class="btn btn-outline-light btn-sm rounded-pill">Home</a>
//       <a href="salesman.html" class="btn btn-outline-light btn-sm rounded-pill">Marketplace</a>
//       <a href="orders.html" class="btn btn-outline-light btn-sm rounded-pill">My Orders</a>
//       ${themeToggleButton()}
//       <div class="dropdown">
//         <button class="btn btn-light btn-sm dropdown-toggle fw-semibold px-3 rounded-pill" type="button" data-bs-toggle="dropdown">
//           ${safeName}
//         </button>
//         <ul class="dropdown-menu dropdown-menu-end shadow border-0 p-2">
//           <li class="px-2 py-1"><strong>${safeName}</strong></li>
//           <li class="px-2 py-1 text-muted small">${safeEmail}</li>
//           <li class="px-2 py-1 text-muted small">${safePhone}</li>
//           <li><hr class="dropdown-divider"></li>
//           <li><button class="dropdown-item text-danger fw-semibold" onclick="logout()">Logout</button></li>
//         </ul>
//       </div>
//     </div>
//   `;
// }

  // --- Theme Management ---
  function getTheme() {
    return localStorage.getItem("theme") || "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }

  function toggleTheme() {
    const currentTheme = getTheme();
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    
    localStorage.setItem("theme", nextTheme);
    applyTheme(nextTheme);
    
    // Re-render navbar to update icon state
    loadNavbar();
  }

  function themeToggleButton() {
    const isDark = getTheme() === "dark";
    return `
      <button
        type="button"
        class="btn btn-light btn-sm rounded-pill px-3 ms-lg-2"
        onclick="toggleTheme()"
        title="Toggle theme"
        aria-label="Toggle theme"
      >
        <i class="bi ${isDark ? "bi-sun-fill" : "bi-moon-stars-fill"}"></i>
      </button>
    `;
  }

  // --- Navigation Management ---
  function loadNavbar() {
    const mount = document.getElementById("nav-right");
    if (!mount) return;

    // Ensure user helper exists, otherwise fallback to dummy data to prevent crashes
    const user = typeof getUser === 'function' ? getUser() : { name: "Guest", email: "", phone: "", role: null };
    
    const safeName = user.name || "User";
    const safeEmail = user.email || "No email";
    const safePhone = user.phone || "No phone";
    const role = user.role;

    // Helper for logout to ensure it's always available in the inline onclick
    const logoutHandler = typeof logout === 'function' ? 'logout()' : 'alert("Logout not implemented yet")';

    if (!role) {
      // Guest Mode
      mount.innerHTML = `
        <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbarMenu" aria-controls="mainNavbarMenu" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="mainNavbarMenu">
          <div class="d-flex flex-column flex-lg-row align-items-lg-center gap-2 mt-3 mt-lg-0">
            ${themeToggleButton()}
            <a href="login.html" class="btn btn-light btn-sm fw-semibold px-3 rounded-pill">Sign In</a>
            <a href="login.html" class="btn btn-outline-light btn-sm fw-semibold px-3 rounded-pill">Sign Up</a>
          </div>
        </div>
      `;
      return;
    }

    // Links based on Role
    const links = role === "farmer"
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

    // Logged In Mode
    mount.innerHTML = `
      <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbarMenu" aria-controls="mainNavbarMenu" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse justify-content-end" id="mainNavbarMenu">
        <ul class="navbar-nav align-items-lg-center gap-lg-2 me-lg-3">
          ${links}
        </ul>

        <div class="d-flex align-items-center flex-wrap gap-2 mt-3 mt-lg-0">
          ${themeToggleButton()}
          
          <div class="dropdown ms-lg-2">
            <button class="btn btn-light btn-sm dropdown-toggle fw-semibold px-3 rounded-pill" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              ${safeName}
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow border-0 p-2">
              <li class="px-2 py-1"><strong>${safeName}</strong></li>
              <li class="px-2 py-1 text-muted small">${safeEmail}</li>
              <li class="px-2 py-1 text-muted small">${safePhone}</li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="profile.html">My Profile</a></li>
              <li><button class="dropdown-item text-danger fw-semibold" onclick="${logoutHandler}">Logout</button></li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  // Initialize Theme on Load
  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(getTheme());
    // Optional: Load navbar immediately if user is already logged in
    // loadNavbar(); 
  });
