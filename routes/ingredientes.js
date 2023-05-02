const express = require('express')
const router = express.Router()
const db = require("../firebase.js")

router.get('/', (req, res) => {
  db.collection("ingredientes").get()
    .then(ingredientes => {
      let lista = []
      ingredientes.forEach(ingrediente => {
        lista.push(ingrediente.data())
      })
      res.render("ingredientes", {ingredientes:lista})
    })
})

router.post("/add", (req, res) => {
  let nome = req.body.nome
  let valor = Number(req.body.valor)
  db.collection('ingredientes').doc(nome).set({nome, valor});

  res.redirect("/ingredientes")
})

router.post("/edit", (req, res) => {
  let nomeAntigo = req.body.nomeAntigo
  let nomeNovo = req.body.nomeNovo
  let valorAntigo = req.body.valorAntigo
  let valorNovo = req.body.valorNovo
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