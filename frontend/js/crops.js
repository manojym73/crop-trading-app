function getCropImage(imageName) {
  if (!imageName) {
    return "https://via.placeholder.com/600x350?text=No+Image";
  }
  return `${API}/uploads/${imageName}`;
}

function getCropCard(crop) {
  const quantity = Number(crop.quantity || 0);
  const price = Number(crop.price || 0);
  const imageUrl = getCropImage(crop.image);

  return `
    <div class="col-lg-4 col-md-6" data-aos="fade-up">
      <div class="card border-0 shadow-lg h-100 crop-card glass-card overflow-hidden">
        <div class="crop-image-wrap">
          <img
            src="${imageUrl}"
            class="card-img-top"
            alt="${crop.crop_name || "Crop"}"
            style="height: 220px; object-fit: cover;"
            onerror="this.src='https://via.placeholder.com/600x350?text=No+Image'"
          />
          <div class="crop-overlay"></div>
        </div>
        <div class="card-body d-flex flex-column">
          <h5 class="card-title fw-bold mb-2">${crop.crop_name || "Crop"}</h5>
          <p class="card-text mb-1"><b>Farmer:</b> ${crop.farmer_name || "N/A"}</p>
          <p class="card-text mb-1"><b>Price:</b> ₹${price}/kg</p>
          <p class="card-text mb-1"><b>Available:</b> ${quantity} kg</p>
          <p class="card-text mb-3"><b>Location:</b> ${crop.location || "N/A"}</p>

          <input
            id="qty-${crop.crop_id}"
            type="number"
            min="1"
            max="${quantity}"
            class="form-control modern-input mb-3"
            placeholder="Enter quantity (kg)"
          />

          <button
            class="btn btn-success btn-glow w-100 mt-auto"
            onclick="handleBuy(${crop.crop_id})"
            ${quantity <= 0 ? "disabled" : ""}
          >
            ${quantity > 0 ? "Buy Crop" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderCrops(crops) {
  const container = document.getElementById("crop-list");
  if (!container) return;

  const availableCrops = (crops || []).filter(crop => Number(crop.quantity || 0) > 0);

  if (availableCrops.length === 0) {
    container.innerHTML = `<p class="text-center text-muted fs-5">No crops available</p>`;
    return;
  }

  container.innerHTML = availableCrops.map(getCropCard).join("");
}

async function loadCrops() {
  const container = document.getElementById("crop-list");
  if (!container) return;

  container.innerHTML = `<p class="text-center text-muted">Loading crops...</p>`;

  try {
    const res = await fetch(`${API}/crops`);
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to load crops");
    renderCrops(data.crops || []);
  } catch (err) {
    console.error("Load crops error:", err);
    container.innerHTML = `<p class="text-danger text-center">${err.message || "Failed to load crops"}</p>`;
  }
}

function searchCrops() {
  const cropName = document.getElementById("searchCrop")?.value?.toLowerCase().trim() || "";
  const location = document.getElementById("searchLocation")?.value?.toLowerCase().trim() || "";
  const minPrice = parseFloat(document.getElementById("minPrice")?.value) || 0;
  const maxPrice = parseFloat(document.getElementById("maxPrice")?.value) || Infinity;
  const sortPrice = document.getElementById("sortPrice")?.value || "";
  const container = document.getElementById("crop-list");

  if (!container) return;

  fetch(`${API}/crops`)
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Failed to search crops");
      return data;
    })
    .then((data) => {
      let filtered = data.crops.filter((crop) => {
        const cropMatch = (crop.cropname || "").toLowerCase().includes(cropName);
        const locationMatch = (crop.location || "").toLowerCase().includes(location);
        const price = Number(crop.price) || 0;

        return cropMatch && locationMatch && price >= minPrice && price <= maxPrice;
      });

      if (sortPrice === "low") {
        filtered.sort((a, b) => Number(a.price) - Number(b.price));
      } else if (sortPrice === "high") {
        filtered.sort((a, b) => Number(b.price) - Number(a.price));
      }

      renderCrops(filtered);
    })
    .catch((err) => {
      console.error("Search crops error:", err);
      container.innerHTML = `<p class="text-danger text-center">${err.message}</p>`;
    });
}

function resetFilters() {
  document.getElementById("searchCrop").value = "";
  document.getElementById("searchLocation").value = "";
  document.getElementById("minPrice").value = "";
  document.getElementById("maxPrice").value = "";
  document.getElementById("sortPrice").value = "";

  loadCrops();
}

document.addEventListener("DOMContentLoaded", () => {
  ["searchCrop", "searchLocation", "minPrice", "maxPrice", "sortPrice"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", searchCrops);
      el.addEventListener("change", searchCrops);
    }
  });
});


async function addCrop() {
  const farmerId = localStorage.getItem("farmerid");

  if (!farmerId) {
    showNotification("Please login as Farmer first", "warning");
    window.location.href = "login.html";
    return;
  }

  const cropName = document.getElementById("cropname")?.value?.trim();
  const quantity = document.getElementById("quantity")?.value?.trim();
  const price = document.getElementById("price")?.value?.trim();
  const location = document.getElementById("location")?.value?.trim();
  const imageFile = document.getElementById("image")?.files?.[0];

  if (!cropName || !quantity || !price || !location) {
    showNotification("Please fill all crop fields", "warning");
    return;
  }

  const formData = new FormData();
  formData.append("farmer_id", farmerId);
  formData.append("crop_name", cropName);
  formData.append("quantity", quantity);
  formData.append("price", price);
  formData.append("location", location);

  if (imageFile) {
    formData.append("image", imageFile);
  }

  try {
    const res = await fetch(`${API}/add_crop`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to add crop");

    showNotification(data.message || "Crop added successfully", "success");

    document.getElementById("cropname").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("price").value = "";
    document.getElementById("location").value = "";
    document.getElementById("image").value = "";

    loadMyCrops();
    loadStats();
  } catch (err) {
    console.error("Add crop error:", err);
    showNotification(err.message || "Failed to add crop", "danger");
  }
}

async function placeOrder(cropId) {
  const salesmanId = localStorage.getItem("salesmanid");
  const qtyInput = document.getElementById(`qty-${cropId}`);
  const quantity = qtyInput ? qtyInput.value.trim() : "";

  if (!salesmanId) {
    showNotification("Please login as Salesman first", "warning");
    window.location.href = "login.html";
    return;
  }

  if (!quantity || Number(quantity) <= 0) {
    showNotification("Enter a valid quantity", "warning");
    return;
  }

  try {
    const res = await fetch(`${API}/place_order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        salesman_id: Number(salesmanId),
        crop_id: Number(cropId),
        quantity: Number(quantity)
      })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Order failed");

    showNotification(data.message || "Order placed successfully", "success");
    loadCrops();
    loadStats();
  } catch (err) {
    console.error("Order error:", err);
    showNotification(err.message || "Failed to place order", "danger");
  }
}

