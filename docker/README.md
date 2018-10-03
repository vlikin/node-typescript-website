## Builds
To make a presentation of changes easily, the project parts are wrapped into containers and a docker compose is configured.

## Tips
### Remove all volumes
```
  docker system prune
```
or
```
  docker volume prune
```
or
```
 docker volume rm $(docker volume ls -qf dangling=true)
```

### Node container.
This container is a container with project dependencies. This is the base execution layer.
Attention. Do not forget update server's package.json.
```
  cd node
  cp ../../server/package.json .
  docker build .
```

### Compile all sources in the production mode.
```
  cd server/
  npm run compile 
  cd client/admin
  npm run build-aot
  cd client/client
  npm-run gulp default
```

### Move compiled sources into a common place.
```
 mkdir docker/sources
 cp -R server/built docker/sources/server
 cp -R server/pug docker/sources/
 cp -R server/yaml docker/sources/
 cp -R client/admin/dist/admin docker/sources/client-admin
 cp -R client/client/www docker/sources/client-client
```

### The application container.
```
  cd app
  cp -R ../sources ./src
  mkdir config
  cp ../../server/config/default.js ./config
  cp ../../server/config/docker.js ./config
  docker build .
```

### Server sources.
```
  cd server/
  npm run compile
  cp -R ./build ../docker/trading_server_src/src
  cp -R ./configs ../docker/trading_server_src/configs
  cd ../docker/trading_server_src
  sudo docker build .
```
Configs have to be reviewed.
### Trading client sources.
Before docker building, build sources by angular cli.
```
  cd client/
  npm run b-trading:build-aot
  cp -R ./b-trading-dist ../docker/trading_client_src/src
  cd ../docker/trading_client_src
  sudo docker build .
```
### Admin client sources.
Before docker building, build sources by angular cli.
```
  cd client/
  npm run admin:build-aot
  cp -R ./admin-dist ../docker/admin_client_src/src
  cd ../docker/admin_client_src
  sudo docker build .
```
### Up the project using the development compose files.
```
  docker-compose -f ./docker-compose-developmet.yml up -d
```
### Build and send builds.
```
  sudo docker build . -t vlikin/itp-trading_server_src
  sudo docker push vlikin/itp-trading_server_src
```
### Deploy
#### Install Docker, Docker compose
```
  apt install docker.io docker-compose
```
#### Prepare a directory
```
  mkdir -p /usr/src/itp
  cd /usr/src/itp
```
#### Upload docker-compose.yml to the server 
```
  scp ./docker-compose.yml root@$IP:/docker/itp/
```
#### Sign in Docker Hub.
```
  docker login
```
#### Up the application
```
  docker-compose up -d
```
