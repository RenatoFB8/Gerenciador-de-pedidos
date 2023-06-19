
document.querySelectorAll('.addConteudo').forEach(div => {
	div.style.display = 'none'
})
document.querySelectorAll('.ingrediente form, .produto form, .pedido form').forEach(div => {
	div.style.display = 'none'
})


// para receber o aviso do backend
const forms = document.querySelectorAll('form')
forms.forEach(form => {
	form.addEventListener('submit', (event) => {
		event.preventDefault()
		
		const formData = new FormData(form)
		const jsonData = {};

		const radios = form.querySelectorAll('input[type="radio"]');
		let radioSelected
		if (radios.length!=0) {
			radioSelected = false;
		} else {
			radioSelected = true;
		}
		
		for (let i = 0; i < radios.length; i++) {
			if (radios[i].checked) {
				radioSelected = true;
				break;
			}
		}

		if (!radioSelected) {
			alert('Selecione a unidade de medida')
			return
		}


		for (let [key, value] of formData.entries()) {
			if (value.length == 0){
				alert(`Campo ${key} não pode estar vazio`)
				return
			}
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
		
		setTimeout(() => {
			window.location.reload()
			}, 1500)
		
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

let icons = document.querySelectorAll(".ingrediente div img, .produto div img, .pedido div img")
icons.forEach(icon => {
	icon.addEventListener("click", () => {
		let editForm = document.querySelector(`img[nome='${icon.getAttribute("nome")}'] + form[action$="edit"]`)
		let deleteForm = document.querySelector(`img[nome='${icon.getAttribute("nome")}'] + form[action$="delete"]`)
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


let ings = document.querySelectorAll(".selecionarIngredientes");
ings.forEach(ing => {
    fetch("/ingredientes/get")
    .then(res => res.json())
    .then(data => {
        let existingIngredients = Array.from(ing.querySelectorAll("p")).map(p => p.textContent.trim())

        let html = ""

        data.forEach(ingrediente => {
            if (existingIngredients.includes(ingrediente.nome)) {
                return
            }
            html += `<div>
                        <p>${ingrediente.nome}</p>
                        <div>
                            <input type="number" name="${ingrediente.nome}" value="0" valor="${ingrediente.preco}" autocomplete="off">
                            <p class="medidas">${ingrediente.medida}</p>
                        </div>
                    </div>`
        })

        ing.innerHTML += html
    })
})

// Selecionar produtos em pedidos
let produtos = document.querySelectorAll(".selecionarProdutos")
produtos.forEach(prod => {
	fetch("/produtos/get").then(res => res.json())
	.then(data => {
		let existingProdutos = Array.from(prod.querySelectorAll("p")).map(p => p.textContent.trim())

		let html = ""

		data.forEach(produto => {
			if (existingProdutos.includes(produto.nome)) {
                return
            }

			html += `<div>
						<p>${produto.nome}</p>
						<div>
							<input type="number" name="${produto.nome}" value="0" valor="${produto.preco}" autocomplete="off">
							<p>${produto.preco.toFixed(2)}</p>
						</div>
					</div> `
		})
		prod.innerHTML += html
	})
})

const dataInput = document.getElementById('dataInput');

if (dataInput) {
	// Obter a data atual
	const dataAtual = new Date().toISOString().split('T')[0];

	// Definir o atributo 'min' do campo de entrada
	dataInput.setAttribute('min', dataAtual);	
}



function formatarTelefone(input) {
    let telefone = input.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
	let formatadoTelefone
	

	if (telefone.length === 10){
		formatadoTelefone = telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
	}
	else {
    	formatadoTelefone = telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
		
	}
	// Formato (XX) XXXXX-XXXX
    input.value = formatadoTelefone;
  }


// valorPedido de acordo com produtos
let pedidos = document.querySelectorAll(".pedido, .produto, .addConteudo")

pedidos.forEach(pedido => {
	let valorPedido = pedido.querySelector(".valorPedido, .valorProduto")
	pedido.querySelectorAll(".selecionarProdutos, .selecionarIngredientes,  input[name=lucro]").forEach(input => {
		input.addEventListener("input", (e) => {
			if (e.target.tagName === 'INPUT') {
				let valor = 0
				let lucro
				pedido.querySelectorAll(".selecionarProdutos input, .selecionarIngredientes input,  input[name=lucro]").forEach(inputt => {
					if (inputt.getAttribute("name")=="lucro") {
						lucro = inputt.value
					} else {
						let preco = inputt.getAttribute("valor")
						valor += Number(inputt.value) * Number(preco)
					}
				})
				if (lucro) {
					valorPedido.textContent = `Valor: ${(valor + valor * Number(lucro)/100).toFixed(2)}`
				}else {
					console.log("Oi")
					valorPedido.textContent = `Valor: ${valor.toFixed(2)}`
				}
			}
		})
	})
})


