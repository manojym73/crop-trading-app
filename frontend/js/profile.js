

// let selectedProfileImage = null;
// let selectedProfileBlob = null;
// let profileEditEnabled = false;
// let profileCropper = null;
// let cropImageObjectUrl = null;

// function byId(id) {
//   return document.getElementById(id);
// }

// function initProfilePage() {
//   const user = getUser();
//   if (!user || !user.role) {
//     window.location.href = "login.html";
//     return;
//   }

//   loadNavbar();
//   loadProfileData();

//   const imageInput = byId("profileImageInput");
//   if (imageInput) imageInput.addEventListener("change", handleProfileImageSelection);

//   const cropModalEl = byId("cropImageModal");
//   if (cropModalEl) {
//     cropModalEl.addEventListener("hidden.bs.modal", function () {
//       destroyProfileCropper();
//       if (cropImageObjectUrl) {
//         URL.revokeObjectURL(cropImageObjectUrl);
//         cropImageObjectUrl = null;
//       }
//     });
//   }

//   document.addEventListener("click", function () {
//     const menu = byId("imageActionMenu");
//     if (menu) menu.classList.add("d-none");
//   });

//   const newPassword = byId("newPassword");
//   const confirmPassword = byId("confirmPassword");

//   if (newPassword) newPassword.addEventListener("input", validatePasswordsLive);
//   if (confirmPassword) confirmPassword.addEventListener("input", validatePasswordsLive);
// }

// function loadProfileData() {
//   const user = getUser() || {};
//   const name = user.name || "User";
//   const role = user.role || "";
//   const phone = user.phone || "";
//   const email = user.email || "";
//   const id = user.id || "";

//   const heroName = byId("profileHeroName");
//   const heroRole = byId("profileHeroRole");
//   const profileName = byId("profileName");
//   const profilePhone = byId("profilePhone");
//   const profileEmail = byId("profileEmail");
//   const profileRole = byId("profileRole");
//   const profileId = byId("profileId");

//   if (heroName) heroName.textContent = name;
//   if (heroRole) heroRole.textContent = capitalize(role);
//   if (profileName) profileName.value = name;
//   if (profilePhone) profilePhone.value = phone;
//   if (profileEmail) profileEmail.value = email;
//   if (profileRole) profileRole.value = capitalize(role);
//   if (profileId) profileId.value = id;

//   renderProfileAvatar();
// }

// function renderProfileAvatar(previewSrc = "") {
//   const user = getUser() || {};
//   const name = user.name || "U";
//   const img = byId("profileAvatarImg");
//   const initial = byId("profileAvatarInitial");
//   const removeBtn = byId("profileAvatarRemove");

//   if (!img || !initial || !removeBtn) return;

//   const savedImage = user.profileimage ? `${API}/uploads/${user.profileimage}` : "";
//   const finalSrc = previewSrc || savedImage;

//   if (finalSrc) {
//     img.src = finalSrc;
//     img.classList.remove("d-none");
//     initial.classList.add("d-none");
//     removeBtn.classList.toggle("d-none", !(selectedProfileImage || savedImage));
//   } else {
//     img.removeAttribute("src");
//     img.classList.add("d-none");
//     initial.classList.remove("d-none");
//     initial.textContent = name.charAt(0).toUpperCase();
//     removeBtn.classList.add("d-none");
//   }
// }

// function capitalize(value) {
//   return value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
// }

// function enableProfileEdit() {
//   profileEditEnabled = true;
//   const profileName = byId("profileName");
//   const profilePhone = byId("profilePhone");
//   const editBtn = byId("editProfileBtn");

//   if (profileName) profileName.removeAttribute("readonly");
//   if (profilePhone) profilePhone.removeAttribute("readonly");
//   if (editBtn) editBtn.classList.add("active");

//   showNotification("Edit mode enabled", "success");
// }

// function toggleImageMenu(event) {
//   event.stopPropagation();
//   const menu = byId("imageActionMenu");
//   if (menu) menu.classList.toggle("d-none");
// }

// function chooseNewImage() {
//   const menu = byId("imageActionMenu");
//   if (menu) menu.classList.add("d-none");
//   const input = byId("profileImageInput");
//   if (input) input.click();
// }

// function handleProfileImageSelection(event) {
//   const file = event.target.files && event.target.files[0];
//   if (!file) return;

//   if (!file.type.startsWith("image/")) {
//     showNotification("Please select a valid image file", "danger");
//     event.target.value = "";
//     return;
//   }

//   openCropperModal(file);
// }

// function openCropperModal(file) {
//   const cropImage = byId("cropperImage");
//   const cropModalEl = byId("cropImageModal");

