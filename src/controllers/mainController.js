const fs = require("fs");
const path = require("path");

const productsFilePath = path.join(__dirname, "../data/productsDataBase.json");
const products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));

const toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

let visitados = products.filter((product) => product.category == "visited");
let enOferta = products.filter((product) => product.category == "in-sale");

const controller = {
  index: (req, res) => {
    res.render("index", {
      visitados: visitados,
      enOferta: enOferta,
      toThousand,
    });
  },
  search: (req, res) => {
    let search = req.query.keywords;
    let productToSearch = products.filter((product) =>
      product.name.toLowerCase().includes(search)
    );
    res.render("results", {
      products: productToSearch,
      search,
      toThousand,
    });
  },
};

module.exports = controller;
