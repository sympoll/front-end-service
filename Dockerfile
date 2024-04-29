FROM node:20-slim

WORKDIR /app

COPY . .

RUN npm i

EXPOSE 8080

CMD [ "npm", "run", "dev" ]