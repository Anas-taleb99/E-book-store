
// delete popup
const popup = document.querySelector(".popup");

// buy popup
const buyPopup = document.querySelector(".popup-buy");

// global delete clicked element id
let deleteId; 

// global buy clicked element id
let buyId;

// get the user id in purchase event
let userId;

// after press delete on the popup this function triggered
const handleClick = (e) => {

  deleteId = e.target.getAttribute("data-delete-id");
   
  popup.classList.add("active")
  
  document.querySelector("#book-name").textContent = e.target.getAttribute("data-delete-name");
}

document.querySelectorAll(".delete").forEach(item => {
  item.addEventListener("click", handleClick)
})

document.querySelectorAll(".cancel-popup").forEach(item => {
  item.addEventListener("click", e => {
    popup.classList.remove("active");
    buyPopup.classList.remove("active");
  })
})

document.querySelector(".delete-event").addEventListener("click", e => {
  window.location.href = `/delete/${deleteId}`;
})

const handleBuy = e => {
  buyId = e.target.getAttribute("data-buy-id");
  
  userId = e.target.getAttribute("data-user");

  buyPopup.classList.add("active")
  
  document.querySelector("#buy-book-name").textContent = e.target.getAttribute("data-buy-name");
}

document.querySelectorAll(".buy").forEach(item => {
  item.addEventListener("click", handleBuy)
})

document.querySelector(".buy-event").addEventListener("click", e => {
  window.location.href = `/buy/${userId}/${buyId}`;
})