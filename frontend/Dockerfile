FROM node:18-alpine
WORKDIR /app

RUN npm install -g @angular/cli

COPY ./package.json .
RUN npm install

COPY . .
CMD ["/bin/sh", "-c", "ng serve --host 0.0.0.0 --disable-host-check"]
