FROM node:16-alpine AS appbuild
WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install --pure-lockfile
COPY . .
RUN yarn build
RUN rm -rf src
RUN rm -rf node_modules

FROM node:16-alpine 
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
RUN mkdir -p /usr/src/node-app && chown -R node:node /usr/src/node-app
WORKDIR /usr/src/node-app
COPY  package*.json yarn.lock ./
RUN yarn install --pure-lockfile --production=true
COPY --chown=node:node --from=appbuild ./app  ./
RUN chmod +x ./wait-for.sh
USER node
CMD [ "yarn","start" ]