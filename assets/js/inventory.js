// Add Product
async function addProduct() {
  const name = document.getElementById("name").value;
  const category = document.getElementById("category").value;
  const price = document.getElementById("price").value;
  const stock = document.getElementById("stock").value;
  const message = document.getElementById("message");

  try {
    const res = await fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        category,
        price,
        stock,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      message.innerText = "✅ Product Added Successfully";
      loadProducts();
    } else {
      message.innerText = data.message;
    }
  } catch (error) {
    console.log(error);
  }
}

// Load Products
async function loadProducts() {
  const res = await fetch("http://localhost:5000/api/products");
  const products = await res.json();

  document.getElementById("productList").innerHTML = products
    .map(
      (p) => `
      <div class="product-card">
        <b>${p.name}</b> | ${p.category} | ₹${p.price} | Stock: ${p.stock}

        ${
          p.stock < 5
            ? '<p style="color:red;font-weight:bold;">⚠️ Low Stock Alert!</p>'
            : ""
        }
        <br><br>

         <button onclick="editProduct('${p._id}','${p.name}','${p.category}',${p.price},${p.stock})">
        ✏️ Edit
        </button>

       <button onclick="deleteProduct('${p._id}')">
       🗑️ Delete
      </button>
      </div>
    `
    )
    .join("");
}

// Delete Product
async function deleteProduct(id) {
  const ok = confirm("Delete this product?");

  if (!ok) return;

  await fetch(`http://localhost:5000/api/products/${id}`, {
    method: "DELETE",
  });

  loadProducts();
}

// Search Products
function searchProducts() {
  const searchValue = document
    .getElementById("search")
    .value
    .toLowerCase();

  const cards = document.querySelectorAll(".product-card");

  cards.forEach((card) => {
    if (card.innerText.toLowerCase().includes(searchValue)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// Page load hote hi products dikhao
loadProducts();

async function editProduct(id, name, category, price, stock) {

    const newName = prompt("Product Name:", name);
    const newCategory = prompt("Category:", category);
    const newPrice = prompt("Price:", price);
    const newStock = prompt("Stock:", stock);

    if (!newName) return;

    await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: newName,
            category: newCategory,
            price: newPrice,
            stock: newStock,
        }),
    });

    loadProducts();
}