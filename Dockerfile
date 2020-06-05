FROM node:latest

WORKDIR /app

COPY ./ /app

RUN npm install

ENV PORT=3000

CMD ["npm", "run", "start"]
