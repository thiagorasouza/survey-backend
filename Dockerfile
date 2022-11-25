FROM node:16

WORKDIR /app

COPY ./package.json .

RUN npm install --only=prod

COPY ./dist ./dist

EXPOSE 5000

CMD npm start