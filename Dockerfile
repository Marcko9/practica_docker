FROM node:19.2-alpine3.16

#cd /app
WORKDIR /app

#Copia los archivos a /app/
COPY index.js package.json ./

#Instalar dependencias
RUN npm install

CMD ["node", "index.js"]