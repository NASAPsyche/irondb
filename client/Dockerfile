FROM node:12.13.0

WORKDIR /usr/app/client

ENV PATH /usr/app/client/node_modules/.bin:$PATH

COPY . .

# Install node
RUN npm install npm@latest -g

# Install dependencies
RUN npm install --silent
RUN npm install react-scripts@3.2.0 -g --silent

CMD ["npm", "start"]
