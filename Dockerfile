FROM node

WORKDIR /app

RUN npm init --yes
RUN npm install crypto-js --save
RUN npm install level --save

COPY . /app
