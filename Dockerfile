
FROM node:lts-buster


COPY package.json .

RUN npm install
RUN npm i pm2
COPY . .

EXPOSE 3000

CMD ["node", "index.js", "--server"]
