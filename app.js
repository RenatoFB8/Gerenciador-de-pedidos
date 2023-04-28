const express = require("express")
const app = express()
const PORT = 3000
const index = require("./routes/index")
const ingredientes = require("./routes/ingredientes")
const pedidos = require("./routes/pedidos")
const produtos = require("./routes/produtos")

app.set('view engine', 'ejs');
app.set('views', './views');

app.use("/", index)
app.use("/ingredientes", ingredientes)
app.use("/pedidos", pedidos)
app.use("/produtos", produtos)

app.listen(PORT, ()=>{
    console.log(`Servidor rondando na porta ${PORT}`)
})