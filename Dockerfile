FROM node:8.12.0

# Move working directory to default build location.
WORKDIR /usr/app

# Copying rest of directory into container.
COPY . .

# Install dependencies.
RUN npm install --quiet
RUN cd /tmp
RUN curl -O https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
RUN bash Miniconda3-latest-Linux-x86_64.sh -b -p $HOME/miniconda
# RUN export PATH="/root/miniconda/bin:$PATH"
# RUN conda env create -f /tmp/linux64JournalImport.yml
