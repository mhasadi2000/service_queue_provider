FROM node:14-alpine
RUN echo "http://mirror.fcix.net/alpine/v3.16/main" > /etc/apk/repositories ; \
    echo "http://mirror.fcix.net/alpine/v3.16/community" >> /etc/apk/repositories

WORKDIR /app
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools
RUN apk --no-cache add make gcc postgresql-dev g++
COPY . .
RUN npm install
RUN npm install pm2 -g
EXPOSE 3000
CMD ["node", "server.js"]