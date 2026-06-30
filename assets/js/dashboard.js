async function loadDashboardStats() {
  let data = null;

  try {
    const res = await fetch("https://ambika-billing-system.onrender.com/api/dashboard/stats");
    if (res.ok) {
      data = await res.json();
    }
  } catch (error) {
    data = null;
  }

  const localData = JSON.parse(localStorage.getItem("ambikaAppData") || "{}");
  const sales = localData.sales || [];
  const purchases = localData.purchases || [];

  const totalRevenue = data?.totalRevenue ??
    sales.reduce((sum, s) => sum + (Number(s.totalAmount ?? s.amount ?? 0) || 0), 0);

  const totalPaid = data?.totalPaid ??
    purchases.reduce((sum, p) => sum + (Number(p.totalAmount ?? p.amount ?? 0) || 0), 0);

  const gstCollected = data?.gstCollected ??
    sales.reduce((sum, s) => {
      const amount = Number(s.totalAmount ?? s.amount ?? 0) || 0;
      const gstValue = typeof s.gst === "number"
        ? s.gst
        : Number.isFinite(Number(s.gst))
          ? Number(s.gst)
          : 0;
      return sum + (gstValue > 0 ? (amount * gstValue) / 100 : 0);
    }, 0);

  const netProfit = data?.netProfit ?? (totalRevenue - totalPaid);

  document.getElementById("totalProducts").innerText = data?.totalProducts ?? "0";
  document.getElementById("totalSales").innerText = data?.totalSales ?? sales.length;
  document.getElementById("totalPurchases").innerText = data?.totalPurchases ?? purchases.length;
  document.getElementById("totalRevenue").innerText = "₹ " + Number(totalRevenue).toFixed(2);
  document.getElementById("totalPaid").innerText = "₹ " + Number(totalPaid).toFixed(2);
  document.getElementById("gstCollected").innerText = "₹ " + Number(gstCollected).toFixed(2);
  document.getElementById("netProfit").innerText = "₹ " + Number(netProfit).toFixed(2);
}

document.addEventListener("DOMContentLoaded", loadDashboardStats);