//   if (!cropImage || !cropModalEl) {
//     showNotification("Crop modal not found", "danger");
//     return;
//   }

//   if (cropImageObjectUrl) {
//     URL.revokeObjectURL(cropImageObjectUrl);
//     cropImageObjectUrl = null;
//   }

//   cropImageObjectUrl = URL.createObjectURL(file);
//   cropImage.src = cropImageObjectUrl;

//   const cropModal = new bootstrap.Modal(cropModalEl);
//   cropModal.show();

//   cropModalEl.addEventListener(
//     "shown.bs.modal",
//     function initCropperOnce() {
//       destroyProfileCropper();
//       profileCropper = new Cropper(cropImage, {
//         aspectRatio: 1,
//         viewMode: 1,
//         dragMode: "move",
//         autoCropArea: 1,
//         responsive: true,
//         background: false
//       });
//     },
//     { once: true }
//   );
// }

// function destroyProfileCropper() {
//   if (profileCropper) {
//     profileCropper.destroy();
//     profileCropper = null;
//   }
// }

// function saveCroppedProfileImage() {
//   if (!profileCropper) {
//     showNotification("Cropper is not ready", "warning");
//     return;
//   }

//   profileCropper.getCroppedCanvas({
//     width: 400,
//     height: 400,
//     imageSmoothingEnabled: true,
//     imageSmoothingQuality: "high"
//   }).toBlob(function (blob) {
//     if (!blob) {
//       showNotification("Failed to crop image", "danger");
//       return;
//     }

//     selectedProfileBlob = blob;
//     selectedProfileImage = new File([blob], "profile.jpg", { type: "image/jpeg" });

//     const previewUrl = URL.createObjectURL(blob);
//     renderProfileAvatar(previewUrl);

//     const cropModalEl = byId("cropImageModal");
//     const cropModal = bootstrap.Modal.getInstance(cropModalEl);
//     if (cropModal) cropModal.hide();

//     showNotification("Image cropped successfully. Click Save Changes.", "success");
//   }, "image/jpeg", 0.9);
// }

// function removeProfilePreview() {
//   selectedProfileImage = null;
//   selectedProfileBlob = null;

//   const imageInput = byId("profileImageInput");
//   if (imageInput) imageInput.value = "";

//   renderProfileAvatar();
//   showNotification("Selected image removed", "warning");
// }

// function togglePasswordVisibility(inputId, button) {
//   const input = byId(inputId);
//   if (!input || !button) return;

//   const icon = button.querySelector("i");
//   const isPassword = input.type === "password";
//   input.type = isPassword ? "text" : "password";

//   if (icon) {
//     icon.className = isPassword ? "bi bi-eye-slash" : "bi bi-eye";
//   }
// }

// function validatePasswordsLive() {
//   const newPasswordEl = byId("newPassword");
//   const confirmPasswordEl = byId("confirmPassword");
//   const errorBox = byId("passwordMismatchError");

//   if (!newPasswordEl || !confirmPasswordEl || !errorBox) return true;

//   const newPassword = newPasswordEl.value.trim();
//   const confirmPassword = confirmPasswordEl.value.trim();

//   if (!newPassword && !confirmPassword) {
//     errorBox.style.display = "none";
//     return true;
//   }

//   if (confirmPassword && newPassword !== confirmPassword) {
//     errorBox.style.display = "block";
//     return false;
//   }

//   errorBox.style.display = "none";
//   return true;
// }

// async function updateProfile() {
//   const user = getUser() || {};

//   const nameEl = byId("profileName");
//   const phoneEl = byId("profilePhone");
//   const emailEl = byId("profileEmail");
//   const newPasswordEl = byId("newPassword");
//   const confirmPasswordEl = byId("confirmPassword");
//   const saveBtn = byId("saveProfileBtn");

//   if (!nameEl || !phoneEl || !emailEl || !saveBtn) {
//     showNotification("Profile form is missing required fields", "danger");
//     return;
//   }

//   const name = nameEl.value.trim();
//   const phone = phoneEl.value.trim();
//   const email = emailEl.value.trim();
//   const newPassword = newPasswordEl ? newPasswordEl.value.trim() : "";
//   const confirmPassword = confirmPasswordEl ? confirmPasswordEl.value.trim() : "";

//   if (!user.id || !user.role || !name || !phone || !email) {
//     showNotification("All required fields must be filled", "danger");
//     return;
//   }

//   if ((newPassword || confirmPassword) && !newPassword) {
//     showNotification("Please enter new password", "danger");
//     return;
//   }

