
const popup = document.querySelector(".popup");
let deleteId; 
const handleClick = (e) => {

  deleteId = e.target.getAttribute("data-delete-id");
   
  popup.classList.add("active")
  
  document.querySelector("#book-name").textContent = e.target.getAttribute("data-delete-name");
}

document.querySelectorAll(".delete").forEach(item => {
  item.addEventListener("click", handleClick)
})

document.querySelector(".cancel-popup").addEventListener("click", e => {
  popup.classList.remove("active");
})

document.querySelector(".delete-event").addEventListener("click", e => {
  window.location.href = `/delete/${deleteId}`;
})