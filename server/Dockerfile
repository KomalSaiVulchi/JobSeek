FROM node:20-alpine
WORKDIR /usr/src/app

# install deps
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# copy source
COPY . .

RUN npm run build

EXPOSE 4000
CMD ["node", "dist/index.js"]
