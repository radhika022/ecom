const productsElem = document.getElementById("product_list");
const formWrapper = document.getElementById("form_wrapper");
const addForm = document.getElementById("add_form");

fetch("/products/user")
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
    const { name, price, id, imagePath } = product;
    const li = document.createElement("li");
    li.innerHTML = `
        <div class="product">
          <img class="product-image" src="/static/images/${imagePath}" width="100"/>
          <div class="info">
            <h3 class="name" >${name.toUpperCase()}</h3>
            <p class="price">Price: ${price}</p>
          </div>
          <div class="desc">
            <button class="btn add-cart" id="edit_btn_${id}">Edit</button>
            <button class="btn view" id="remove_btn_${id}">Remove</button>
          </div>
        </div>`;

    productsElem.appendChild(li);

    const editBtn = document.getElementById(`edit_btn_${id}`);

    editBtn.onclick = function () {
      productsElem.style.setProperty("display", "none");
      formWrapper.style.removeProperty("display");
      fillForm(product);
    };

    const removeBtn = document.getElementById(`remove_btn_${id}`);

    removeBtn.onclick = function () {
      fetch(`/products/${id}`, { method: "DELETE" })
        .then((res) => {
          // if(res.success){
          li.remove();
          // }
        })
        .catch(console.error);
    };

    addForm.onsubmit = function (eve) {
      eve.preventDefault();
      const fd = new FormData(addForm);

      fetch(`/products/${id}`, {
        method: "POST",
        body: fd,
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          if (!res.success) {
            infoElem.style.color = "red";
          } else {
            addForm.reset();
            infoElem.style.color = "green";
          }
          infoElem.innerHTML = res.message;
        })
        .catch(console.error);
    };
  }
}

function fillForm(product) {
  for (const field in product) {
    const elem = addForm[field];
    if (typeof elem == "object") elem.value = product[field];
  }
}

const infoElem = document.getElementById("info");
