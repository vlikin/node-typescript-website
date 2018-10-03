## Building process
To make a presentation of changes easily, the project parts are wrapped into containers and a docker compose is configured.

### Node container.
This container is a container with project dependencies. This is the base execution layer.
Attention. Do not forget to update server's package.json.
```
  cd node
  cp ../../server/package.json .
  docker build .
```

### The application container.
#### Compile all sources in the production mode.
##### Server
```
  cd server/
  npm run compile
``` 

##### Admin client
```
  cd client/admin
  npm run build-aot
```

##### Client assets.
```
  cd client/client
  npm-run gulp default
```
##### Move compiled sources into a common place.
```
 mkdir docker/app/src/
 cp -R server/built docker/app/src/server
 cp -R server/pug docker/app/src/
 cp -R server/yaml docker/app/src/
 cp -R client/admin/dist/admin docker/sources/client-admin
 cp -R client/client/www docker/sources/client-client
```
##### Move configs.
```
  mkdir config
  cp ../../server/config/default.js ./config
  cp ../../server/config/docker.js ./config
```
##### Build
```  
  docker build .
```

### Nginx container
```
  cd nginx
  docker build . 
```

## Up the project using the development compose file.
```
  docker-compose -f ./docker-compose-developmet.yml up -d
```

### Build and send builds.
```
  keys = [node, app, nginx]
  sudo docker build . -t vlikin/ntw-${key}
  sudo docker push vlikin/ntw--${key}
```

### How to check the presentation version
#### Install Docker, Docker compose
```
  apt install docker.io docker-compose
```

#### Sign in Docker Hub.
```
  docker login
```

#### Upload docker-compose.yml to the server 
```
  wget https://raw.githubusercontent.com/vlikin/node-typescript-website/master/docker/docker-compose-development.yml
```

#### Up the application
```
  docker-compose up -d
```
