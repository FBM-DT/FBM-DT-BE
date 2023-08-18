# Specify node version and choose image
# also name our image as development (can be anything)
FROM node:18 AS development

# Specify our working directory, this is in our container/in our image
WORKDIR /backend/dt/app

# Copy the package.jsons from host to container
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

# Bundle app source / copy all other files
COPY . .

# Build the app to the /dist folder
RUN npm run build

################
## PRODUCTION ##
################
# Build another image named production
FROM node:18 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set Working Directory
WORKDIR /backend/dt/app

COPY package*.json ./
# RUN npm ci --omit=dev --ignore-scripts
RUN npm install --only=production --ignore-scripts

# COPY . .

# Copy all from development stage

COPY --from=development ./backend/dt/app/ ./

# Run app
CMD [ "node", "dist/main" ]
