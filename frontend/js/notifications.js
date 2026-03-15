function showNotification(message) {

    let box = document.getElementById("notification-box")

    box.innerText = message

    box.style.display = "block"

    setTimeout(() => {

        box.style.display = "none"

    }, 4000)

}