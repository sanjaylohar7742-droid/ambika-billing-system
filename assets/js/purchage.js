// Load Products
async function loadProducts() {
  const res = await fetch("https://ambika-billing-system.onrender.com/api/products");
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

// Create Purchase
async function createPurchase() {
  const supplierName = document.getElementById("supplierName").value;
  const productId = document.getElementById("productSelect").value;
  const quantity = document.getElementById("quantity").value;
  const totalAmount = document.getElementById("totalAmount").value;

  const message = document.getElementById("message");

  const res = await fetch("https://ambika-billing-system.onrender.com/api/purchases", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      supplierName,
      productId,
      quantity,
      totalAmount,
    }),
  });

  const data = await res.json();

  if (res.ok) {
    message.style.color = "green";
    message.innerText = "✅ Purchase Added Successfully";

    loadProducts();
    loadPurchases();
  } else {
    message.style.color = "red";
    message.innerText = data.message;
  }
}

// Load Purchases
async function loadPurchases() {
  const res = await fetch("https://ambika-billing-system.onrender.com/api/purchases");
  const purchases = await res.json();

  const purchaseList = document.getElementById("purchaseList");

  if (purchases.length === 0) {
    purchaseList.innerHTML = "<p>No purchases found</p>";
    return;
  }

  purchaseList.innerHTML = purchases
    .map(
      (purchase) => `
      <div class="item-row">
        <div>
          👤 ${purchase.supplierName}<br>
          📦 ${purchase.product?.name}<br>
          Qty: ${purchase.quantity}
        </div>

        <div>
          ₹${purchase.totalAmount}
        </div>
      </div>
    `
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  loadPurchases();
});