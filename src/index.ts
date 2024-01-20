import axios from 'axios';
import { Telegraf, Markup } from 'telegraf';
require('dotenv').config();

import { load } from 'cheerio';
import puppeteer from 'puppeteer';
import { formatarMoedaBRL, parsePrice, toReal } from './utils/currencyFormat';
import { MercadoLivre } from '../src/services/marketplaces/ml';
import { createProduto } from './services/directus/products';


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


    bot.on('text', async (ctx) => {
        const url = ctx.message.text;

        // verify if this is a url valid
        const regex = new RegExp('^(ftp|http|https):\/\/[^ "]+$');

        if (!regex.test(url)) {
            ctx.reply('Invalid URL');
            return;
        }


        await MercadoLivre(url).then( async (response) => {
            ctx.reply({ text: response.name })
            ctx.reply({ text: response.offers })
         
            ctx.reply({ text: response.freeShipping ? 'Frete grátis' : 'Frete não incluso' })
            ctx.sendPhoto(response.image)
            

            await createProduto(response).then((response) => {
                ctx.reply('Produto cadastrado com sucesso');
            })

        }
        ).catch(err => {
            console.log(err);
            
            // ctx.reply(err.message);
        })
    });


    bot.launch()
    console.log('Bot is running!');

} catch (error) {
    console.log(error);
}