# syntax=docker/dockerfile:1

FROM node:lts AS runtime
WORKDIR /app

COPY . .
RUN apt-get update
RUN apt-get install -y locales locales-all
ENV LC_ALL=de_DE.UTF-8
ENV LANG=de_DE.UTF-8
ENV LANGUAGE=de_DE.UTF-8
RUN apt-get update
RUN apt-get install -yq tzdata
RUN ln -fs /usr/share/zoneinfo/Europe/Berlin /etc/localtime
RUN dpkg-reconfigure -f noninteractive tzdata
RUN npm install
RUN npm run build

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321
#CMD ["node", "./dist/server/entry.mjs"]
CMD ["npm", "run", "dev"]