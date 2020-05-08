FROM node:10

WORKDIR /livepeerjs
COPY . .

RUN yarn 