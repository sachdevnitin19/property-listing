FROM node:8

WORKDIR /usr/src/app
RUN npm install -g pm2@2.10.2
COPY package*.json ./

RUN npm install

COPY . .
CMD ["pm2-docker", "start", "pm2-config.json", "--env",  "prod"]