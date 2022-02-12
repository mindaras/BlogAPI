FROM node:16

WORKDIR /usr/app

COPY . .

ENV NODE_OPTIONS="--max-old-space-size=8192"

RUN npm i

RUN npm run build

CMD ["npm", "run", "start:prod"]
