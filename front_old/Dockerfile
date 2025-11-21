FROM node:22-bookworm-slim
WORKDIR /var/www

COPY package.json ./
RUN npm install

COPY . .

RUN npm run build

CMD ["node", ".output/server/index.mjs"]