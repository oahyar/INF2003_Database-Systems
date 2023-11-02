#! /usr/bin/env bash

image_name=web:1.0
port_id=8080
container_name=web
dev=1
prod=2
ssl=3
user_choice() {
    read -p "Choose: 
1) Development
2) Production
3) Renew SSL
" choice
echo ""
}
user_choice

if [[ $choice -eq $dev ]]
then
    docker build -t $image_name -f Dockerfile  .

    echo Deleting old container...
    docker rm -f $container_name

    echo Creating new container...
    docker run -d -p $port_id':'$port_id --name $container_name $image_name
elif [[ $choice -eq $prod ]]
then
    #This script restarts the docker compose
    echo Stopping all containers
    docker-compose stop

    echo Removing all containers
    docker-compose rm -f

    echo Starting containers...
    docker-compose up --build -d
elif [[ $choice -eq $ssl ]]
then
    COMPOSE="/usr/bin/docker-compose --no-ansi"
    DOCKER="/usr/bin/docker"

    $COMPOSE run certbot renew && $COMPOSE kill -s SIGHUP webserver
    $DOCKER system prune -af
else
    echo "Option unavailable, please try again"

    user_choice
fi
