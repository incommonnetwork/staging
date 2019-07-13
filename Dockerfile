FROM keymetrics/pm2:latest-alpine

ADD client client
ADD server server
ADD config config
ADD public public
ADD package.json package.json
ADD package-lock.json package-lock.json
ADD .sequelizerc .sequelizerc

RUN npm install --production

CMD ["pm2-runtime","start","server/index.js"]