//   if ((newPassword || confirmPassword) && !confirmPassword) {
//     showNotification("Please enter confirm password", "danger");
//     return;
//   }

//   if (newPassword || confirmPassword) {
//     if (newPassword !== confirmPassword) {
//       const errorBox = byId("passwordMismatchError");
//       if (errorBox) errorBox.style.display = "block";
//       showNotification("New password and confirm password do not match", "danger");
//       return;
//     }
//   }

//   saveBtn.disabled = true;
//   saveBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Saving...`;

//   try {
//     const formData = new FormData();
//     formData.append("userid", user.id);
//     formData.append("role", user.role);
//     formData.append("name", name);
//     formData.append("phone", phone);
//     formData.append("email", email);

//     if (selectedProfileImage) formData.append("image", selectedProfileImage);
//     if (newPassword) formData.append("newpassword", newPassword);

//     const response = await fetchAPI("updateprofile", {
//       method: "POST",
//       body: formData
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || "Failed to update profile");
//     }

//     if (window.localStorage) {
//       localStorage.setItem("name", name);
//       localStorage.setItem("phone", phone);
//       localStorage.setItem("email", email);
//       if (data.filename) localStorage.setItem("profileimage", data.filename);
//     }

//     selectedProfileImage = null;
//     selectedProfileBlob = null;

//     if (byId("profileImageInput")) byId("profileImageInput").value = "";
//     if (newPasswordEl) newPasswordEl.value = "";
//     if (confirmPasswordEl) confirmPasswordEl.value = "";

//     validatePasswordsLive();

//     if (byId("profileHeroName")) byId("profileHeroName").textContent = name;
//     if (byId("profileHeroRole")) byId("profileHeroRole").textContent = capitalize(user.role);

//     if (profileNameEl = byId("profileName")) profileNameEl.setAttribute("readonly", true);
//     if (profilePhoneEl = byId("profilePhone")) profilePhoneEl.setAttribute("readonly", true);

//     profileEditEnabled = false;
//     if (byId("editProfileBtn")) byId("editProfileBtn").classList.remove("active");

//     renderProfileAvatar();
//     loadNavbar();

//     showNotification("Profile updated successfully", "success");
//   } catch (error) {
//     console.error("Profile update error:", error);
//     showNotification(error.message || "Profile update failed", "danger");
//   } finally {
//     saveBtn.disabled = false;
//     saveBtn.innerHTML = `<i class="bi bi-check2-circle me-2"></i>Save Changes`;
//   }
// }
// async function removeProfileImage() {
//   const role = localStorage.getItem("role");
//   const id =
//     role === "farmer"
//       ? localStorage.getItem("farmer_id")
//       : localStorage.getItem("salesman_id");

//   if (!role || !id) {
//     alert("User not logged in");
//     return;
//   }

//   const res = await fetch(`${API}/removeprofileimage`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ role, id })
//   });

//   const data = await res.json();

//   if (!res.ok) {
//     alert(data.message || "Failed to remove image");
//     return;
//   }

//   document.getElementById("profilePreview").src = "default-user.png";
//   alert(data.message);
// }
let selectedProfileImage = null;
let selectedProfileBlob = null;
let profileEditEnabled = false;
let profileCropper = null;
let cropImageObjectUrl = null;
let removeImageRequested = false;

function byId(id) {
  return document.getElementById(id);
}

function getUser() {
  const role = localStorage.getItem("role") || "";
  const farmerId = localStorage.getItem("farmerid") || "";
  const salesmanId = localStorage.getItem("salesmanid") || "";

  return {
    role,
    id: role === "farmer" ? farmerId : salesmanId,
    name: localStorage.getItem("name") || "",
    email: localStorage.getItem("email") || "",
    phone: localStorage.getItem("phone") || "",
    profile_image: localStorage.getItem("profile_image") || ""
  };
}

function saveUserToStorage(user) {
  if (!user) return;

  localStorage.setItem("role", user.role || "");
  localStorage.setItem("name", user.name || "");
  localStorage.setItem("email", user.email || "");
  localStorage.setItem("phone", user.phone || "");
  localStorage.setItem("profile_image", user.profile_image || "");

  if (user.role === "farmer") {
    localStorage.setItem("farmerid", user.id || "");
  } else if (user.role === "salesman") {
    localStorage.setItem("salesmanid", user.id || "");
  }
}

function capitalize(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
}

