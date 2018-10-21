FROM node

WORKDIR /app

# cache deps
COPY ./package.json ./
RUN npm install

COPY . /app
CMD npm test
