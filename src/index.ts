import axios from 'axios';
import { Telegraf, Markup } from 'telegraf';
require('dotenv').config();;
import { MercadoLivre } from '@/services/marketplaces/ml';
import { createProduto } from '@/services/directus/products';


try {
    const bot = new Telegraf(process.env.BOT_TOKEN as string);
    bot.start((ctx) => {
        let message = `Please select an option from the menu below`;
        ctx.replyWithHTML(message, Markup.keyboard([
            ['Option 1', 'Option 2'], 
            ['Option 3', 'Option 4'], 
            ['Option 5', 'Option 6', 'Option 7'] 
        ]).resize());
    })


    bot.on('text', async (ctx) => {
        const url = ctx.message.text;


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
            
            await createProduto(response).then(() => {
                ctx.reply('Produto cadastrado com sucesso');
            })

        }
        ).catch(err => {
            console.log(err);


            ctx.reply('Produto não encontrado');
        })
    });


    bot.launch()
    console.log('Bot is running!');

} catch (error) {
    console.log(error);
}