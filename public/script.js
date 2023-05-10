document.querySelectorAll('.addConteudo').forEach(div => {
	div.style.display = 'none'
})
document.querySelectorAll('.ingrediente form').forEach(div => {
	div.style.display = 'none'
})

const forms = document.querySelectorAll('.add')

forms.forEach(form => {
	form.addEventListener('submit', (event) => {
		event.preventDefault()
	
		const formData = new FormData(form)
		const jsonData = {};
	
		for (let [key, value] of formData.entries()) {
			jsonData[key] = value;
		}
		
		fetch(form.getAttribute("action"), {
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
		window.location.reload();
	})
})


// evento no botao adicionar 
let buttonsForm = document.querySelectorAll(".pageHeader > button")

buttonsForm.forEach(button => {
	button.addEventListener("click", () => {
		let divs = document.querySelectorAll('.addConteudo')
		let efect = document.querySelector('.opacidade')

		efect.addEventListener("click", () => {
			divs.forEach(div => {
				div.style.display = 'none'
			})
			efect.style.display = 'none'
		})
		divs.forEach(div => {
			div.style.display = 'flex'
		})
		efect.style.display = 'block'
	})
})


// evento ingrediente edit e delete

let icons = document.querySelectorAll(".ingrediente div img")
icons.forEach(icon => {
	icon.addEventListener("click", () => {
		let editForm = document.querySelector(`img[nome='${icon.getAttribute("nome")}'] + form[action="/ingredientes/edit"]`)
		let deleteForm = document.querySelector(`img[nome='${icon.getAttribute("nome")}'] + form[action="/ingredientes/delete"]`)
		let efect = document.querySelector('.opacidade')

		// clicar fora da tela fecha o form
		efect.addEventListener("click", () => {
			editForm.style.display = 'none'
			deleteForm.style.display = 'none'
			efect.style.display = 'none'
		})

		efect.style.display = 'block'
		
		// botão de delete fecha o form
		deleteForm.querySelector("button").addEventListener("click", (e) => {
			e.preventDefault()
			editForm.style.display = 'none'
			deleteForm.style.display = 'none'
			efect.style.display = 'none'
		})

		if (icon.getAttribute("alt")=="editar") {
			editForm.style.display = "flex"
		} else {
			deleteForm.style.display = "flex"
		}

	})
})

/* <li>
                    <label>
                      <input type="checkbox" name="ingredientes[]" value="<%= ingredientes.id %>">
                      <%= ingredientes[i].nome %>
                    </label>
                    <input type="number" name="pesos[]" step="0.01" min="0">
                    g
                  </li> */
let ings = document.querySelector(".selecionarIngredientes")
fetch("/ingredientes/get").then(res => res.json())
	.then(data => {
		let html = ""
		data.forEach(ingrediente => {
			html += `<div>
						<label>
							<input type="checkbox" name="ingredientes[]" value="${ingrediente.nome}">
							${ingrediente.nome}
						</label>
						<div>
							<input type="number" name="pesos[]" step="0.01" min="0">
							${ingrediente.medida}
						</div>
					</div> `
		})
		ings.innerHTML = html
	}
)

