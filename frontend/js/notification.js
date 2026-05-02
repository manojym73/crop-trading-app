function showNotification(message, type = "success") {
  const toastEl = document.getElementById("liveToast");
  const toastBody = document.getElementById("toast-message");

  if (!toastEl || !toastBody || typeof bootstrap === "undefined") {
    alert(message);
    return;
  }

  toastEl.className = `toast align-items-center text-white border-0 bg-${type}`;
  toastBody.innerText = message;

  const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();
}