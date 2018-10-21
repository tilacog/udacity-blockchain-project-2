FROM node

WORKDIR /app

RUN npm init --yes
RUN npm install crypto-js --save
RUN npm install level --save

RUN npm install --save-dev mocha

COPY . /app
CMD ./node_modules/mocha/bin/mocha ./tests
