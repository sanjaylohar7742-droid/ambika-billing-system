function calculateTotal() {
  const qty = Number(document.getElementById("buyQuantity").value || 0);
  const rate = Number(document.getElementById("buyRate").value || 0);
  const gst = Number(document.getElementById("buyGST").value || 0);

  const amount = qty * rate + (qty * rate * gst) / 100;

  document.getElementById("buyTotalAmount").innerText = "₹ " + amount.toFixed(2);
  document.getElementById("buyAmount").value = amount.toFixed(2);
}

async function createBackendPurchase(e) {
  e.preventDefault();

  const supplierName = document.getElementById("buySupplier").value;
  const description = document.getElementById("buyDescription").value;
  const quantity = Number(document.getElementById("buyQuantity").value);
  const rate = Number(document.getElementById("buyRate").value);
  const gst = Number(document.getElementById("buyGST").value);
  const totalAmount = Number(document.getElementById("buyAmount").value);

  const productRes = await fetch("https://ambika-billing-system.onrender.com/api/products");
  const products = await productRes.json();

  let product = products.find(
    (p) => p.name.toLowerCase() === description.toLowerCase()
  );

  if (!product) {
    const newProductRes = await fetch("https://ambika-billing-system.onrender.com/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: description,
        category: "Purchase",
        price: rate,
        stock: 0,
      }),
    });

    const newProductData = await newProductRes.json();
    product = newProductData.product;
  }

  const res = await fetch("https://ambika-billing-system.onrender.com/api/purchases", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      supplierName,
      productId: product._id,
      quantity,
      totalAmount,
    }),
  });

  if (res.ok) {
    alert("✅ Purchase Added Successfully");
    document.getElementById("buyForm").reset();
    document.getElementById("buyTotalAmount").innerText = "₹ 0";
    loadPurchasesList();
  } else {
    const data = await res.json();
    alert(data.message);
  }
}

async function loadPurchasesList() {
  const container = document.getElementById("buyList");

  const res = await fetch("https://ambika-billing-system.onrender.com/api/purchases");
  const purchases = await res.json();

  if (!purchases || purchases.length === 0) {
    container.innerHTML =
      '<div class="no-data"><div class="no-data-icon">🛍️</div><p>No purchases recorded yet</p></div>';
    return;
  }

  container.innerHTML = purchases
    .map(
      (purchase) => `
      <div class="item-row">
        <div class="item-details">
          <div class="item-date">
            ${new Date(purchase.createdAt).toLocaleDateString()}
          </div>

          <div class="item-name">
            🏢 ${purchase.supplierName || "Supplier"}
          </div>

          <div>
            📦 ${purchase.product?.name || "Product"}
          </div>

          <div>
            Qty: <strong>${purchase.quantity}</strong>
          </div>
        </div>

        <div class="item-amount">
          ₹${Number(purchase.totalAmount).toFixed(2)}
        </div>
      </div>
    `
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", function () {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("buyDate").value = today;

  document.getElementById("buyQuantity").addEventListener("input", calculateTotal);
  document.getElementById("buyRate").addEventListener("input", calculateTotal);
  document.getElementById("buyGST").addEventListener("input", calculateTotal);

  document.getElementById("buyForm").addEventListener("submit", createBackendPurchase);

  loadPurchasesList();
});