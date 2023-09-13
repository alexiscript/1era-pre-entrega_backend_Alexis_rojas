const fs = require("fs");

class CartManager {
    constructor(path) {
        this.path = path;
    }

    createCart = async (arr) => {
        let carts = await this.getCarts();
        if (Array.isArray(carts)) {
            let cart = {
                id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
                products: arr ? arr : [],
            };

            carts.push(cart);

            try {
                await fs.promises.writeFile(this.path, JSON.stringify(carts));
                return cart;
            } catch (error) {
                return error;
            }
        } else {
            let msgE = "Error accessing db";
            return msgE;
        }
    };

    getCarts = async () => {
        if (fs.existsSync(this.path)) {
            try {
                const data = await fs.promises.readFile(this.path, "utf-8");
                return JSON.parse(data);
            } catch (error) {
                console.log(error);
                return error;
            }
        } else return [];
    };

    getCartById = async (id) => {
        let carts = await this.getCarts();
        if (Array.isArray(carts)) {
            let response = carts.filter((el) => el.id == id);
            if (response.length > 0) return response[0].products;
            else {
                return "Not found";
            }
        } else return "Error json file";
    };

    updateCart = async (cid, arr) => {
        let carts = await this.getCarts();
        if (Array.isArray(carts)) {
            let response = carts.filter((el) => el.id == cid);

            if (response.length > 0) {
                response[0].products = [...arr];
                let toModify = response[0];

                let toWrite = carts.filter((el) => el.id !== cid);
                toWrite.push(toModify);
                toWrite.sort((a, b) => {
                    if (a.id < b.id) {
                        return -1;
                    }
                    if (a.id > b.id) {
                        return 1;
                    }
                    return 0;
                });

                try {
                    await fs.promises.writeFile(this.path, JSON.stringify(toWrite));
                    return toModify;
                } catch (error) {
                    return error;
                }
            } else return "No keys match with cart id";
        } else {
            return "Error db";
        }
    }
}

module.exports = CartManager;



