// importações
const express = require("express")
const path = require('path')
const app = express()
const PORT = 3000

// pegando os arquivos do diretório routes
const ingredientes = require("./routes/ingredientes")
const pedidos = require("./routes/pedidos")
const produtos = require("./routes/produtos")

// definindo view engine e a pasta das views
app.set('view engine', 'ejs')
app.set('views', './views')

// definindo diretório de arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// definindo as rotas
app.use("/", pedidos)
app.use("/ingredientes", ingredientes)
app.use("/pedidos", pedidos)
app.use("/produtos", produtos)

app.listen(PORT, ()=>{
    console.log(`Servidor rondando na porta ${PORT}`)
})