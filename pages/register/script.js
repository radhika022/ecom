const form = document.getElementById("reg_form");

const infoElem = document.getElementById("info");

form.addEventListener("submit", (eve) => {
  eve.preventDefault();
  const fd = new FormData(form);
  const password = fd.get("password");
  const password2 = fd.get("password2");
  fd.delete("password2");

  if (password2 != password) {
    infoElem.innerHTML = "password not matched!!";
    return;
  } else {
    fetch("/user/create", { method: "POST", body: fd })
      .then(res=>res.json())
      .then(res=>{
        if(res.errors && res.errors.length > 0){
          infoElem.innerHTML = res.errors.join(",");
        }else{
          infoElem.innerHTML = "Registred successfully.";
          form.reset();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
});
