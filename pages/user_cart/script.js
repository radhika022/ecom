const cartElem = document.getElementById("cart_items");

fetch("/cart")
  .then((res) => res.json())
  .then((data) => {
    if (data.success) {
      showCart(data.cart);
    }
  })
  .catch(console.error);

async function showCart(cart) {
  for (const productId in cart) {
    try {
      let quantity = cart[productId].quantity;
      const payload = await fetch(`/products/?id=${productId}`);
      const res = await payload.json();
      let product = res.product;
      if (!res.found) {
        product = {
          price: 0,
          name: "Product no longer available",
          id: productId,
          stock: 0,
        };
        quantity = 0;
      }
      showItem(product, quantity);
    } catch (err) {
      console.error(err);
    }
  }

  function showItem(product, quantity) {
    const { imagePath, price, name, id, stock } = product;
    const li = document.createElement("li");
    li.innerHTML = `<div class="product">
          <img src="/static/images/${imagePath}" class="product-image" width="100"/>
          <div class="info">
            <h3 class="product-name" >${name.toUpperCase()}</h3>
            <p class="product-price">Price: ${price}</p>
            <p class="product-qty">Quantity: <span id="quantity_${id}"> ${quantity} </span>
              <button class="btn dec" id="dec_btn_${id}">-</button>
              <button class="btn inc" id="inc_btn_${id}">+</button>
            </p>
          </div>
          <div class="desc">
            <button class="btn delete" id="del_btn_${id}">Delete</button>
            <button class="btn view" id="view_desc_btn_${id}">View Desc</button>
          </div>
        </div>`;
    cartElem.appendChild(li);

    const quantityElem = document.getElementById(`quantity_${id}`);

    const decBtn = document.getElementById(`dec_btn_${id}`);
    const incBtn = document.getElementById(`inc_btn_${id}`);

    const delBtn = document.getElementById(`del_btn_${id}`);
    const infoBtn = document.getElementById(`view_desc_btn_${id}`);

    decBtn.onclick = function () {
      const fd = new FormData();
      fd.set("product_id", id);
      fd.set("quantity", quantity - 1);
      fetch("/cart", { method: "POST", body: fd })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            quantity--;
            quantityElem.textContent = quantity;
          } else {
            throw res.message;
          }
        })
        .catch(console.error);
    };

    incBtn.onclick = function () {
      const fd = new FormData();
      fd.set("product_id", id);
      fd.set("quantity", quantity + 1);
      fetch("/cart", { method: "POST", body: fd })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            quantity++;
            quantityElem.textContent = quantity;
          } else {
            throw res.message;
          }
        })
        .catch(console.error);
    };

    delBtn.onclick = function () {
      fetch(`/cart/${id}`, { method: "DELETE" })
        .then((res) => {
          // if(res.success){
          li.remove();
          // }
        })
        .catch(console.error);
    };

    // infoBtn.onclick = function () {
    //   product.showDesc();
    // };
  }
}
