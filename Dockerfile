from node:12-alpine

ADD client client
ADD server server
ADD config config
ADD public public
ADD package.json package.json
ADD package-lock.json package-lock.json

RUN npm install --production

ENV NODE_ENV production
CMD ["node","server/index.js"]