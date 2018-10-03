# Personal site base on NodeJS technologies

## How to check the presentation version
#### Install Docker, Docker compose
```
  apt install docker.io docker-compose
```

### Sign in Docker Hub.
```
  docker login
```

### Upload docker-compose.yml to the server 
```
  wget https://raw.githubusercontent.com/vlikin/node-typescript-website/master/docker/docker-compose.yml
```

### Up the application
```
  docker-compose up -d
```

### Check the site following on in a browser(Firefox is preferred)
```
  http://localhost:80
```
### Check the admin panel following on in a browser.
```
  http://localhost:81
```
Admin's password is ```admin```

## Link
* [Building process of Docker containers](docker/README.md)