const axios = require("axios");
const cheerio = require("cheerio")

function _buildSearchUrl(productSearchTerm: string) {
    const amazonBaseSearchUrl: string = 'https://amazon.com/s?k=';
    // example: https://amazon.com/s?k=shelves
    return `${amazonBaseSearchUrl}${productSearchTerm}`
}

function _matchPrices(price: string) {
    const priceRegex: RegExp = /^(\$\d*\.\d*)(\$\d*\.\d*)$/
    let priceMatch: any = price.match(priceRegex)
    if (priceMatch) {
        return priceMatch.slice(1,3)
    } else {
        return null
    }

}

export default async function fetchProducts(productSearchTerm: string) {
    const searchUrl: string = _buildSearchUrl(productSearchTerm)
    try {
        // fetch search results
        const response = await axios.get(searchUrl)
        const html = response.data
        const $ = cheerio.load(html)
        const products: { title: string; link: string; image: string; stars: string; reviews: string; price: string; salePrice: string;}[] = []

        $('div.sg-col-4-of-12.s-result-item.s-asin.sg-col-4-of-16.sg-col.s-widget-spacing-small.sg-col-4-of-20').each((_index: any, el: any) => {
            const $product = $(el)
            const title: string = $product.find('span.a-size-base-plus.a-color-base.a-text-normal').text()
            const link: string = `https://amazon.com${$product.find('a.a-link-normal.s-no-outline').attr('href')}`
            const image: string = $product.find('img.s-image').attr('src')
            const stars: string = $product.find('div.a-section.a-spacing-none.a-spacing-top-micro > div.a-row.a-size-small > span').attr('aria-label')
            const reviews: string = $product.find('div.a-section.a-spacing-none.a-spacing-top-micro > div.a-row.a-size-small > span').next().attr('aria-label')
            const price: string = $product.find('span.a-price > span.a-offscreen').text()
            // make a copy, price is consumed by _matchPrices call
            let listPrice: string = price.slice()
            let salePrice: string = 'n/a'

            const prices: any = _matchPrices(price)
            if (prices) {
                salePrice = prices[0]
                listPrice = prices[1]
            }

            const product = {
                title: title,
                link: link,
                image: image,
                stars: stars ? stars : 'n/a',
                reviews: reviews ? reviews : 'n/a',
                price: listPrice,
                salePrice: salePrice,
            } 
            products.push(product)
        })
        return products
    } catch (error) {
        throw error
    }
}
