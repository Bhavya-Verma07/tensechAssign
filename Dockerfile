FROM node:16.15.1

COPY package*.json ./


RUN npm install

COPY . .

EXPOSE 7850

CMD [ "node", "index.js" ]