FROM mhart/alpine-node

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY *.js ./
ADD resolvers/ ./resolvers
ADD typeDefs/ ./typeDefs
ADD datasources/ ./datasources

# copy the babelrc config
COPY .babelrc ./

EXPOSE 4000
CMD [ "npm", "start" ]
