import { Router } from "express"
import ProductManager from "../controllers/ProductManager.js"

const prodRouter = Router()
const product = new ProductManager()

//Actualizamos los productos http://localhost:8080/api/products/ con put mandando todos los datos menos el id
prodRouter.put("/:id", async (req,res) => {
    let id = req.params.id
    let updProd = req.body
    res.send(await product.updProducts(id, updProd))
})
//Traemos los productos por el id http://localhost:8080/api/products/idproducto con get
prodRouter.get("/:id", async (req, res) => {
    let id = req.params.id
    res.send(await product.getProdById(id))
})
//Traemos todos los productos http://localhost:8080/api/products/ con get
prodRouter.get("/", async (req, res) => {
    res.send(await product.getProducts())
})
//Eliminamos los productos por id http://localhost:8080/api/products/idproducto con delete
prodRouter.delete("/:id", async (req, res) => {
    let id = req.params.id
    res.send(await product.delProducts(id))
})
//Se agregan los productos entregando un json
prodRouter.post("/", async (req, res) => {
    let newProduct = req.body
    if (
        !newProduct.name ||
        !newProduct.description ||
        !newProduct.code ||
        !newProduct.price ||
        !newProduct.stock ||
        !newProduct.category) {
        return res.status(400).json({ error: 'Debe proporcionar todos los campos: name, description, code, price, stock, category, thumbnail (opcional).' });
    }
    res.send(await product.addProducts(newProduct))
})

export default prodRouter