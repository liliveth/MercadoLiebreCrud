const { validationResult } = require("express-validator");

const fs = require("fs");
const path = require("path");

const productsFilePath = path.join(__dirname, "../data/productsDataBase.json");
const products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));

const toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const controller = {
  // Root - Show all products
  index: (req, res) => {
    res.render("products", { products, toThousand });
  },

  // Detail - Detail from one product
  detail: (req, res) => {
    let { id } = req.params;
    let product = products.find((element) => element.id == id);
    res.render("detail", { product, toThousand });
    // Do the magic
  },

  // Create - Form to create

  create: (req, res) => {
    res.render("product-create-form");
  },

  // Create -  Method to store
  store: (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      res.render("product-create-form", {
        errores: errores.mapped(),
        old: req.body,
      });
    } else {
      const file = req.file;
      const { name, price, discount, description, category } = req.body;
      // if (!file){
      //   throw new Error("Por favor seleccione un archivo")
      // }
      // let products = loadProducts();
      const products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));
      const newProduct = {
        id: products[products.length - 1].id + 1,
        name: name.trim(),
        price: +price,
        description: description.trim(),
        discount: +discount,
        category,
        image: file ? file.filename : "default-image.png",
      };
      productsModify = [...products, newProduct];
      // storeProducts(productsModify);
      const productjson = JSON.stringify(productsModify);
      fs.writeFileSync(
        path.join(__dirname, "../data/productsDataBase.json"),
        productjson,
        "utf-8"
      );
      return res.redirect("/products");
    }
  },

  // Update - Form to edit
  edit: (req, res) => {
    let { id } = req.params;
    let product = products.find((element) => element.id == id);
    res.render("product-edit-form", { product });
  },
  // Update - Method to update
  update: (req, res) => {
    const { name, price, discount, description, category } = req.body;
    const products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));
    let productsModify = products.map((product) => {
      if (product.id === +req.params.id) {
        return {
          id: product.id,
          name: name.trim(),
          price: +price,
          description: description.trim(),
          discount: +discount,
          category,
          image: product.image,
        };
      }
      return product;
    });
    const productjson = JSON.stringify(productsModify);
    fs.writeFileSync(
      path.join(__dirname, "../data/productsDataBase.json"),
      productjson,
      "utf-8"
    );
    return res.redirect("/products/detail/" + req.params.id);
  },

  // Delete - Delete one product from DB
  destroy: (req, res) => {
    let { id } = req.params;
    const product = products.find((producto) => producto.id == id);
    let productsModify = products.filter((product) => product.id != id);
    const productjson = JSON.stringify(productsModify);
    fs.unlink("./public/images/products/" + product.image, (err) => {
      if (err) throw err;
    });
    fs.writeFileSync(
      path.join(__dirname, "../data/productsDataBase.json"),
      productjson,
      "utf-8"
    );
    return res.redirect("/products");
  },
};

module.exports = controller;
