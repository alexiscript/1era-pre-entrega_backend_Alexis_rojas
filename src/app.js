const express = require("express");

const { router: productRouter} = require("./api/products/products.router");
const cartsRoutes = require("./api/carts/carts.router");

app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Rutas
app.use('/api/products', productRouter);
app.use('/api/cart', cartsRoutes);

// Endpoint para traer todos los productos o la cantidad indicada por query

app.listen(8080, () => {
    console.log(`App listening at 8080 `); // eslint-disable-line no-console
});
