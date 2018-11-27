FROM node:10.13-alpine

RUN apk add git

# Set up deploy user and working directory
RUN adduser -D -g '' deploy
RUN mkdir -p /app

# Set up dumb-init
ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 /usr/local/bin/dumb-init
RUN chown deploy:deploy /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

RUN npm install -g yarn@1.9.4

# Set up /app for deploy user
ADD . /app
WORKDIR /app
RUN chown -R deploy:deploy /app

# Switch to deploy user
USER deploy
ENV USER deploy
ENV HOME /home/deploy

# Set up node_modules
RUN yarn install

# Echo commit hash
RUN echo $(git rev-parse --short HEAD) > COMMIT_HASH.txt
RUN rm -rf .git

ENV PORT 3005
EXPOSE 3005

ENTRYPOINT ["/usr/local/bin/dumb-init", "--"]
CMD ["yarn", "start"]
