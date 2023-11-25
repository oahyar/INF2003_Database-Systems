#! /usr/bin/env bash

image_name=web:1.0
port_id=8080
container_name=web
dev=1
prod=2
ssl=3

user_choice() {
    while true; do
        read -p "Choose: 
1) Development
2) Production
3) Renew SSL
" choice
        echo ""
        case $choice in
            $dev)
                echo "Setting up Development environment..."
                break
                ;;
            $prod)
                echo "Setting up Production environment..."
                break
                ;;
            $ssl)
                echo "Renewing SSL..."
                break
                ;;
            *)
                echo "Invalid option, please try again."
                ;;
        esac
    done
}

user_choice

if [[ $choice -eq $dev ]]
then
    docker build -t $image_name -f Dockerfile .

    echo "Deleting old container..."
    docker rm -f $container_name

    echo "Creating new container..."
    docker run -d -p $port_id':'$port_id --name $container_name $image_name
elif [[ $choice -eq $prod ]]
then
    # This script restarts the docker compose
    echo "Stopping all containers"
    docker compose stop

    echo "Removing all containers"
    docker compose rm -f

    echo "Starting containers..."
    docker compose -f docker-compose.prod.yml up --build -d
elif [[ $choice -eq $ssl ]]
then
    COMPOSE="/usr/bin/docker-compose --no-ansi"
    DOCKER="/usr/bin/docker"

    $COMPOSE run certbot renew && $COMPOSE kill -s SIGHUP webserver
    $DOCKER system prune -af
fi
