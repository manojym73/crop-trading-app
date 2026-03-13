function loadCropChart() {

    fetch(API + "/crops")

        .then(res => res.json())

        .then(data => {

            let labels = []
            let quantities = []

            data.crops.forEach(crop => {

                labels.push(crop.crop_name)
                quantities.push(crop.quantity)

            })

            const ctx = document.getElementById("cropChart");

            new Chart(ctx, {

                type: "bar",

                data: {
                    labels: labels,
                    datasets: [{
                        label: "Available Quantity",
                        data: quantities,
                        backgroundColor: "#2c7a4b"
                    }]
                }

            })

        })

}