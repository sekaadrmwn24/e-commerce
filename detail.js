document.addEventListener("DOMContentLoaded", async () => {
  const params    = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  if (!productId) return;

  try {
    const resp    = await fetch(`https://fakestoreapi.com/products/${productId}`);
    const product = await resp.json();

    renderProductDetail(product);
    initQuantityLogic(product);
    initAddToCart(product);

  } catch (err) {
    console.error("Gagal memuat detail produk:", err);
  }
});

function renderProductDetail(product) {
  const container = document.getElementById("product-detail");
  container.innerHTML = `
    <div class="grid md:grid-cols-2 gap-6 items-start bg-white p-6 rounded-xl shadow">
      <!-- Gambar -->
      <div class="flex justify-center">
        <img
          src="${product.image}"
          alt="${product.title}"
          class="h-60 w-60 object-contain"
        />
      </div>
      <!-- Info & Controls -->
      <div>
        <h1 class="text-2xl font-semibold mb-2">${product.title}</h1>
        <p class="text-sm mb-2">Size:</p>
        <div class="flex flex-wrap gap-2 mb-4">
          ${[36,37,38,42,43]
             .map(sz => `<span class="px-3 py-1 border rounded-full text-sm">${sz}</span>`)
             .join("")}
        </div>
        <p class="mb-4 text-gray-600 text-sm">
          Price: <span id="price">${formatCurrency(product.price)}</span>
        </p>
        <div class="flex items-center space-x-4 mb-4">
          <div id="quantity-wrapper" class="flex items-center border rounded overflow-hidden">
            <button id="decrease" class="px-3 text-lg font-bold disabled:opacity-50" disabled>−</button>
            <span id="quantity" class="px-4">1</span>
            <button id="increase" class="px-3 text-lg font-bold">+</button>
          </div>
          <button id="add-to-cart"
                  class="bg-lime-400 text-black font-semibold px-6 py-2 rounded hover:bg-lime-500 transition">
            ADD TO CART
          </button>
        </div>
        <p class="text-sm leading-relaxed border-t pt-4">
          Kalau kamu cari sneaker yang bisa bawa look sporty kamu ke level berikutnya,
          <strong>${product.title}</strong> ini wajib banget buat kamu miliki.
          Dengan desain yang nge-blend sempurna antara nuansa retro awal 2000-an
          dan sentuhan futuristik, sepatu ini bukan cuma buat lari—tapi juga
          buat nge-boost gaya kasual harian kamu.
        </p>
      </div>
    </div>
  `;
}

function initQuantityLogic(product) {
  let qty            = 1;
  const qtyDisplay   = document.getElementById("quantity");
  const priceDisplay = document.getElementById("price");
  const btnDec       = document.getElementById("decrease");
  const btnInc       = document.getElementById("increase");

  const updateUI = () => {
    qtyDisplay.textContent = qty;
    priceDisplay.textContent = formatCurrency(product.price * qty);
    btnDec.disabled = (qty <= 1);
  };

  btnInc.addEventListener("click", () => {
    qty++;
    updateUI();
  });
  btnDec.addEventListener("click", () => {
    if (qty > 1) {
      qty--;
      updateUI();
    }
  });
}

function initAddToCart(product) {
  const btnAdd = document.getElementById("add-to-cart");
  btnAdd.addEventListener("click", () => {
    // Baca quantity sekarang
    const qty = parseInt(document.getElementById("quantity").textContent, 10);

    // Ambil cart dari localStorage, atau inisialisasi array kosong
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    // Cek apakah produk sudah ada
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      // Update quantity
      existing.quantity += qty;
    } else {
      // Tambah item baru
      cart.push({
        id:       product.id,
        title:    product.title,
        price:    product.price,
        image:    product.image,
        quantity: qty
      });
    }

    // Simpan kembali ke localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Notifikasi sederhana
    alert(`Berhasil menambahkan ${qty} × "${product.title}" ke keranjang.`);
  });
}

function formatCurrency(value) {
  return value.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  });
}
