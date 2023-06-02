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
  let quantidade = req.body.quantidade
  let medida = req.body.medida

  let preco = valor/quantidade

  if(isNaN(preco) == false){
    preco = Number(preco)

    db.collection('ingredientes').doc(nome).set({nome, valor, quantidade, preco, medida})
    .then(() => {
      res.redirect("/ingredientes")
    })

  } else {
    let aviso = "O valor digitado não é um número"
    res.json({aviso})
  }
})

router.post("/edit", (req, res) => {
  let nomeAntigo = req.body.nomeAntigo
  let nome = req.body.nome
  let valor = Number(req.body.valor.replace(',','.'))
  let quant = req.body.quantidade
  let medida = req.body.medida

  let preco = valor/quant

  db.collection("ingredientes").doc(nomeAntigo).get()
    .then(data => {
      db.collection("ingredientes").doc(nomeAntigo).delete()
      .then(() => {
        db.collection("ingredientes").doc(nome).set({nome, valor, quant, preco, medida})
        .then(() => {
          res.redirect("/ingredientes")
        })
      })
      
    })

})

router.post("/delete", (req, res) => {
  let nome = req.body.nome
  db.collection("ingredientes").doc(nome).delete()
  .then(() => {
    res.redirect("/ingredientes")
  })

})
module.exports = router