function initProfilePage() {
  const user = getUser();

  if (!user || !user.role || !user.id) {
    window.location.href = "login.html";
    return;
  }

  if (typeof loadNavbar === "function") {
    loadNavbar();
  }

  loadProfileData();

  const imageInput = byId("profileImageInput");
  if (imageInput) {
    imageInput.addEventListener("change", handleProfileImageSelection);
  }

  const cropModalEl = byId("cropImageModal");
  if (cropModalEl) {
    cropModalEl.addEventListener("hidden.bs.modal", function () {
      destroyProfileCropper();

      if (cropImageObjectUrl) {
        URL.revokeObjectURL(cropImageObjectUrl);
        cropImageObjectUrl = null;
      }
    });
  }

  document.addEventListener("click", function (e) {
    const menu = byId("imageActionMenu");
    const avatarWrap = byId("profileAvatarWrap");

    if (menu && avatarWrap && !avatarWrap.contains(e.target)) {
      menu.classList.add("d-none");
    }
  });
}

function loadProfileData() {
  const user = getUser();

  const heroName = byId("profileHeroName");
  const heroRole = byId("profileHeroRole");
  const profileName = byId("profileName");
  const profilePhone = byId("profilePhone");
  const profileEmail = byId("profileEmail");
  const profileRole = byId("profileRole");
  const profileId = byId("profileId");

  if (heroName) heroName.textContent = user.name || "User";
  if (heroRole) heroRole.textContent = capitalize(user.role || "");
  if (profileName) profileName.value = user.name || "";
  if (profilePhone) profilePhone.value = user.phone || "";
  if (profileEmail) profileEmail.value = user.email || "";
  if (profileRole) profileRole.value = capitalize(user.role || "");
  if (profileId) profileId.value = user.id || "";

  renderProfileAvatar();
}

function renderProfileAvatar(previewSrc = "") {
  const user = getUser();
  const img = byId("profileAvatarImg");
  const initial = byId("profileAvatarInitial");
  const removeBtn = byId("profileAvatarRemove");

  if (!img || !initial || !removeBtn) return;

  const savedImage = user.profile_image ? `${API}/uploads/${user.profile_image}` : "";
  const finalSrc = previewSrc || savedImage;

  if (finalSrc) {
    img.src = finalSrc;
    img.classList.remove("d-none");
    initial.classList.add("d-none");
    removeBtn.classList.remove("d-none");
  } else {
    img.removeAttribute("src");
    img.classList.add("d-none");
    initial.classList.remove("d-none");
    initial.textContent = (user.name || "U").charAt(0).toUpperCase();
    removeBtn.classList.add("d-none");
  }
}

function enableProfileEdit() {
  profileEditEnabled = true;

  const profileName = byId("profileName");
  const profilePhone = byId("profilePhone");
  const editBtn = byId("editProfileBtn");

  if (profileName) profileName.removeAttribute("readonly");
  if (profilePhone) profilePhone.removeAttribute("readonly");
  if (editBtn) editBtn.classList.add("active");

  if (typeof showNotification === "function") {
    showNotification("Edit mode enabled", "success");
  }
}

function toggleImageMenu(event) {
  if (event) event.stopPropagation();
  const menu = byId("imageActionMenu");
  if (menu) menu.classList.toggle("d-none");
}

function chooseNewImage() {
  const menu = byId("imageActionMenu");
  if (menu) menu.classList.add("d-none");

  const input = byId("profileImageInput");
  if (input) input.click();
}

function handleProfileImageSelection(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    if (typeof showNotification === "function") {
      showNotification("Please select a valid image file", "danger");
    }
    event.target.value = "";
    return;
  }

  removeImageRequested = false;
  openCropperModal(file);
}

function openCropperModal(file) {
  const cropImage = byId("cropperImage");
  const cropModalEl = byId("cropImageModal");

  if (!cropImage || !cropModalEl) {
    if (typeof showNotification === "function") {
      showNotification("Crop modal not found", "danger");
    }
    return;
  }

  if (cropImageObjectUrl) {
    URL.revokeObjectURL(cropImageObjectUrl);
    cropImageObjectUrl = null;
  }

  cropImageObjectUrl = URL.createObjectURL(file);
  cropImage.src = cropImageObjectUrl;

  const cropModal = new bootstrap.Modal(cropModalEl);
  cropModal.show();

  cropModalEl.addEventListener(
    "shown.bs.modal",
    function initCropperOnce() {
      destroyProfileCropper();

      profileCropper = new Cropper(cropImage, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: "move",
        autoCropArea: 1,
        responsive: true,
        background: false
      });
    },
    { once: true }
  );
}

function destroyProfileCropper() {
  if (profileCropper) {
    profileCropper.destroy();
    profileCropper = null;
  }
}

