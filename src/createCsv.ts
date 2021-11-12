const fs = require('fs');

export default function createCsv (products: [], filename: string) {
    let csvContent = "Title,Link,Image,Stars,Reviews,Price,SalePrice\n"
    let productLine: string = ''
    let product: string[] = []
    let filepath: string = `./archive/${filename.replace(/ /g, '-')}-${new Date().toISOString().replace(/[-]/g, '').replace(/[\:]/g, '')}.csv`
    for (let i:number = 0; i < products.length; i++) {
        product = Object.values(products[i]);
        productLine = `${product.map(val => val.match(/,/) ? `"${val.replace(/["]/g, '""')}"` : val.replace(/["]/g, '""') ).join(',')}\n`
        csvContent += productLine
    }
    // the file path is relative from the calling file, not the imported file

    fs.writeFile(filepath, csvContent, {flag: 'w+'}, (err: any) => {})
    console.log(`Wrote results to ${filepath}`)
}