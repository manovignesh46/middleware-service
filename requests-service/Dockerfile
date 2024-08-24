FROM node:16-alpine
WORKDIR /usr/src/app
RUN apk add chromium 
COPY --chown=node:node package*.json ./
COPY --chown=node:node package.json ./
RUN npm install
# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"
# Puppeteer v13.5.0 works with Chromium 100.
RUN npm install puppeteer@21.3.2
COPY --chown=node:node . .
ENV NODE_ENV production
USER node
EXPOSE 3001
ENV SERVER_PORT 3001
# https://docs.nestjs.com/techniques/logger
# set logging to no color
ENV NO_COLOR true
CMD ["/bin/sh", "./entrypoint.sh" ]