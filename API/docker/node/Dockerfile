FROM python:3.7.1-stretch

# Move working directory to default build location.
WORKDIR /usr/app/API

# Copying rest of directory into container.
COPY /API .

# Install dependencies for python environment
RUN apt-get update &&  apt-get upgrade -y
# RUN apt-get install -y python-numpy python-scipy python-matplotlib ipython python-pandas python-sympy python-nose 
RUN apt-get install -y openjdk-8-jdk-headless clang-3.8  ca-certificates libffi-dev libedit-dev gfortran libncurses5-dev libncursesw5-dev sqlite3 libssl-dev

# /docker/node/requirements.txt is list of pip dependencies
RUN pip install --no-cache-dir -r ./docker/node/requirements.txt

# Install node
RUN tar -xJf docker/node/node-v10.13.0-linux-x64.tar.xz -C /usr/local --strip-components=1

# Install dependencies.
RUN npm install npm@latest -g
RUN npm install --quiet
