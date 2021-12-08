const fs = require("fs");
const path = require("path");

const productsFilePath = path.join(__dirname, "../data/productsDataBase.json");
const products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));

const toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
  // Root - Show all products
  index: (req, res) => {
    res.render("products", { products: products, toThousand });
  },

  // Detail - Detail from one product
  detail: (req, res) => {
    let id = req.params.id;
    let product = products.find((product) => product.id == id);
    res.render("detail", { product: product, toThousand });
  },

  // Create - Form to create
  create: (req, res) => {
    res.render("product-create-form");
  },

  // Create -  Method to store
  store: (req, res) => {
    //Creo el nuevo producto
    let newProduct = {
      id: products[products.length - 1].id + 1,
      ...req.body,
      image: "default-image.png",
    };
    //Lo meto al arreglo original products
    products.push(newProduct);
    //Convierto a JSON el arreglo products y lo guardo en productsDataBase.json
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, " "));
    res.redirect("/");
  },

  // Update - Form to edit
  edit: (req, res) => {
    let id = req.params.id;
    let productToEdit = products.find((product) => product.id == id);
    res.render("product-edit-form", { productToEdit });
  },

  // Update - Method to update
  update: (req, res) => {
    //Obtenemos el id de la url por params
    let id = req.params.id;
    //Encontramos el producto a editar
    let productToEdit = products.find((product) => product.id == id);

    //Creamos un nuevo objeto con los valores actualizados
    productToEdit = {
      //Le asignamos el id del producto a editar
      id: productToEdit.id,
      //Traemos la data de req actual, la editada
      ...req.body,
      //Le pasamos la imagen que trae el producto editado
      image: productToEdit.image,
    };

    //Le pasamos el producto actualizado a products
    let updateProducts = products.map((product) => {
      if (product.id == productToEdit.id) {
        return (product = { ...productToEdit });
      }
      return product;
    });

    //Convierto a JSON el arreglo products y lo guardo en productsDataBase.json
    fs.writeFileSync(
      productsFilePath,
      JSON.stringify(updateProducts, null, " ")
    );
    res.redirect("/");
  },

  // Delete - Delete one product from DB
  destroy: (req, res) => {
    let id = req.params.id;
    let finalProducts = products.filter((product) => {
      product.id != id;
    });
    fs.writeFileSync(
      productsFilePath,
      JSON.stringify(finalProducts, null, " ")
    );
    res.redirect("/");
  },
};

module.exports = controller;
