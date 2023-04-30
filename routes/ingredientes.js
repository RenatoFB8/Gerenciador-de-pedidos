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
      console.log(lista)
    res.send(lista)
    })
})

router.post("/add", (req, res) => {
  let nome = "chocolate"
  let valor = 1000
  db.collection('ingredientes').doc(nome).set({nome, valor});

  res.end()
})
router.put("/update", (req, res) => {
  let nomeAntigo = "chocolate"
  let nomeNovo = "maçã"
  let valorAntigo = 2000
  let valorNovo = 100000
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
  res.end()
})
router.delete("/delete", (req, res) => {
  let nome = "maçã"
  db.collection("ingredientes").doc(nome).delete()
  res.end()
})
module.exports = router