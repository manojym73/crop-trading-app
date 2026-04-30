function showNotification(message){

    let box = document.getElementById("notification-box")

    // ❌ if element not found → stop
    if(!box) return

    box.innerText = message
    box.style.display = "block"

    setTimeout(() => {
        box.style.display = "none"
    }, 3000)
}