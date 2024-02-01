FROM node:18.12.1
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4050
CMD ["npm", "start"]
