FROM node:21-slim

RUN apt update && apt install -y openssl procps

# RUN npm install -g @nestjs/cli@10.3.2 @prisma/client

USER node

RUN mkdir /home/node/nest-essentials-typeorm/

WORKDIR /home/node/nest-essentials-typeorm/

CMD ["/home/node/nest-essentials-typeorm/.docker/start-dev.sh"]