async function loadMyCrops() {
  const farmerId = Number(localStorage.getItem("farmerid"));
  const container = document.getElementById("my-crops");

  if (!container) return;

  if (!farmerId) {
    container.innerHTML = `<p class="text-muted">Please login as Farmer</p>`;
    return;
  }

  try {
    const res = await fetch(`${API}/crops`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to load crops");
    }

    const myCrops = (data.crops || []).filter(
      (crop) => Number(crop.farmer_id) === farmerId
    );

    if (myCrops.length === 0) {
      container.innerHTML = `<p class="text-center text-muted">No crops added yet</p>`;
      return;
    }

    container.innerHTML = myCrops.map((crop) => `
      <div class="col-lg-4 col-md-6" data-aos="fade-up">
        <div class="card border-0 shadow-lg crop-card h-100 glass-card">
          <img
            src="${getCropImage(crop.image)}"
            class="card-img-top"
            alt="${crop.crop_name || "Crop"}"
            style="height: 220px; object-fit: cover;"
            onerror="this.src='https://via.placeholder.com/600x350?text=No+Image'"
          />
          <div class="card-body d-flex flex-column">
            <h5 class="fw-bold">${crop.crop_name || "Crop"}</h5>
            <p class="mb-1"><b>Quantity:</b> ${crop.quantity || 0} kg</p>
            <p class="mb-1"><b>Price:</b> ₹${crop.price || 0}/kg</p>
            <p class="mb-3"><b>Location:</b> ${crop.location || "N/A"}</p>

            <div class="d-flex gap-2 mt-auto">
                <button
                  class="btn btn-success btn-sm w-50"
                  onclick="openEditModal(${crop.crop_id}, '${(crop.crop_name || "").replace(/'/g, "\\'")}', '${crop.quantity}', '${crop.price}', '${(crop.location || "").replace(/'/g, "\\'")}')"
                >
                  Update
                </button>

                <button
                  class="btn btn-outline-danger btn-sm w-50"
                  onclick="deleteCrop(${crop.crop_id})"
                >
                  Delete
                </button>
              </div>
          </div>
        </div>
      </div>
    `).join("");

  } catch (err) {
    console.error("Load my crops error:", err);
    container.innerHTML = `<p class="text-danger text-center">${err.message || "Failed to load crops"}</p>`;
  }
}