function saveCroppedProfileImage() {
  if (!profileCropper) {
    if (typeof showNotification === "function") {
      showNotification("Cropper is not ready", "warning");
    }
    return;
  }

  profileCropper
    .getCroppedCanvas({
      width: 400,
      height: 400,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high"
    })
    .toBlob(function (blob) {
      if (!blob) {
        if (typeof showNotification === "function") {
          showNotification("Failed to crop image", "danger");
        }
        return;
      }

      selectedProfileBlob = blob;
      selectedProfileImage = new File([blob], "profile.jpg", { type: "image/jpeg" });
      removeImageRequested = false;

      const previewUrl = URL.createObjectURL(blob);
      renderProfileAvatar(previewSrc = previewUrl);

      const cropModalEl = byId("cropImageModal");
      const cropModal = bootstrap.Modal.getInstance(cropModalEl);
      if (cropModal) cropModal.hide();

      if (typeof showNotification === "function") {
        showNotification("Image cropped successfully. Click Save Changes.", "success");
      }
    }, "image/jpeg", 0.9);
}

function removeProfilePreview() {
  selectedProfileImage = null;
  selectedProfileBlob = null;
  removeImageRequested = true;

  const imageInput = byId("profileImageInput");
  if (imageInput) imageInput.value = "";

  renderProfileAvatar("");

  if (typeof showNotification === "function") {
    showNotification("Image will be removed after Save Changes", "warning");
  }
}

async function updateProfile() {
  const user = getUser();

  const nameEl = byId("profileName");
  const phoneEl = byId("profilePhone");
  const emailEl = byId("profileEmail");
  const saveBtn = byId("saveProfileBtn");

  if (!nameEl || !phoneEl || !emailEl || !saveBtn) {
    if (typeof showNotification === "function") {
      showNotification("Profile form is missing required fields", "danger");
    }
    return;
  }

  const name = nameEl.value.trim();
  const phone = phoneEl.value.trim();
  const email = emailEl.value.trim();

  if (!user.id || !user.role) {
    if (typeof showNotification === "function") {
      showNotification("User session not found. Please login again.", "danger");
    }
    return;
  }

  if (!name || !phone || !email) {
    if (typeof showNotification === "function") {
      showNotification("All required fields must be filled", "danger");
    }
    return;
  }

  saveBtn.disabled = true;
  saveBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Saving...`;

  try {
    if (removeImageRequested) {
      const removeRes = await fetch(`${API}/removeprofileimage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: user.role,
          id: user.id
        })
      });

      const removeData = await removeRes.json();

      if (!removeRes.ok) {
        throw new Error(removeData.message || "Failed to remove image");
      }
    }

    const formData = new FormData();
    formData.append("userid", user.id);
    formData.append("role", user.role);
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("email", email);

    if (selectedProfileImage) {
      formData.append("image", selectedProfileImage);
    }

    const response = await fetch(`${API}/updateprofile`, {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update profile");
    }

    const updatedUser = {
      ...user,
      name,
      phone,
      email,
      profile_image: selectedProfileImage
        ? (data.filename || "")
        : (removeImageRequested ? "" : (data.filename || user.profile_image || ""))
    };

    if (removeImageRequested) {
      updatedUser.profile_image = "";
    }

    saveUserToStorage(updatedUser);

    selectedProfileImage = null;
    selectedProfileBlob = null;
    removeImageRequested = false;

    const imageInput = byId("profileImageInput");
    if (imageInput) imageInput.value = "";

    const heroName = byId("profileHeroName");
    const heroRole = byId("profileHeroRole");

    if (heroName) heroName.textContent = name;
    if (heroRole) heroRole.textContent = capitalize(user.role);

    nameEl.setAttribute("readonly", true);
    phoneEl.setAttribute("readonly", true);

    profileEditEnabled = false;
    const editBtn = byId("editProfileBtn");
    if (editBtn) editBtn.classList.remove("active");

    if (updatedUser.profile_image) {
      renderProfileAvatar(`${API}/uploads/${updatedUser.profile_image}?v=${Date.now()}`);
    } else {
      renderProfileAvatar("");
    }

    if (typeof loadNavbar === "function") {
      loadNavbar();
    }

    if (typeof showNotification === "function") {
      showNotification("Profile updated successfully", "success");
    }
  } catch (error) {
    console.error("Profile update error:", error);

    if (typeof showNotification === "function") {
      showNotification(error.message || "Profile update failed", "danger");
    }
  } finally {
    saveBtn.disabled = false;
    saveBtn.innerHTML = `<i class="bi bi-check2-circle me-2"></i>Save Changes`;
  }
}

document.addEventListener("DOMContentLoaded", initProfilePage);