import express from "express"
import prodRouter from "./router/product.routes.js"
import cartRouter from "./router/cart.routes.js"


const app = express()
//Se define puerto 8080 para ejecutar la aplicacion
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use("/api/products", prodRouter)
app.use("/api/carts", cartRouter)

app.listen(PORT, () => {
    console.log(`Servidor Express Puerto ${PORT}`)
})