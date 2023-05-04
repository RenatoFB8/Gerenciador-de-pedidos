const form = document.querySelector('#add-ingrediente')

form.addEventListener('submit', (event) => {
  event.preventDefault()

  const formData = new FormData(form)
  const jsonData = {};

  for (let [key, value] of formData.entries()) {
    jsonData[key] = value;
  }
  fetch('/ingredientes/add', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(jsonData)
  })
  .then(res => res.text())
  .then(data => {
    try {
        let obj = JSON.parse(data)
        alert(obj.aviso)
    } catch {
        return
    }
  })
  .catch(error => {
    console.error(error);
  })
  window.location.reload();
})

// evento no botao adicionar 
let button = document.querySelector(".ingHeader > button")


    button.addEventListener("click", () => {
        let div = document.querySelector('.addIngredientes')
        let efect = document.querySelector('.opacidade')

        // let exitButton = document.querySelector(div [skill="${button.textContent}"] .exit-button)

        // exitButton.addEventListener("click", ()=>{
        //     div.classList.add("div-hide")
        //     div.classList.remove("div-show")
        // })

       div.style.display='flex'
      efect.style.display='block'
    })