function openEditModal(cropId, cropName, quantity, price, location) {
  document.getElementById("editCropId").value = cropId;
  document.getElementById("editCropName").value = cropName;
  document.getElementById("editCropQuantity").value = quantity;
  document.getElementById("editCropPrice").value = price;
  document.getElementById("editCropLocation").value = location;

  const modal = new bootstrap.Modal(document.getElementById("editCropModal"));
  modal.show();
}

async function saveCropUpdate() {
  const cropId = document.getElementById("editCropId").value;
  const cropName = document.getElementById("editCropName").value.trim();
  const quantity = document.getElementById("editCropQuantity").value.trim();
  const price = document.getElementById("editCropPrice").value.trim();
  const location = document.getElementById("editCropLocation").value.trim();

  if (!cropName || !quantity || !price || !location) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await fetch(`${API}/update_crop/${cropId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        crop_name: cropName,
        quantity: quantity,
        price: price,
        location: location
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update crop");

    alert(data.message || "Crop updated successfully");

    const modalEl = document.getElementById("editCropModal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();

    loadMyCrops();
    loadCrops();
  } catch (err) {
    console.error("Update crop error:", err);
    alert(err.message);
  }
}

async function editCrop(cropId) {
  const cropName = prompt("Enter new crop name:");
  const quantity = prompt("Enter new quantity:");
  const price = prompt("Enter new price:");
  const location = prompt("Enter new location:");

  if (!cropName || !quantity || !price || !location) {
    alert("All fields are required");
    return;
  }

  try {
    const res = await fetch(`${API}/update_crop/${cropId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        crop_name: cropName,
        quantity: quantity,
        price: price,
        location: location
      })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to update crop");

    alert(data.message || "Crop updated successfully");
    loadMyCrops();
    loadCrops();
  } catch (err) {
    console.error("Update crop error:", err);
    alert(err.message);
  }
}

async function deleteCrop(cropId) {
  const ok = confirm("Are you sure you want to delete this crop?");
  if (!ok) return;

  try {
    const res = await fetch(`${API}/delete_crop/${cropId}`, {
      method: "DELETE"
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to delete crop");

    alert(data.message || "Crop deleted successfully");
    loadMyCrops();
    loadCrops();
  } catch (err) {
    console.error("Delete crop error:", err);
    alert(err.message);
  }
}


async function loadStats() {
  try {
    const res = await fetch(`${API}/stats`);
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to load stats");

    const totalCrops = document.getElementById("totalCrops");
    const totalOrders = document.getElementById("totalOrders");
    const totalFarmers = document.getElementById("totalFarmers");
    const totalSalesmen = document.getElementById("totalSalesmen");

    if (totalCrops) totalCrops.innerText = data.total_crops || 0;
    if (totalOrders) totalOrders.innerText = data.total_orders || 0;
    if (totalFarmers) totalFarmers.innerText = data.total_farmers || 0;
    if (totalSalesmen) totalSalesmen.innerText = data.total_salesmen || 0;
  } catch (err) {
    console.error("Stats error:", err);
  }
}