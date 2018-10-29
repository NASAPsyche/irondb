FROM node:8.12.0

# Move working directory to default build location.
WORKDIR /usr/app

# Copying package.json and installing dependencies.
COPY package.json .
RUN npm install --quiet

# Copying directory into container.
COPY . .

# Installing gulp globally and locally, then running tasks.
RUN npm install --global gulp-cli
RUN gulp sass
RUN gulp js
