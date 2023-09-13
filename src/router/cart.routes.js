import { Router } from "express"
import CartManager from "../controllers/CartManager.js"

const cartRouter = Router()
const carts = new CartManager()

//Se agrega producto http://localhost:8080/api/carts con post donde nos ingresa un id y un producto con arreglo vacio
cartRouter.post("/", async (req,res) =>{
    res.send(await carts.addCarts())
})
//Traemos todos los carritos con http://localhost:8080/api/carts con get
cartRouter.get("/", async (req,res)=>{
    res.send(await carts.getCarts())
})
//Traemos el carro por id con http://localhost:8080/api/carts/idCarts con get
cartRouter.get("/:id", async (req,res)=>{
    res.send(await carts.getCartById(req.params.id))
})

//Ingresamos el producto al carrito con el siguiente formato http://localhost:8080/api/carts/idCarts/products/idProd con post
cartRouter.post("/:cid/products/:pid", async (req,res) => {
    let cartId = req.params.cid
    let prodId = req.params.pid
    res.send(await carts.addProductInCart(cartId, prodId))
})

export default cartRouter