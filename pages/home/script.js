const userNameElem = document.getElementById("user_name");
const logoutBtn = document.getElementById("logout_btn");
const productListElem = document.getElementById("product_list");

fetch("/user")
  .then((res) => res.json())
  .then((info) => {
    userNameElem.textContent = info.user;
  });

fetch("/cart")
  .then((res) => res.json())
  .then((data) => {
    // const list = data.list;
    // for (const taskId in list) {
    //   const task = list[taskId];
    //   showTask(task);
    // }
  }).catch(console.error);

logoutBtn.addEventListener("click", () => {
  fetch("/user", { method: "DELETE" })
    .then(() => {
      location.href = "/";
    })
    .catch(console.error);
});

// formAddTask.addEventListener("submit", (eve) => {
//   eve.preventDefault();
//   const fd = new FormData(formAddTask);
//   fetch("/todo", { method: "POST", body: fd })
//     .then((res) => res.json())
//     .then((data) => {
//       showTask(data.task);
//       formAddTask.reset();
//     }).catch(console.error);
// });

function createProductElem({
  id,
  name,
  imagePath,
  quantity,
} = {}) {
  const li = document.createElement("li");
  li.id = id;
  li.className = "list-group-item container";
  li.innerHTML = `
      <div class="product">
        <img src="${imagePath}" class="product-image" width="100"/>
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
  return li;
}

function showProduct(product) {
  const productElem = createProductElem(product);
  productListElem.appendChild(productElem);

  const infoElem = taskElem.querySelector("h2");
  const checkbox = taskElem.querySelector("input");
  const deleteBtn = taskElem.querySelector("i");

  deleteBtn.addEventListener("click", () => {
    fetch(`/todo/task/${id}`, { method: "DELETE" })
      .then(() => {
        taskElem.remove();
      }).catch(console.error);
  });

  function handleCheck() {
    fetch(`/todo/task/${id}`, { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        const completed = data.task.completed;
        checkbox.checked = completed;
        if (completed) {
          infoElem.classList.add("text-decoration-line-through");
        } else {
          infoElem.classList.remove("text-decoration-line-through");
        }
      }).catch(console.error);
  }

  infoElem.addEventListener("click", handleCheck);
  checkbox.addEventListener("click", handleCheck);
}
