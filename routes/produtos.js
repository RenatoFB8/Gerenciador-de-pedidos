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

router.get("/get", async (req, res) => {
  res.send(await getProdutos())
})

router.post("/add", async (req, res) => {
  let nome = req.body.nome
  let lucro = req.body.lucro
  let ingredientes = {}
  let ingredientesPromises = []

  for (let i in req.body) {
    if (i!="nome" && i!="lucro" && req.body[i]!="") {
      const promise = db.collection("ingredientes").doc(i).get()
        .then(doc => {
          if (doc.exists) {
            const preco = Number(doc.data().preco)
            ingredientes[i] = [req.body[i], Number(req.body[i]) * preco, doc.data().medida]
          }
        })
      ingredientesPromises.push(promise)
    }
  }

  await Promise.all(ingredientesPromises)

  let preco = Object.values(ingredientes).reduce((acc, ingredientes) => acc + ingredientes[1], 0)
  let precoFinal = preco + preco * Number(lucro)/100

  db.collection("produtos").doc(nome).set({ nome, lucro, ingredientes, preco:precoFinal})
  res.redirect("/produtos")
})

router.post("/edit", async (req, res) => {
  let nomeAntigo = req.body.nomeAntigo
  let nome = req.body.nome
  let lucro = req.body.lucro
  let ingredientes = {} 
  let ingredientesPromises = []

  for (let i in req.body) {
    if (i!="nome" && i!="nomeAntigo" && i!="lucro" && req.body[i]!="") {
      const promise = db.collection("ingredientes").doc(i).get()
        .then(doc => {
          if (doc.exists) {
            const preco = Number(doc.data().preco)
            ingredientes[i] = [req.body[i], Number(req.body[i]) * preco, doc.data().medida]
          }
        })
      ingredientesPromises.push(promise)
    }
  }

  await Promise.all(ingredientesPromises)

  let preco = Object.values(ingredientes).reduce((acc, ingredientes) => acc + ingredientes[1], 0)
  let precoFinal = preco + preco * Number(lucro)/100

  db.collection("produtos").doc(nomeAntigo).get()
  .then(data => {
    if (data.exists) {
      db.collection("produtos").doc(nomeAntigo).delete()
        .then(() => {
          db.collection("produtos").doc(nome).set({ nome, lucro, ingredientes, preco:precoFinal })
            .then(() => {
              res.redirect("/produtos");
            })
        })
    }
  })

})

router.post("/delete", (req, res) => {
  let nome = req.body.nome
  db.collection("produtos").doc(nome).delete()
  res.redirect("/produtos")
})

module.exports = router