FROM node:lts-bullseye-slim

WORKDIR /app

COPY package.json ./package.json

RUN npm install

COPY . .

EXPOSE 80

CMD [ "npm", "run", "dev" ]
