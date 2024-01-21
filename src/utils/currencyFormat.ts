export function toReal(number: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(number);
  }
  
  export function parsePrice(priceString: string): string {
   let priceFloat: number = parseFloat(priceString.replace('R$ ', '').replace('.', '').replace(',', '.'));
   return toReal(priceFloat);
  }


 export function formatarMoedaBRL(valor: number | string): string {

    
    const valorNumerico = typeof valor === 'string' ? parseFloat(valor.replace('', '.')) : valor;


    if (isNaN(valorNumerico)) {
        throw new Error('Valor não é um número válido.');
    }

    const formatoMoeda = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    return formatoMoeda.format(valorNumerico);
}