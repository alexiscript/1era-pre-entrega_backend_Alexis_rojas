import {promises as fs} from 'fs'
import {nanoid} from "nanoid"
import ProductManager from './ProductManager.js'


const prodAll = new ProductManager()

class CartManager {
    constructor(){
        this.path = "./src/models/carts.json"
    }
    
    _exist = async (id) => {
        let carts = await this._readCarts()
        return carts.find(cart => cart.id === id)
    }
    //Se obtienen los carros desde path
    _readCarts = async () => {
        let carts = await fs.readFile(this.path, "utf-8")
        return JSON.parse(carts)
    }
    //Se agrega el carro en archivo JSON
    _writeCarts = async (cart) => {
        await fs.writeFile(this.path, JSON.stringify(cart))
    }
    //Se obtienen los carros desde _readCarts
    getCarts = async () => {
        return await this._readCarts()
    }
    //Se agrega el carro junto al id con nanoid()
    addCarts = async () => {
        let cartsAct = await this._readCarts()
        let id = nanoid()
        let cartsConcat = [{id:id, products : []}, ...cartsAct]
        await this._writeCarts(cartsConcat)
        return "Cart Added"
    }
    //Se obtiene carro por id
    getCartById = async (id) => {
        let cartId = await this._exist(id)
        if(!cartId) return "Cart Not Found"
        return cartId
    }
    //Se agrega producto en el carro
    addProductInCart = async (cartId, prodId) => {
        //Se valida la existencia del id del carro y del producto
        let carttId = await this._exist(cartId)
        if(!carttId) return "Cart Not Found"
        let proddId = await prodAll._exist(prodId)
        if(!proddId) return "Prod Not Found"
        //-----------------------------------------------------------------------//
        let cartsAll = await this.getCarts()
        let cartFilter = cartsAll.filter((cart) => cart.id != cartId)
        if(carttId.products.some((prod) => prod.id === prodId)){
            let moreProd  = carttId.products.find((prod) => prod.id === prodId)
            moreProd .quantity++
            let cartsConcat = [carttId, ...cartFilter]
            await this._writeCarts(cartsConcat)
            return "Product Added in Cart"
        }
        //-----------------------------------------------------------------------//
        carttId.products.push({id:prodId, quantity: 1})
        let cartsConcat = [ carttId, ...cartFilter]
        await this._writeCarts(cartsConcat)
        return "Product in Cart"
    }
}

export default CartManager