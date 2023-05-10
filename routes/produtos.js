const express = require('express')
const router = express.Router()
const db = require("../firebase.js")


router.get('/', (req, res) => {
  res.render("produtos")
})

router.post("/add", (req, res) => {
  let produto = req.body.produto
  let lucro = req.body.lucro
  let ingrediente = 

  db.collection("produtos").add({
    produto: produto,
    lucro: lucro
  })
  
})

module.exports = router