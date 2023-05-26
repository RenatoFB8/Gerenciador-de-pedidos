const express = require('express')
const router = express.Router()
const db = require("../firebase.js")

async function getPedidos() {
  let data = await db.collection("pedidos").get()
  let lista = data.docs.map(doc => doc.data());
  return lista
}
router.get('/', async (req, res) => {
  const pedidos = await getPedidos();
  res.render("pedidos", {pedidos})
})


router.post("/add", (req, res) => {
  let cliente = req.body.cliente
  let telefone = req.body.telefone
  let data = String(req.body.data)
  let produtos = {}
  for (let i in req.body) {
    if (req.body[i]!=cliente && req.body[i]!=telefone && req.body[i]!="" && req.body[i]!=data) {
      produtos[i] = req.body[i]
    }
  }
  db.collection("pedidos").doc(cliente).set({cliente, telefone, data, produtos})
  res.redirect("/pedidos")
})

router.get("/edit", (req, res) => {
  let nome = req.body.nome

  db.collection('produtos').doc(nome).get()
  .then(doc => {
    res.send(doc.data())
  })
  res.end()
})

router.post("/edit", (req, res) => {
  let cliente = req.body.cliente
  let telefone = req.body.telefone
  let data = req.body.data
  let produtos = req.body.produtos

  db.collection("produtos").doc(req.body.nomeAntigo).get()
  .then(data => {
    db.collection("produtos").doc(cliente).delete()
    db.collection("produtos").doc(cliente).set({cliente, telefone, data, produtos})
  })
  res.redirect("/produtos")   
})

router.post("/delete", (req, res) => {
  let cliente = req.body.cliente
  db.collection("produtos").doc(cliente).delete()
  res.redirect("/produtos")
})

module.exports = router