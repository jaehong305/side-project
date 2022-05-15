FROM node:16

WORKDIR /sideproject_backend/
COPY ./package.json /sideproject_backend/
COPY ./yarn.lock /sideproject_backend/
RUN yarn install

COPY . /sideproject_backend/
CMD yarn start:dev