async function loadBills() {
  const billsList = document.getElementById("billsList");

  try {
    const res = await fetch("https://ambika-billing-system.onrender.com/api/sales");
    const sales = await res.json();

    if (!sales || sales.length === 0) {
      billsList.innerHTML = `
        <div class="no-data">
          <div class="no-data-icon">📄</div>
          <p>No bills created yet</p>
        </div>
      `;
      return;
    }

    window.allBills = sales;

    billsList.innerHTML = sales
      .map((sale, index) => {
        const billNo = sale.billNo || `BILL-${String(index + 1).padStart(4, "0")}`;

        return `
          <div class="item-row bill-card">
            <div class="item-details">
              <div class="item-date">
                ${new Date(sale.createdAt || Date.now()).toLocaleDateString()}
              </div>

              <div class="item-name">
                🧾 ${billNo}
              </div>

              <div>👤 ${sale.customerName || "Customer"}</div>

              <div>
                📦 ${sale.product?.name || sale.productName || "Product"}
                | Qty: ${sale.quantity || 0}
              </div>
            </div>

            <div class="item-amount">
              ₹${Number(sale.totalAmount || 0).toFixed(2)}
            </div>

            <div class="item-actions">
              <button class="btn btn-secondary" onclick="openBill(${index})">
                🖨️ Print
              </button>
            </div>
          </div>
        `;
      })
      .join("");
  } catch (error) {
    console.error(error);
    billsList.innerHTML = `<p style="color:red;">Failed to load bills</p>`;
  }
}

function openBill(index) {
  const sale = window.allBills[index];

  if (!sale) {
    alert("Bill not found");
    return;
  }

  const company = JSON.parse(localStorage.getItem("company")) || {};

  localStorage.setItem("selectedSale", JSON.stringify(sale));
  localStorage.setItem("invoiceCompany", JSON.stringify(company));
  localStorage.setItem("invoiceBuyer", JSON.stringify({}));
  localStorage.setItem("showBuyerForm", "true");

  window.open("invoice.html", "_blank");
}

document.addEventListener("DOMContentLoaded", loadBills);