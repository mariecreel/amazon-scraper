const fetchProducts = require("./src/fetchProducts.js").default;
const createCsv = require("./src/createCsv.js").default;

const args = process.argv.slice(2);
// todo: handling multiple arguments? may need to use a package for this if we're going to add flags

if (args[0]) {
  console.log(`Fetching Amazon search results for search term "${args[0]}"`);
  fetchProducts(args[0]).then((products) => {
    createCsv(products, args[0]);
  }).then(() => {
    console.log('amazonSearchScraper.js terminating normally');
  });
} else {
  throw Error(
    "NO ARGUMENT PROVIDED: Please provide a product search term as a command line argument, e.g. node amazonSearchScraper.js shelves"
  );
}
