let selectedProfileFile = null;

function getUser() {
  try { return JSON.parse(localStorage.getItem("user")) || {}; }
  catch { return {}; }
}

function setUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

function openImagePicker() {
  document.getElementById("profileImageInput").click();
}

function enableProfileEdit() {
  document.body.classList.add("profile-editing");
  document.getElementById("editBtn").classList.add("active");
  ["profileName", "profilePhone", "profileEmail"].forEach(id => {
    document.getElementById(id).removeAttribute("readonly");
  });
  showNotification("Now you can edit profile", "success");
}

function loadProfileData() {
  const user = getUser();
  const name = user.name || "Farmer";
  const role = user.role || "farmer";
  const email = user.email || "farmer@gmail.com";
  const phone = user.phone || "8756784675";
  const id = user.id || "";

  document.getElementById("profileNameText").textContent = name;
  document.getElementById("profileRoleText").textContent = role.charAt(0).toUpperCase() + role.slice(1);
  document.getElementById("profileEmailText").textContent = email;
  document.getElementById("profilePhoneText").textContent = phone;

  document.getElementById("profileName").value = name;
  document.getElementById("profilePhone").value = phone;
  document.getElementById("profileEmail").value = email;
  document.getElementById("profileRole").value = role.charAt(0).toUpperCase() + role.slice(1);
  document.getElementById("profileId").value = id;

  const avatarImg = document.getElementById("profileAvatarImg");
  const avatarInitial = document.getElementById("avatarInitial");

  if (user.profileimage) {
    avatarImg.src = `${API}/uploads/${user.profileimage}`;
    avatarImg.classList.remove("d-none");
    avatarInitial.classList.add("d-none");
  } else {
    avatarImg.classList.add("d-none");
    avatarInitial.classList.remove("d-none");
    avatarInitial.textContent = name.charAt(0).toUpperCase();
  }

  document.getElementById("profileImageInput").onchange = previewProfileImage;
}

function previewProfileImage(e) {
  const file = e.target.files[0];
  if (!file) return;

  selectedProfileFile = file;

  const reader = new FileReader();
  reader.onload = function (event) {
    const avatarImg = document.getElementById("profileAvatarImg");
    const avatarInitial = document.getElementById("avatarInitial");
    avatarImg.src = event.target.result;
    avatarImg.classList.remove("d-none");
    avatarInitial.classList.add("d-none");
  };
  reader.readAsDataURL(file);

  document.getElementById("removeImageBtn").classList.remove("d-none");
  showNotification("Image selected. Save to upload.", "success");
}

function removeSelectedImage() {
  selectedProfileFile = null;
  document.getElementById("profileImageInput").value = "";

  const user = getUser();
  const avatarImg = document.getElementById("profileAvatarImg");
  const avatarInitial = document.getElementById("avatarInitial");

  if (user.profileimage) {
    avatarImg.src = `${API}/uploads/${user.profileimage}`;
    avatarImg.classList.remove("d-none");
    avatarInitial.classList.add("d-none");
  } else {
    avatarImg.classList.add("d-none");
    avatarInitial.classList.remove("d-none");
    avatarInitial.textContent = (user.name || "F").charAt(0).toUpperCase();
  }

  document.getElementById("removeImageBtn").classList.add("d-none");
  showNotification("Selected image removed", "success");
}

async function updateProfile() {
  const user = getUser();
  const formData = new FormData();
  formData.append("userid", user.id || "");
  formData.append("role", user.role || "farmer");
  formData.append("name", document.getElementById("profileName").value.trim());
  formData.append("phone", document.getElementById("profilePhone").value.trim());
  formData.append("email", document.getElementById("profileEmail").value.trim());
  if (selectedProfileFile) formData.append("image", selectedProfileFile);

  try {
    const res = await fetch(`${API}/updateprofile`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    if (!res.ok) {
      showNotification(data.message || "Update failed", "danger");
      return;
    }

    user.name = document.getElementById("profileName").value.trim();
    user.phone = document.getElementById("profilePhone").value.trim();
    user.email = document.getElementById("profileEmail").value.trim();
    if (data.filename) user.profileimage = data.filename;
    setUser(user);

    document.getElementById("profileNameText").textContent = user.name;
    document.getElementById("profileRoleText").textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    document.getElementById("profileEmailText").textContent = user.email;
    document.getElementById("profilePhoneText").textContent = user.phone;

    showNotification("Profile updated successfully", "success");
  } catch (err) {
    showNotification("Backend error or CORS issue", "danger");
  }
}