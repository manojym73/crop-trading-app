let cropChartInstance = null;

async function loadCropChart() {
  const canvas = document.getElementById("cropChart");
  if (!canvas) return;

  try {
    const res = await fetch(`${API}/crops`);
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to load chart data");

    const labels = [];
    const quantities = [];

    (data.crops || []).forEach(crop => {
      labels.push(crop.crop_name);
      quantities.push(Number(crop.quantity || 0));
    });

    if (cropChartInstance) {
      cropChartInstance.destroy();
    }

    cropChartInstance = new Chart(canvas, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Available Quantity (kg)",
          data: quantities,
          backgroundColor: [
            "#198754", "#20c997", "#0dcaf0", "#ffc107", "#fd7e14", "#6f42c1"
          ],
          borderRadius: 12,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: "#1f2937"
            }
          }
        },
        scales: {
          x: {
            ticks: { color: "#374151" },
            grid: { display: false }
          },
          y: {
            beginAtZero: true,
            ticks: { color: "#374151" }
          }
        },
        animation: {
          duration: 1200,
          easing: "easeOutQuart"
        }
      }
    });
  } catch (error) {
    console.error("Chart error:", error);
  }
}