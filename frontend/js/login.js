let isLogin = true;

function getEl(id) {
  return document.getElementById(id);
}

function setLoading(button, loading, text = "Submit") {
  if (!button) return;
  button.disabled = loading;
  button.innerHTML = loading
    ? `<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>${text}`
    : text;
}

function clearAuthStorage() {
  localStorage.removeItem("farmerid");
  localStorage.removeItem("salesmanid");
  localStorage.removeItem("name");
  localStorage.removeItem("email");
  localStorage.removeItem("phone");
  localStorage.removeItem("role");
}

// function toggleForm(event) {
//   if (event) event.preventDefault();

//   isLogin = !isLogin;

//   const formTitle = getEl("form-title");
//   const nameGroup = getEl("name-group");
//   const phoneGroup = getEl("phone-group");
//   const toggleText = getEl("toggle-text");
//   const roleGroup = getEl("role-group");

//   if (formTitle) formTitle.innerText = isLogin ? "Welcome Back" : "Create Account";
//   if (nameGroup) nameGroup.style.display = isLogin ? "none" : "block";
//   if (phoneGroup) phoneGroup.style.display = isLogin ? "none" : "block";
//   if (roleGroup) roleGroup.style.display = isLogin ? "none" : "block";

//   if (toggleText) {
//     toggleText.innerHTML = isLogin
//       ? `Don't have an account? <a href="#" onclick="toggleForm(event)">Sign Up</a>`
//       : `Already have an account? <a href="#" onclick="toggleForm(event)">Login</a>`;
//   }
// }

// let isLogin = true; // Start in login mode

// function getEl(id) {
//   return document.getElementById(id);
// }

function toggleForm(event) {
  if (event) event.preventDefault();

  isLogin = !isLogin;

  const formTitle = getEl("form-title");
  const nameGroup = getEl("name-group");
  const phoneGroup = getEl("phone-group");
  const toggleText = getEl("toggle-text");
  const roleGroup = getEl("role-group");
  const submitBtn = getEl("submit-btn"); // Optional: change button text too

  // Update form title
  if (formTitle) {
    formTitle.innerText = isLogin ? "Welcome Back" : "Create Account";
  }

  // Toggle field visibility
  if (nameGroup) nameGroup.style.display = isLogin ? "none" : "block";
  if (phoneGroup) phoneGroup.style.display = isLogin ? "none" : "block";
  if (roleGroup) roleGroup.style.display = isLogin ? "none" : "block";

  // Update toggle link text
  if (toggleText) {
    toggleText.innerHTML = isLogin
      ? `Don't have an account? <a href="#" class="toggle-link" onclick="toggleForm(event)">Sign Up</a>`
      : `Already have an account? <a href="#" class="toggle-link" onclick="toggleForm(event)">Login</a>`;
  }

  // Optional: Update submit button text
  if (submitBtn) {
    submitBtn.innerText = isLogin ? "Login" : "Sign Up";
  }

  // Optional: Add smooth transition by fading elements
  if (nameGroup || phoneGroup || roleGroup) {
    const groups = [nameGroup, phoneGroup, roleGroup].filter(Boolean);
    groups.forEach(group => {
      group.style.opacity = "0";
      setTimeout(() => {
        group.style.display = isLogin ? "none" : "block";
        setTimeout(() => {
          group.style.opacity = "1";
        }, 50);
      }, 300);
    });
  }
}

// Add CSS for fade transition
const style = document.createElement("style");
style.textContent = `
  .form-group {
    transition: opacity 0.3s ease;
  }
  .toggle-link {
    color: var(--btn-bg);
    font-weight: 600;
    text-decoration: none;
  }
  .toggle-link:hover {
    text-decoration: underline;
  }
`;
document.head.appendChild(style);

function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

function validatePhone(phone) {
  return /^[0-9]{10}$/.test(phone);
}

async function submitForm() {
  const role = getEl("role")?.value?.trim();
  const name = getEl("name")?.value?.trim();
  const phone = getEl("phone")?.value?.trim();
  const email = getEl("email")?.value?.trim();
  const password = getEl("password")?.value?.trim();
  const submitBtn = document.querySelector("#auth-submit");

  if (!email || !password) {
    showNotification("Please enter email and password", "danger");
    return;
  }

  if (!validateEmail(email)) {
    showNotification("Please enter a valid email", "danger");
    return;
  }

  if (!isLogin) {
    if (!role || !name || !phone) {
      showNotification("Please fill all fields", "danger");
      return;
    }

    if (!validatePhone(phone)) {
      showNotification("Phone number must be 10 digits", "danger");
      return;
    }
  }

  try {
    setLoading(submitBtn, true, isLogin ? "Signing in..." : "Creating account...");

    if (isLogin) {
      const response = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid login");
      }

      clearAuthStorage();

      localStorage.setItem("name", data.name || "");
      localStorage.setItem("email", data.email || "");
      localStorage.setItem("phone", data.phone || "");
      localStorage.setItem("role", data.role || "");

      if (data.role === "farmer") {
        localStorage.setItem("farmerid", data.id);
        showNotification("Login successful", "success");
        setTimeout(() => window.location.href = "farmer.html", 700);
        return;
      }

      if (data.role === "salesman") {
        localStorage.setItem("salesmanid", data.id);
        showNotification("Login successful", "success");
        setTimeout(() => window.location.href = "salesman.html", 700);
        return;
      }

      throw new Error("Invalid role returned from server");
    } else {
      const endpoint = role === "farmer" ? "register_farmer" : "register_salesman";

      const response = await fetch(`${API}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password, phone })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      showNotification(data.message || "Registered successfully", "success");
      toggleForm();
      getEl("password").value = "";
    }
  } catch (error) {
    console.error("Auth error:", error);
    showNotification(error.message || "Something went wrong", "danger");
  } finally {
    setLoading(submitBtn, false, isLogin ? "Login" : "Sign Up");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = getEl("password");
  if (passwordInput) {
    passwordInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") submitForm();
    });
  }
});