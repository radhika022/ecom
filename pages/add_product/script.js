const addForm = document.getElementById("add_form");
const infoElem = document.getElementById("info");

addForm.onsubmit = function (eve) {
  eve.preventDefault();
  const fd = new FormData(addForm);

  fetch("/products", {
    method: "POST",
    body: fd,
  })
    .then((res) => res.json())
    .then((res) => {
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
