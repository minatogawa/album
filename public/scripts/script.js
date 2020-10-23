// alert("Estamos aqui!")

const postHead = document.querySelector('.postHead')
const el = document.querySelector('.hide')

postHead.addEventListener("mouseenter", function(){
    fadeIn(el)
    console.log("entrou")
})

postHead.addEventListener("mouseout", function(){
    fadeOut(el)
    console.log("saiu")
})

function fadeOut(el){
    el.style.opacity = 1;
  
    (function fade() {
      if ((el.style.opacity -= .1) < 0) {
        el.style.display = "none";
      } else {
        requestAnimationFrame(fade);
      }
    })();
  };
  
function fadeIn(el){
    el.style.opacity = 0;
    el.style.display = "block";

    (function fade() {
        var val = parseFloat(el.style.opacity);
        if (!((val += .1) > 1)) {
        el.style.opacity = val;
        requestAnimationFrame(fade);
        }
    })();
};