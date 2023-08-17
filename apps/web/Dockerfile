FROM node:lts-slim

ENV NODE_ENV development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000

RUN npm run build

CMD [ "npm", "start" ]