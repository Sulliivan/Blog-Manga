/* NavBar */ 

document.addEventListener('DOMContentLoaded', nav)
function nav() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.main-nav');
    burger.addEventListener('click', () => {
        nav.classList.toggle('show')
    })
}

/* Modal Function INDEX EJS*/

function openmodal(manga){
    const Manga = JSON.parse(manga)
    const description = document.getElementById('modalDescription')
    description.innerHTML = Manga.content
    console.log(manga);
    $('#openmodal').modal('show')
  }



/* Search BAR */
  
  function myFunction() {
    var input = document.getElementById("Search");
    var filter = input.value.toLowerCase();
    var nodes = document.getElementsByClassName('carte');
  
    for (i = 0; i < nodes.length; i++) {
      if (nodes[i].innerText.toLowerCase().includes(filter)) {
        nodes[i].style.display = "block";
      } else {
        nodes[i].style.display = "none";
      }
    }
  }