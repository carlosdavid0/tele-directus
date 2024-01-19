import axios from 'axios';
import { Telegraf, Markup } from 'telegraf';
require('dotenv').config();

import { load } from 'cheerio';
import puppeteer from 'puppeteer';

try {

    const bot = new Telegraf(process.env.BOT_TOKEN as string);

    bot.start((ctx) => {
        let message = `Please select an option from the menu below`;
        ctx.replyWithHTML(message, Markup.keyboard([
            ['Option 1', 'Option 2'], // Linha 1 com 2 opções
            ['Option 3', 'Option 4'], // Linha 2 com 2 opções
            ['Option 5', 'Option 6', 'Option 7'] // Linha 3 com 3 opções
        ]).resize());
    })

    bot.hears('Option 1', async (ctx) => {
        const url = ctx.message.text;

        // verify if this is a url valid
        const regex = new RegExp('^(ftp|http|https):\/\/[^ "]+$');

        if (!regex.test(url)) {
            ctx.reply('Invalid URL');
            return;
        }

        axios.get(url).then(response => {
            const html = load(response.data)
            const productName = html('script[type="application/ld+json"]').first().html();
            let parsedJson = JSON.parse(productName as string);
            const { name, image, offers } = parsedJson
            ctx.reply({ text: name })
            ctx.reply({ text: offers.price })
            ctx.sendPhoto(image)
        })
    });

    bot.on('text', async (ctx) => {
        const url = ctx.message.text;

        // verify if this is a url valid
        const regex = new RegExp('^(ftp|http|https):\/\/[^ "]+$');

        if (!regex.test(url)) {
            ctx.reply('Invalid URL');
            return;
        }

        axios.get(url).then(response => {
            const html = load(response.data)
            const productName = html('script[type="application/ld+json"]').first().html();

            const oldPrice = html('span.andes-money-amount__fraction').first().html() as string

            let parsedJson = JSON.parse(productName as string);


            


            puppeteer.launch().then(async browser => {

                // Open new page
                const page = await browser.newPage();

                // Go to website
                await page.goto(url);

                await page.screenshot({ path: 'example.png', fullPage: true });
            })

            const freeShippingElement = html('.ui-pdp-color--GREEN');

            if (freeShippingElement.text().toUpperCase().includes('FRETE GRÁTIS')) {
                ctx.reply('Frete grátis.');
            }
            
            const { name, image, offers } = parsedJson
            ctx.reply({ text: name })
            ctx.reply({ text: offers.price })
            ctx.reply({ text: oldPrice })
            ctx.sendPhoto(image,{
                caption: 'This is a caption!'
            
            })
        })
    });


    bot.launch().then(() => {
        console.log('Bot started');
    }
    ).catch((err) => {
        console.log(err);
    });

} catch (error) {
    console.log(error);
}