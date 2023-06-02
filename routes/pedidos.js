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


router.post("/add", async (req, res) => {
  let cliente = req.body.cliente
  let telefone = req.body.telefone
  let data = req.body.data
  
  let produtos = {} 
  let produtosPromises = []

  for (let i in req.body) {
    if (i!="cliente" && i!="telefone" && i!="data" && req.body[i]!="") {
      const promise = db.collection("produtos").doc(i).get()
        .then(doc => {
          if (doc.exists) {
            const preco = Number(doc.data().preco)
            produtos[i] = [req.body[i], Number(req.body[i]) * preco]
          }
        })
      produtosPromises.push(promise)
    }
  }

  await Promise.all(produtosPromises)
  let valor = Object.values(produtos).reduce((acc, produtos) => acc + produtos[1], 0)

  db.collection("pedidos").doc(cliente).set({cliente, telefone, data, produtos, valor})
  res.redirect("/pedidos")
})

router.post("/edit", async (req, res) => {
  let nomeAntigo = req.body.nomeAntigo
  let cliente = req.body.cliente
  let telefone = req.body.telefone
  let data = req.body.data

  let produtos = {}
  let produtosPromises = []

  for (let i in req.body) {
    if (i!="cliente" && i!="telefone" && i!="data" && req.body[i]!="") {
      const promise = db.collection("produtos").doc(i).get()
        .then(doc => {
          if (doc.exists) {
            const preco = Number(doc.data().preco)
            produtos[i] = [req.body[i], Number(req.body[i]) * preco]
          }
        })
      produtosPromises.push(promise)
    }
  }

  await Promise.all(produtosPromises)
  let valor = Object.values(produtos).reduce((acc, produtos) => acc + produtos[1], 0)

  db.collection("pedidos").doc(nomeAntigo).get()
  .then(d => {
    if (d.exists) {
      db.collection("pedidos").doc(nomeAntigo).delete()
        .then(() => {
          db.collection("pedidos").doc(cliente).set({cliente, telefone, data, produtos, valor})
            .then(() => {
              res.redirect("/pedidos")
            })
        })
    }
  })

})

router.post("/delete", (req, res) => {
  let cliente = req.body.nome

  db.collection("pedidos").doc(cliente).delete()
  res.redirect("/pedidos")
})

module.exports = router