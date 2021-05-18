FROM node:14-alpine

RUN mkdir -p /usr/src/server

WORKDIR /usr/src/server

COPY package.json /usr/src/server/package.json
COPY yarn.lock /usr/src/server/yarn.lock

RUN yarn install

COPY . .

EXPOSE 5000

CMD ["yarn", "start"]
