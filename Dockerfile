FROM node:8.12.0

# Move working directory to default build location.
WORKDIR /usr/app

# Copying directory into container.
COPY . .

# Copying package.json and installing dependencies.
RUN npm install --quiet

# Installing gulp globally, then running tasks.
RUN npm install --global gulp-cli
RUN gulp sass
RUN gulp js
