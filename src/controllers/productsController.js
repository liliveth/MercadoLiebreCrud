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
    // Do the magic
  },

  // Create -  Method to store
  store: (req, res) => {
    const { name, price, discount, description, category } = req.body;
    // let products = loadProducts();
    const products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));
    const newProduct = {
      id: products[products.length - 1].id + 1,
      name: name.trim(),
      price: +price,
      description: description.trim(),
      discount: +discount,
      category,
      image: "default-image.png",
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
    // Do the magic
  },

  // Update - Form to edit
  edit: (req, res) => {
    let { id } = req.params;
    let product = products.find((element) => element.id == id);
    res.render("product-edit-form", { product });
    // Do the magic
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

    // Do the magic
  },

  // Delete - Delete one product from DB
  destroy: (req, res) => {
    let { id } = req.params;
    let productsModify = products.filter((product) => product.id != id);
    const productjson = JSON.stringify(productsModify);
    fs.writeFileSync(
      path.join(__dirname, "../data/productsDataBase.json"),
      productjson,
      "utf-8"
    );
    return res.redirect("/products");

    // Do the magic
  },
};

module.exports = controller;
