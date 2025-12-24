FROM alpine:latest

ARG PB_VERSION=0.22.21

RUN apk add --no-cache \
    unzip \
    ca-certificates \
    # this is needed only if you want to use scp to copy later your pb_data locally
    openssh

# download and unzip PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

# copy local migrations
COPY ./pb_migrations /pb/pb_migrations

# copy setup script just in case we need to run it (though usually migrations handle schema)
COPY ./setup_pb.js /pb/

EXPOSE 8090

# start PocketBase
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090"]
