const { Router } = require('express');
const ProductManager = require("../../ProductManager");
const db = new ProductManager("productos.json");

const router = Router();

router.get("/", async (req, res) => {
    try {
        const { limit } = req.query;
        let arrProduct = await db.getProducts();
        if (limit) arrProduct = arrProduct.slice(0, limit);
        res.status(200).json({ result: arrProduct });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.get("/:pid", async (req, res) => {
    const { pid } = req.params;
    if (pid) {
        try {
            let arrProduct = await db.getProductById(pid);
            res.status(200).json({ result: arrProduct });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    } else {
        res.status(400).json({ error: "Debe enviar un id de producto por params" });
    }
});

router.post("/", async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    if (
        title !== undefined &&
        description !== undefined &&
        code !== undefined &&
        price !== undefined &&
        status !== undefined &&
        stock !== undefined &&
        category !== undefined
    ) {
        try {
            let titleValidated = title.toString();
            let descriptionValidated = description.toString();
            let codeValidated = code.toString();
            let priceValidated = parseFloat(price);
            let statusValidated = Boolean(status);
            let stockValidated = parseInt(stock);
            let categoryValidated = category.toString();
            let thumbnailsValidated = thumbnails;

            if (thumbnails && Array.isArray(thumbnails)) {
                for (let i = 0; i < thumbnails.length; i++) {
                    thumbnailsValidated[i] = thumbnails[i].toString();
                }
            }

            let arrProduct = await db.addProduct(
                titleValidated,
                descriptionValidated,
                codeValidated,
                priceValidated,
                statusValidated,
                stockValidated,
                categoryValidated,
                thumbnailsValidated
            );

            res.status(200).json({ result: arrProduct });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    } else {
        res.status(400).json({ error: "Faltan campos obligatorios" });
    }
});


router.put("/:pid", async (req, res) => {
    const { pid } = req.params
    let objeChanges = { ...req.body }
    delete objeChanges.id;
    const keysArr = Object.keys(objeChanges)

    if (pid && keysArr.length > 0) {
        try {

            if (objeChanges.title) objeChanges.title = objeChanges.title.toString()
            if (objeChanges.description) objeChanges.description = objeChanges.description.toString()
            if (objeChanges.code) objeChanges.code = objeChanges.code.toString()
            if (objeChanges.price) objeChanges.price = parseFloat(objeChanges.price)
            if (objeChanges.status) objeChanges.status = Boolean(objeChanges.status)
            if (objeChanges.stock) objeChanges.stock = parseInt(objeChanges.stock)
            if (objeChanges.category) objeChanges.category = objeChanges.category.toString()
            if (objeChanges.category) objeChanges.category = objeChanges.category.toString()
            if (objeChanges.thumbnails) {
                if (Array.isArray(objeChanges.thumbnails)) {
                    for (let i = 0; i < objeChanges.thumbnails.length; i++) {
                        objeChanges.thumbnails[i] = objeChanges.thumbnails[i].toString();

                    }
                }
            }


            let arrProduct = await db.updateProduct(pid, objeChanges)
            res.status(200).json({ result: arrProduct })
        } catch (e) {
            res.status(500).json({ error: e })
        }
    } else res.status(400).json({ error: "Debe enviar un id de producto por params y los campos a modificar por body" })

})

router.delete("/:pid", async (req, res) => {
    const { pid } = req.params


    if (pid) {
        try {
            let arrProduct = await db.deleteProduct(parseInt(pid))
            res.status(200).json({ result: arrProduct })
        } catch (e) {
            res.status(500).json({ error: e })
        }
    } else res.status(400).json({ error: "Debe enviar un id de producto por params" })

})

const productIdFinder= db.getProductById

module.exports = {
    router,
    productIdFinder
    
}
