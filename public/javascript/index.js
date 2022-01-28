

for (var i = 0; i < 4; i++) {
  document.querySelectorAll("i")[i].addEventListener("click",(event)=>{
    event.path[0].classList.toggle("img-rotate")
event.path[1].nextElementSibling.classList.toggle("answer");
  });

}
