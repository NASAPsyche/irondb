FROM node:8.12.0

# Move working directory to default build location.
WORKDIR /usr/app

# Copying rest of directory into container.
COPY . .

# Install dependencies.
RUN npm install --quiet
