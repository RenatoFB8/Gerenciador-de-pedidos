const express = require('express')
const router = express.Router()
const db = require("../firebase.js")

async function getIngredientes() {
  let data = await db.collection("ingredientes").get()
  let lista = data.docs.map(doc => doc.data());
  return lista
}
router.get('/', async (req, res) => {
  const ingredientes = await getIngredientes();
  res.render("ingredientes", {ingredientes})
})

router.get("/get", async (req, res) => {
  res.send(await getIngredientes())
})

router.post("/add", (req, res) => {
  let nome = req.body.nome
  let valor = req.body.valor.replace(',','.')
  let quant = req.body.quantidade
  let medida = req.body.medida

  let preco = valor/quant
  if(isNaN(preco) == false){
    preco = Number(preco).toFixed(2)

    db.collection('ingredientes').doc(nome).set({nome, preco, medida})
    res.redirect("/ingredientes")
  } else {
    let aviso = "O valor digitado não é um número"
    res.json({aviso})
  }
})

router.post("/edit", (req, res) => {
  let nomeAntigo = req.body.nomeAntigo
  let nomeNovo = req.body.nomeNovo
  let valorAntigo = Number(req.body.valorAntigo)
  let valorNovo = Number(req.body.valorNovo)
  if (nomeNovo==""){
     nomeNovo = nomeAntigo
  }
  if (valorNovo==""){
    valorNovo = valorAntigo
  }
  db.collection("ingredientes").doc(nomeAntigo).get()
    .then(data => {
      db.collection("ingredientes").doc(nomeNovo).set({nome:nomeNovo, valor:valorNovo})
      db.collection("ingredientes").doc(nomeAntigo).delete()
    })
  res.redirect("/ingredientes")
})

router.post("/delete", (req, res) => {
  let nome = req.body.nome
  db.collection("ingredientes").doc(nome).delete()
  res.redirect("/ingredientes")
})
module.exports = router