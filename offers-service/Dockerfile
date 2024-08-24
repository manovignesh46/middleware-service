FROM node:16-alpine
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
COPY --chown=node:node . .
ENV NODE_ENV production
USER node
EXPOSE 3001
ENV SERVER_PORT 3001
# https://docs.nestjs.com/techniques/logger
# set logging to no color
ENV NO_COLOR true
CMD [ "node", "dist/main.js" ]