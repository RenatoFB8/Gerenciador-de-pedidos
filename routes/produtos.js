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
  let nome = req.body.nome;
  let lucro = req.body.lucro;
  let ingredientes = {};
  let ingredientesPromises = [];

  for (let i in req.body) {
    if (req.body[i] != nome && req.body[i] != lucro && req.body[i] != "") {
      const promise = db.collection("ingredientes").doc(i).get()
        .then(doc => {
          if (doc.exists) {
            const preco = Number(doc.data().preco);
            ingredientes[i] = [req.body[i], Number(req.body[i]) * preco];
          }
        });

      ingredientesPromises.push(promise);
    }
  }

  await Promise.all(ingredientesPromises);
  
  let preco = Object.values(ingredientes).reduce((acc, ingredientes) => acc + ingredientes[1], 0);

  db.collection("produtos").doc(nome).set({ nome, lucro, ingredientes, preco});
  res.redirect("/produtos");
});


router.get("/edit", (req, res) => {
  let nome = req.body.nome

  db.collection('produtos').doc(nome).get()
  .then(doc => {
    res.send(doc.data())
  })
  res.end()
})

router.post("/edit", (req, res) => {
  db.collection("produtos").doc(req.body.nomeAntigo).get()
  .then(data => {
    db.collection("produtos").doc(req.body.nomeNovo).set({nome:req.body.nomeNovo, lucro:req.body.lucro, ingredientes:req.body.ingredientes})
    db.collection("produtos").doc(req.body.nomeAntigo).delete()
  })
  res.redirect("/produtos")   
})

router.post("/delete", (req, res) => {
  let nome = req.body.nome
  db.collection("produtos").doc(nome).delete()
  res.redirect("/produtos")
})

module.exports = router