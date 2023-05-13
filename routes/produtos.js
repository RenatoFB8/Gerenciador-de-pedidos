const express = require('express')
const router = express.Router()
const db = require("../firebase.js")

async function getProdutos() {
  let data = await db.collection("produtos").get()
  let lista = data.docs.map(doc => doc.data());
  return lista
}
router.get('/', async (req, res) => {
  const produtos = await getProdutos();
  res.render("produtos", {produtos})
})


router.post("/add", (req, res) => {
  let nome = req.body.nome
  let lucro = req.body.lucro
  let ingredientes = {}
  for (let i in req.body) {
    if (req.body[i]!=nome && req.body[i]!=lucro && req.body[i]!="") {
      ingredientes[i] = req.body[i]
    }
  }

  db.collection("produtos").doc(nome).set({
    nome,
    lucro,
    ingredientes
  })
  res.redirect("/produtos")
})

module.exports = router