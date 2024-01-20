import axios from "axios";
import { requestProdudcts } from "@/@types/requests";
import { env } from "@/utils/env";

export async function createProduto({ freeShipping, image, name, offers, oldPrice, url }: requestProdudcts) {

    try {
        const imageUploaded = await axios.post(`${env.DIRECTUS_BASE_URL}/files/import`, {
            url: image
        }, {
            headers: {
                'Authorization': `Bearer ${env.USER_BOT_DIRECTUS_TOKEN}`
            }
        })


        const product = await axios.post(`${env.DIRECTUS_BASE_URL}/items/produtos`, {
            preco_atual: Number(offers),
            preco_antigo: oldPrice ? Number(oldPrice.replace('.', '').replace(',', '.')) : null,
            frete_gratis: freeShipping,
            image: imageUploaded.data.data.id,
            nome: name,
            status: 'published',
            url_afiliado: url

        }, {
            headers: {
                'Authorization': `Bearer ${env.USER_BOT_DIRECTUS_TOKEN}`
            }
        })



        return product.data.data

    } catch (error: any) {
        console.log(error.response.data);

    }

}