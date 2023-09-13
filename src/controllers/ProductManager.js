import {promises as fs} from 'fs'
import {nanoid} from "nanoid"

class ProductManager {
    constructor(){
        this.path = "./src/models/products.json"
    }
    //Funcion para validar existencia de productos utilizando _readProducts
    _exist = async (id) => {
        let products = await this._readProducts()
        return products.find(prod => prod.id === id)
    }
    //Se obtienen los productos desde path
    _readProducts = async () => {
        let products = await fs.readFile(this.path, "utf-8")
        return JSON.parse(products)
    }
    //Se agrega el producto en archivo JSON
    _writeProducts = async (product) => {
        await fs.writeFile(this.path, JSON.stringify(product, null, 2))
    }
    //Se agregan los productos junto al id con nanoid()
    addProducts = async (product) => {
        let productsAct = await this._readProducts()
        product.id = nanoid()
        let productAll = [...productsAct, product]
        await this._writeProducts(productAll)
        return "Product Added"
    }
    //Se actualizan los productos mandando el id del producto a actualizar y los nuevos datos a guardar
    updProducts = async (id, product) => {
        //Se valida producto si existe
        let prodId = await this._exist(id)
        if(!prodId) return "Product Not Found"
        //Se elimina producto por id
        await this.delProducts(id)
        let productAct = await this._readProducts()
        //Se agrega nuevo producto indicando el id que va a tener por parametros
        let products = [{...product, id : id}, ...productAct]
        //console.log([{...product, id : id}, ...productAct]) se valida contenido para el producto a actualizar
        await this._writeProducts(products)
        return "Product Updated"
    }
    //Se obtienen los productos desde _readProducts
    getProducts = async () => {
        return await this._readProducts()
    }
    //Se obtienen los productos segun id, entregando el id por parametros
    getProdById = async (id) => {
        let prodId = await this._exist(id)
        if(!prodId) return "Product Not Found"
        return prodId
    }
    //Se elimina producto de id que enviamos por parametro
    delProducts = async (id) => {
        let products = await this._readProducts()
        //Se valida si existe producto con some para validar con un true o false y tomar acciones dependiendo del caso
        let existProd = products.some(prod => prod.id === id)
        if(existProd){
            let filterProducts = products.filter(prod => prod.id != id)
            await this._writeProducts(filterProducts)
            return "Product Deleted"
        }
        return "Product Id Not Found"      
    }
}

export default ProductManager