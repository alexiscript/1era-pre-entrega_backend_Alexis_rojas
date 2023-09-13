const { Router } = require('express');
const CartManager = require("../../CartManager");
const ProductManager = require("../../ProductManager"); // Asegúrate de que la ruta sea correcta

const router = Router();
const cartDb = new CartManager("carrito.json");
const productDb = new ProductManager("productos.json"); // Asegúrate de que la ruta del archivo JSON sea correcta

router.post("/", async (req, res) => {
    const { products } = req.body;
    let arrParam;

    try {
        if (Array.isArray(products)) arrParam = products;

        let cart = await cartDb.createCart(arrParam);
        res.status(200).json({ result: cart });
    } catch (e) {
        res.status(500).json({ err: e.message });
    }
});

router.get("/:cid", async (req, res) => {
    const { cid } = req.params;

    if (cid) {
        try {
            let arrProduct = await cartDb.getCartById(parseInt(cid));
            res.status(200).json({ result: arrProduct });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    } else {
        res.status(400).json({ error: "Cid is empty" });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;

    if (cid && pid) {
        try {
            let cartFinder = await cartDb.getCartById(parseInt(cid));

            if (!Array.isArray(cartFinder)) {
                res.status(500).json({ error: "Cart Id doesn't exist" });
                return;
            }

            let productFinder = await productDb.getProductById(pid);

            if (productFinder.Error) {
                res.status(500).json({ error: "Can't find a product with that id" });
                return;
            }

            let product = {
                product: productFinder,
                quantity: 1,
            };

            let finalArr;
            let cartIndex = -1;

            // Buscar si el producto ya está en el carrito
            for (let i = 0; i < cartFinder.length; i++) {
                if (cartFinder[i].product.id === parseInt(pid)) {
                    cartIndex = i;
                    break;
                }
            }

            if (cartIndex !== -1) {
                // El producto ya está en el carrito, aumentar la cantidad
                cartFinder[cartIndex].quantity += 1;
                finalArr = [...cartFinder];
            } else {
                // El producto no está en el carrito, agregarlo
                finalArr = [...cartFinder, product];
            }

            let result = await cartDb.updateCart(parseInt(cid), finalArr);
            res.status(200).json({ result: result });
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: e.message });
        }
    } else {
        res.status(400).json({ error: "Cid and Pid must be provided" });
    }
});

module.exports = router;
