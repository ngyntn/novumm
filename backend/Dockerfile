from node:25-trixie-slim

workdir /app
copy package*.json .

run npm install

copy . .

run npx prisma generate

expose 8080

cmd ["npm", "start"]