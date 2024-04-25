const productsElem = document.getElementById("product_list");

fetch("/products")
  .then((res) => res.json())
  .then((data) => {
    if (data.success) {
      showProducts(data.products);
    } else {
      console.error(data.message);
    }
  })
  .catch(console.error);

function showProducts(products) {
  for (const product of products) {
    const { name, price, id, imagePath, stock, desc } = product;
    const available = parseInt(stock) > 0;
    const li = document.createElement("li");
    li.innerHTML = `
        <div class="product">
          <img class="product-image" src="/static/images/${imagePath}" width="100"/>
          <div class="info">
            <h3 class="name" >${name.toUpperCase()}</h3>
            <p class="price">Price: ${price}</p>
          </div>
          <div class="desc">
            <button class="btn add-cart" id="add_cart_btn_${id}" ${
      available ? "" : "disabled"
    }>${available ? "Add To Cart" : "Out of stock"}</button>
            <button class="btn view" id="view_desc_btn_${id}">View Desc</button>
          </div>

<dialog id="desc_dialog_${id}">
  <p>${desc}</p>
  <form method="dialog">
    <button>OK</button>
  </form>
</dialog>
        </div>`;

    productsElem.appendChild(li);

    const addCartBtn = document.getElementById(`add_cart_btn_${id}`);

    addCartBtn.onclick = function () {
      console.log("hello");
      const payload = new FormData();
      payload.set("product_id", id);
      fetch("/products/cart", { method: "POST", body: payload })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          // window.location.href = "/user_cart";
        })
        .catch(console.error);
    };

    const infoBtn = document.getElementById(`view_desc_btn_${id}`);
    const descDialog= document.getElementById(`desc_dialog_${id}`);

    infoBtn.onclick = function () {
      descDialog.open = true;
      // product.showDesc();
    };
  }
}
