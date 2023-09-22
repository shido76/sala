FROM node:18

RUN apt-get -y update && apt-get install -y \
  libgtk-3-dev \
  libnotify-dev \
  libgconf-2-4 \
  libnss3 \
  libxss1 \
  libasound2 \
  && apt-get clean \
  && rm -rf /var/cache/apt/archives/* \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
  && truncate -s 0 /var/log/*log

ENV LANG=C.UTF-8 \
  LC_ALL=C.UTF-8

# Create app directory
WORKDIR /usr/src/app

#COPY ./ca-adserver1.crt /usr/local/share/ca-certificates
#RUN update-ca-certificates

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 3003

CMD [ "npm", "run", "dev" ]