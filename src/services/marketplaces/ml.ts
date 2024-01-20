import axios from "axios";
import { load } from "cheerio";
import { requestProdudcts } from "@/@types/requests";
import puppeteer from "puppeteer";






export async function MercadoLivre(url: string): Promise<requestProdudcts> {
    const regex = new RegExp('^(ftp|http|https):\/\/[^ "]+$');

    if (!regex.test(url)) {
        throw new Error('Invalid URL');
    }
    const { data } = await axios.get(url)

    const html = load(data)
    const productName = html('script[type="application/ld+json"]').first().html();


    let parsedJson = JSON.parse(productName as string);

    const freeShippingElement = html('.ui-pdp-color--GREEN').text().toUpperCase().includes('FRETE GRÁTIS')

    console.log(html('.ui-pdp-color--GREEN').text());

    puppeteer.launch().then(async browser => {
        const page = await browser.newPage();
        await page.goto(url);
        await page.screenshot({ path: 'example.png', fullPage: true });

        await browser.close();
    })

    const { name, image, offers } = parsedJson

    const oldPriceFractionFirst = html('#ui-pdp-main-container > div.ui-pdp-container__col.col-3.ui-pdp-container--column-center.pb-40 > div > div.ui-pdp-container__row.ui-pdp-with--separator--fluid.ui-pdp-with--separator--40 > div.ui-pdp-container__col.col-2.mr-32 > div.ui-pdp-price.mt-16.ui-pdp-price--size-large > div.ui-pdp-price__main-container > span > s > span.andes-money-amount__fraction').first().html() ? html('#ui-pdp-main-container > div.ui-pdp-container__col.col-3.ui-pdp-container--column-center.pb-40 > div > div.ui-pdp-container__row.ui-pdp-with--separator--fluid.ui-pdp-with--separator--40 > div.ui-pdp-container__col.col-2.mr-32 > div.ui-pdp-price.mt-16.ui-pdp-price--size-large > div.ui-pdp-price__main-container > span > s > span.andes-money-amount__fraction').first().html() as string : null;

    const oldPriceCentsFirst = html('#ui-pdp-main-container > div.ui-pdp-container__col.col-3.ui-pdp-container--column-center.pb-40 > div > div.ui-pdp-container__row.ui-pdp-with--separator--fluid.ui-pdp-with--separator--40 > div.ui-pdp-container__col.col-2.mr-32 > div.ui-pdp-price.mt-16.ui-pdp-price--size-large > div.ui-pdp-price__main-container > span > s > span.andes-money-amount__cents.andes-money-amount__cents--superscript-16').first().html() ? html('#ui-pdp-main-container > div.ui-pdp-container__col.col-3.ui-pdp-container--column-center.pb-40 > div > div.ui-pdp-container__row.ui-pdp-with--separator--fluid.ui-pdp-with--separator--40 > div.ui-pdp-container__col.col-2.mr-32 > div.ui-pdp-price.mt-16.ui-pdp-price--size-large > div.ui-pdp-price__main-container > span > s > span.andes-money-amount__cents.andes-money-amount__cents--superscript-16').first().html() as string : null;

    const oldPriceFractionSecc = html('#price > div > div.ui-pdp-price__main-container > span > s > span.andes-money-amount__fraction').first().html() ? html('#price > div > div.ui-pdp-price__main-container > span > s > span.andes-money-amount__fraction').first().html() as string : null;
    
    const oldPriceCentsSecc = html('#price > div > div.ui-pdp-price__main-container > span > s > span.andes-money-amount__cents.andes-money-amount__cents--superscript-16').first().html() ? html('#price > div > div.ui-pdp-price__main-container > span > s > span.andes-money-amount__cents.andes-money-amount__cents--superscript-16').first().html() as string : null;

    const oldPriceFirst = oldPriceFractionFirst || oldPriceCentsFirst ? `${oldPriceFractionFirst ? oldPriceFractionFirst : '00'},${oldPriceCentsFirst ? oldPriceCentsFirst : '00'}` : null;
    const oldPriceSecc = oldPriceFractionSecc || oldPriceCentsSecc ? `${oldPriceFractionSecc ? oldPriceFractionSecc : '00'},${oldPriceCentsSecc ? oldPriceCentsSecc : '00'}` : null;



    return {
        name,
        image,
        offers: offers.price,
        oldPrice: oldPriceFirst || oldPriceSecc || null,
        freeShipping: freeShippingElement,
        url
    }



}