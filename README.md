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

## CLI usage
There is an example under. Keep attention on:
* ts-node is used, *.ts files are processed.
* configFile has to be set.
```
 configFile=../config/dev.js ts-node ./src/cli_inv.ts cli:initial-data
```
### Commands
#### --help
Displays the help.
#### cli:install
Installs the application on a prestine state.
#### cli:uninstall
Removes everything that has been installed by ```cli:install```
#### cli:reinstall
Resets the systems in case it has been installed before.
#### cli:admin-password
Resets the admin password.
#### cli:intial-data
Make the first migration. The applicated has to pass the installation before initiation data,.
## Link
* [Building process of Docker containers](docker/README.md)
