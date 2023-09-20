FROM node:18-alpine
COPY . /home/node/app/
WORKDIR /home/node/app/
RUN npm install

EXPOSE 8000
#VOLUME ["/home/node/app/ProfileFolder", "/home/node/app/ResumeFolder"]

CMD ["node", "/home/node/app/index.js"]