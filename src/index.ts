import { Telegraf, Markup } from 'telegraf';
require('dotenv').config();;
import { MercadoLivre } from './services/marketplaces/ml';
import { createProduto } from './services/directus/products';
import svg2img from 'svg2img';
import { modelSVG } from './assets/modelSvg';


try {
    const bot = new Telegraf(process.env.BOT_TOKEN as string);


    

    bot.on('text', async (ctx) => { 
        const url = ctx.message.text;


        const regex = new RegExp('^(ftp|http|https):\/\/[^ "]+$');

        if (!regex.test(url)) {
            ctx.reply('Invalid URL');
            return;
        }


        await MercadoLivre(url).then(async (response) => {
        

            await createProduto(response).then(() => {
                ctx.reply('Produto cadastrado com sucesso');
            })


            let svgTOSEND = await modelSVG(response);

            svg2img(svgTOSEND, function (_error, buffer) {
                //returns a Buffer
                ctx.replyWithPhoto({ source: buffer });
            });

        }
        ).catch(err => {
            ctx.reply('erro ao completar a requisição');
        })
    });





    bot.launch()
    console.log('Bot is running!');

} catch (error) {
    console.log(error);
}