FROM Node:18-aphline

WORKDIR /backend/dt/app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["node", "./dist/main.js"]
