FROM node:12.13.0

WORKDIR /user/app/client

ENV PATH /user/app/client/node_modules/.bin:$PATH

COPY . .

RUN npm install --silent
RUN npm install react-scripts@3.2.0 -g --silent

CMD ["npm", "start"]