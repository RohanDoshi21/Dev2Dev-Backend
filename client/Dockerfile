FROM node:lts-bullseye-slim

WORKDIR /react-app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
