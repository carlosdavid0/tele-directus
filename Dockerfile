# Use uma imagem oficial do Node.js como base
FROM node:20

# Defina o diretório de trabalho no container
WORKDIR /usr/src/app

# Copie os arquivos package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie o resto dos arquivos do projeto para o diretório de trabalho
COPY . .

# Comando para iniciar o aplicativo
CMD [ "node", "./dist/index.js" ]
