async function loadProducts() {
  const res = await fetch("http://localhost:5000/api/products");
  const products = await res.json();

  const select = document.getElementById("productSelect");
  select.innerHTML = '<option value="">Select Product</option>';

  products.forEach((product) => {
    select.innerHTML += `
      <option value="${product._id}">
        ${product.name} (Stock: ${product.stock})
      </option>
    `;
  });
}
//create sale
async function createSale() {
  const customerName = document.getElementById("customerName").value;
  const customerGST = document.getElementById("customerGST").value;
  const gst = document.getElementById("saleGST").value;
  const productId = document.getElementById("productSelect").value;
  const quantity = document.getElementById("quantity").value;
  const message = document.getElementById("message");

  const res = await fetch("http://localhost:5000/api/sales", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customerName,
      customerGST,
      gst: Number(gst || 0),
      productId,
      quantity,
    }),
  });

  const data = await res.json();

  if (res.ok) {
    message.style.color = "green";
    message.innerText = "✅ Sale Created Successfully";
    loadProducts();
    loadSales();
  } else {
    message.style.color = "red";
    message.innerText = data.message;
  }
}
// Load sales and display them
async function loadSales() {
  const res = await fetch("http://localhost:5000/api/sales");
  const sales = await res.json();

  const salesList = document.getElementById("sellList");

  if (!sales || sales.length === 0) {
    salesList.innerHTML = `<div class="no-data"><p>No sales recorded yet</p></div>`;
    return;
  }

  salesList.innerHTML = sales
    .map(
      (sale, index) => `
      <div class="item-row compact-card">
        <div class="item-details">
          <div class="item-name">👤 ${sale.customerName || "Customer"}</div>
          <div>📦 ${sale.product?.name || "Product"}</div>
          <div>Qty: ${sale.quantity}</div>
          <div>Date: ${new Date(sale.createdAt).toLocaleDateString()}</div>
        </div>

        <div class="item-amount">₹${sale.totalAmount}</div>

        <div class="item-actions">
          <button class="btn btn-secondary" onclick="openInvoice(${index})">
            🧾 Print Bill
          </button>
        </div>
      </div>
    `
    )
    .join("");

  window.allSales = sales;
}
//print invoice

function printInvoice(index) {
  const sale = window.allSales[index];

  if (!sale) {
    alert("Sale not found");
    return;
  }

  const invoiceHTML = `
    <html>
    <head><title>Invoice</title></head>
    <body style="font-family:Arial; padding:30px;">
      <h2>Ambika Billing System</h2>
      <hr>
      <p><b>Customer:</b> ${sale.customerName}</p>
      <p><b>Product:</b> ${sale.product?.name || "Product"}</p>
      <p><b>Quantity:</b> ${sale.quantity}</p>
      <p><b>Total Amount:</b> ₹${sale.totalAmount}</p>
      <p><b>Date:</b> ${new Date(sale.createdAt).toLocaleString()}</p>
      <hr>
      <h3>Thank You!</h3>
    </body>
    </html>
  `;

  const newTab = window.open();
  newTab.document.write(invoiceHTML);
  newTab.document.close();
}
function openInvoice(index) {
  const sale = window.allSales[index];

  localStorage.setItem("selectedSale", JSON.stringify(sale));

  window.open("invoice.html", "_blank");
}
document.addEventListener("DOMContentLoaded", function () {
  loadProducts();
  loadSales();
});