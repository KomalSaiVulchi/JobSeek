FROM node:20-alpine
WORKDIR /usr/src/app

# install deps
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# copy source
COPY . .

# no build step needed for plain JS server
EXPOSE 4000
CMD ["node", "index.js"]
