const form = document.getElementById("pass_form");

const infoElem = document.getElementById("info");

form.addEventListener("submit", (eve) => {
  eve.preventDefault();
  const fd = new FormData(form);
  if(fd.get("new_password") != fd.get("new_password2")){
    infoElem.textContent = "new passwords not matched.";
    return;
  }
  fd.delete("new_password2");
  fetch("/user/password", { method: "POST", body: fd })
    .then((res) => res.json())
    .then((res) => {
      if (!res.success) {
        infoElem.innerHTML = res.message;
      } else {
        infoElem.innerHTML = "password changed successfully.";
        setTimeout(()=>{
          location.href = "/";
        }, 500);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
