FROM python:3.7.1-stretch

WORKDIR /usr/src/app

# Move working directory to default build location.
WORKDIR /usr/app

# Copying rest of directory into container.
COPY . .

# In proj root dir, add requirements.txt which lists needed dependencies for pip to install 
# RUN pip install --no-cache-dir -r requirements.txt

# Install node
RUN tar -xJf /usr/app/docker/node/node-v10.13.0-linux-x64.tar.xz -C /usr/local --strip-components=1

# Install dependencies.
RUN npm install --quiet

CMD ["./wait-for-it.sh", "pgdb:5432", "--timeout=90", "--", "node", "./bin/www"]
