document.addEventListener("DOMContentLoaded", () => {
  const container   = document.getElementById("cart-container");
  const totalEl     = document.getElementById("grand-total");
  const checkoutBtn = document.getElementById("checkout-btn");

  // Muat cart atau inisialisasi []
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");

  function renderCart() {
    container.innerHTML = "";      // kosongkan daftar dulu
    let grandTotal = 0;

    if (cart.length === 0) {
      // Kalau kosong, tampilkan pesan
      const p = document.createElement("p");
      p.className = "text-center text-gray-500";
      p.textContent = "Keranjang belanja masih kosong.";
      container.appendChild(p);

      // Disable tombol checkout
      checkoutBtn.disabled = true;
      totalEl.textContent = formatCurrency(0);
      return;
    }

    // Kalau ada item, enable tombol
    checkoutBtn.disabled = false;

    // Render tiap item
    cart.forEach((item, idx) => {
      const subTotal = item.price * item.quantity;
      grandTotal += subTotal;

      const card = document.createElement("div");
      card.className = "grid grid-cols-6 gap-4 items-center bg-white p-4 rounded-xl shadow";
      card.innerHTML = `
        <div class="col-span-1">
          <img src="${item.image}" alt="${item.title}"
               class="h-16 w-16 object-contain mx-auto"/>
        </div>
        <div class="col-span-2">
          <p class="font-medium">${item.title}</p>
          <p class="text-sm text-gray-500">${formatCurrency(item.price)} / pcs</p>
        </div>
        <div class="col-span-1 flex items-center">
          <button data-idx="${idx}"
                  class="decrease px-2 text-lg font-bold disabled:opacity-50"
                  ${item.quantity <= 1 ? "disabled" : ""}>−</button>
          <span class="mx-2">${item.quantity}</span>
          <button data-idx="${idx}" class="increase px-2 text-lg font-bold">+</button>
        </div>
        <div class="col-span-1">
          <p class="font-medium">${formatCurrency(subTotal)}</p>
        </div>
        <div class="col-span-1 text-right">
          <button data-idx="${idx}" class="remove text-red-500 hover:underline text-sm">Remove</button>
        </div>
      `;
      container.appendChild(card);
    });

    // Update total
    totalEl.textContent = formatCurrency(grandTotal);

    // Bind event (+, −, remove)
    bindCartEvents();
  }

  function bindCartEvents() {
    document.querySelectorAll(".increase").forEach(btn => {
      btn.onclick = () => {
        const i = +btn.dataset.idx;
        cart[i].quantity++;
        saveAndRerender();
      };
    });
    document.querySelectorAll(".decrease").forEach(btn => {
      btn.onclick = () => {
        const i = +btn.dataset.idx;
        if (cart[i].quantity > 1) {
          cart[i].quantity--;
          saveAndRerender();
        }
      };
    });
    document.querySelectorAll(".remove").forEach(btn => {
      btn.onclick = () => {
        const i = +btn.dataset.idx;
        cart.splice(i, 1);
        saveAndRerender();
      };
    });
  }

  function saveAndRerender() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }

  function formatCurrency(value) {
    return value.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    });
  }

  // Tombol Checkout: munculkan alert, clear cart, rerender
  checkoutBtn.addEventListener("click", () => {
    alert(`✅ Checkout berhasil!\nTotal pembayaran: ${totalEl.textContent}`);
    cart = [];
    saveAndRerender();
  });

  // Render pertama
  renderCart();
});
