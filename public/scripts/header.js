const headerArea = document.getElementById("header_area");

headerArea.innerHTML = `
      <ul>
        <li class="welcome">Welcome <b class="username" id="user_name">User</b></li>

        <li>
          <ul>

            <li class="hidden" id="btn_1_wrap"><button class="btn menu-btn" id="btn_1"></button></li>
            <li class="hidden" id="btn_2_wrap"><button class="btn menu-btn" id="btn_2"></button></li>
            <li class="hidden" id="btn_3_wrap"><button class="btn menu-btn" id="btn_3"></button></li>
            <li class="hidden" id="btn_4_wrap"><button class="btn menu-btn" id="btn_4"></button></li>

            <li><button class="btn menu-btn" id="pass_btn">Change Password</button></li>
            <li><button class="btn menu-btn logout-btn" id="logout_btn">Logout</button></li>
          </ul>
        </li>
      </ul>`;

const pageBtnMap = {};

pageBtnMap["/home/"] = [{
  name: "Add Product",
  loc: "/add_product",
  admin: true,
}, {
  name: "Edit Product",
  loc: "/edit_product",
  admin: true,
}, {
  name: "Cart",
  loc: "/user_cart",
}];

pageBtnMap["/add_product/"] = [{
  name: "Dashboard",
  loc: "/home",
}, {
  name: "Edit Product",
  loc: "/edit_product",
  admin: true,
}, {
  name: "Cart",
  loc: "/user_cart",
}];

pageBtnMap["/user_cart/"] = [{
  name: "Dashboard",
  loc: "/home",
}, {
  name: "Add Product",
  loc: "/add_product",
  admin: true,
}, {
  name: "Edit Product",
  loc: "/edit_product",
  admin: true,
}, {
  name: "Checkout",
  loc: "/user_cart",
  // func: checkout,
}];

pageBtnMap["/edit_product/"] = [{
  name: "Dashboard",
  loc: "/home",
}, {
  name: "Add Product",
  loc: "/add_product",
  admin: true,
}, {
  name: "Cart",
  loc: "/user_cart",
  // func: checkout,
}];
pageBtnMap["/change_password/"] = [{
  name: "Dashboard",
  loc: "/home",
}];

function initHeader({ user, admin } = {}) {
  const page = window.location.pathname;

  const btns = pageBtnMap[page];
  for (let i = 0; i < btns.length; i++) {
    const btn = btns[i];
    if (btn.admin && !admin) continue;
    const btnWrapElem = document.getElementById("btn_" + (i + 1) + "_wrap");
    btnWrapElem.classList.remove("hidden");

    const btnElem = document.getElementById("btn_" + (i + 1));
    btnElem.textContent = btn.name;
    btnElem.onclick = btn.func ? btn.func : function () {
      window.location.href = btn.loc;
    };
  }

  const userNameElem = document.getElementById("user_name");
  const logoutBtn = document.getElementById("logout_btn");
  const passBtn = document.getElementById("pass_btn");

  userNameElem.textContent = user;

  logoutBtn.addEventListener("click", () => {
    fetch("/user", { method: "DELETE" })
      .then(() => {
        location.href = "/";
      })
      .catch(console.error);
  });

  passBtn.addEventListener("click", () => {
    location.href = "/change_password";
  });
}

fetch("/user")
  .then((res) => res.json())
  .then(initHeader);

/** ---------------------------------------------------- */
