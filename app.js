const header = document.querySelector("#header");
const contenedor = document.querySelector("#contenedor");

window.addEventListener("scroll", function () {
  if (contenedor.getBoundingClientRect().top < 10) {
    header.classList.add("scroll");
  } else {
    header.classList.remove("scroll");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const openCartBtn = document.getElementById("open-cart");
  const closeCartBtn = document.getElementById("close-cart");
  const sidebarCart = document.getElementById("sidebar-cart");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  let cart = JSON.parse(localStorage.getItem("carrito")) || [];

  openCartBtn.addEventListener("click", () => {
    sidebarCart.classList.add("active");
  });

  closeCartBtn.addEventListener("click", () => {
    sidebarCart.classList.remove("active");
  });

  function actualizarLocalStorage() {
    localStorage.setItem("carrito", JSON.stringify(cart));
  }

  function addItemToCart(title, price) {
    const existingItem = cart.find((product) => product.title === title);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ title, price, quantity: 1 });
    }

    actualizarLocalStorage();
    renderCart();
  }

  function renderCart() {
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      const div = document.createElement("div");
      div.classList.add("cart-product");
      div.innerHTML = `
        <div>
          <h3><strong>${item.title}</strong></h3>
          <div class="quantity-controls">
            <button class="quantity-btn" onclick="decreaseQuantity(${index})">-</button>
            <span>${item.quantity}</span>
            <button class="quantity-btn" onclick="increaseQuantity(${index})">+</button>
          </div>
        </div>
        <div>
          <p>${(item.price * item.quantity).toLocaleString("es-PE", {
            style: "currency",
            currency: "PEN",
          })}</p>
        </div>
      `;
      cartItems.appendChild(div);
      total += item.price * item.quantity;
    });

    if (cartTotal) {
      cartTotal.querySelector("h3").textContent = `Total: ${total.toLocaleString("es-PE", {
        style: "currency",
        currency: "PEN",
      })}`;
    }

    const detalle = cart.map((item) => ({
      nombre: item.title,
      cantidad: item.quantity,
      precio: item.price,
      subtotal: item.price * item.quantity,
    }));

    localStorage.setItem("detalleCarrito", JSON.stringify(detalle));
    localStorage.setItem("totalCarrito", total.toFixed(2));
  }

  window.increaseQuantity = function (index) {
    cart[index].quantity++;
    actualizarLocalStorage();
    renderCart();
  };

  window.decreaseQuantity = function (index) {
    cart[index].quantity--;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
    actualizarLocalStorage();
    renderCart();
  };

  document.querySelectorAll(".btn-add-cart").forEach((button) => {
    button.addEventListener("click", (e) => {
      const infoDiv = e.target.closest(".informacion");
      const productoDiv = infoDiv.parentElement;
      const img = productoDiv.querySelector("img");
      const title = infoDiv.querySelector("h3").textContent;
      const priceText = infoDiv.querySelector(".precio").textContent.match(/S\/\s?([\d.]+)/);
      const price = priceText ? parseFloat(priceText[1]) : 0;
  
      addItemToCart(title, price);
  
      // Abrir modal con datos del <img>
      abrirModal(img);
    });
  });
  

  document.querySelectorAll("img[data-titulo]").forEach((img) => {
    img.addEventListener("click", () => abrirModal(img));
  });

  function abrirModal(triggerElement) {
    // Busca el contenedor principal del producto
    const productoDiv = triggerElement.closest("div").parentElement;
    const imagen = productoDiv.querySelector("img[data-titulo]");
  
    if (!imagen) {
      console.error("No se encontró imagen con atributos data-titulo");
      return;
    }
  
    const titulo = imagen.getAttribute("data-titulo");
    const descripcion = imagen.getAttribute("data-description").replace(/\n/g, "<br>");
    const src = imagen.getAttribute("src");
    const link = imagen.getAttribute("data-link");
  
    document.getElementById("modalTitulo").textContent = titulo;
    document.getElementById("modalDescripcion").innerHTML = descripcion;
    document.getElementById("modalImagen").src = src;
  
    const botonModal = document.querySelector('.btn-seeinformation');
    botonModal.setAttribute('data-link', link);
  
    document.getElementById("miModal").style.display = "block";
  }
  
  

  document.querySelector(".cerrar").onclick = function () {
    document.getElementById("miModal").style.display = "none";
  };

  window.onclick = function (event) {
    const modal = document.getElementById("miModal");
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  document.querySelector(".btn-seeinformation").addEventListener("click", function () {
    const link = this.getAttribute("data-link");
    if (link) {
      window.open(link, "_blank");
    }
  });

  // Opciones de pago
  document.querySelectorAll(".payment-option").forEach((option) => {
    option.addEventListener("click", (e) => {
      const metodo = e.target.textContent.trim();

      if (metodo.includes("Credit Cart")) {
        window.location.href = "pago_tarjeta.html";
      } else if (metodo.includes("Debit Cart")) {
        window.location.href = "pago_tarjeta_debito.html";
      } else if (metodo.includes("Yape")) {
        window.location.href = "pago_yape.html";
      } else if (metodo.includes("Plin")) {
        window.location.href = "pago_plin.html";
      }
    });
  });

  // Render inicial si hay productos en localStorage
  renderCart();
});
