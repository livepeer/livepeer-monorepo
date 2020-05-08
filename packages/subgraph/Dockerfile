# FROM livepeer/livepeerjs:latest as livepeerjs-build
FROM node:10

# Clone and install wait-for-it
RUN git clone https://github.com/vishnubob/wait-for-it \
    && cp wait-for-it/wait-for-it.sh /usr/local/bin \
    && chmod +x /usr/local/bin/wait-for-it.sh \
    && rm -rf wait-for-it

# RUN yarn workspace @livepeerjs/subgraph install

# FROM node:10

# COPY --from=livepeerjs-build /livepeerjs/packages/subgraph /livepeerjs/packages/subgraph
# COPY --from=livepeerjs-build /livepeerjs/packages/explorer-2.0 /livepeerjs/packages/explorer-2.0
# COPY --from=livepeerjs-build /livepeerjs/package.json /livepeerjs/package.json
# COPY --from=livepeerjs-build /livepeerjs/node_modules /livepeerjs/node_modules

# WORKDIR /livepeerjs/packages/subgraph

WORKDIR /subgraph
COPY abis /subgraph/abis
COPY patches /subgraph/patches
COPY src /subgraph/src
COPY test /subgraph/test
COPY utils /subgraph/utils
COPY networks.yaml /subgraph/networks.yaml
COPY package.json /subgraph/package.json
COPY yarn.lock /subgraph/yarn.lock
COPY schema.graphql /subgraph/schema.graphql
COPY subgraph.template.yaml /subgraph/subgraph.template.yaml
COPY templatify.js /subgraph/templatify.js
COPY truffle.js /subgraph/truffle.js
COPY tsconfig.json /subgraph/tsconfig.json

# Install dependencies
RUN yarn

ENTRYPOINT ["yarn"]