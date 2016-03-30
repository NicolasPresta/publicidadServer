#!/usr/bin/env bash

## Install basic development tools and nginx
##apt-get update
##apt-get install -y build-essential git nginx libkrb5-dev

## Install Databases
##apt-get install -y mongodb redis-server

## Install Node.js 4.x from NodeSource Distributions
##curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
##sudo apt-get install -y nodejs

## Copy configuration to real destinations
## el default es el archivo de configuracion de servicio nginx
## cada .conf es el archivo de configuración de servicio cada proceso de node
cp /root/config/default /etc/nginx/sites-enabled/default
cp /root/config/publicidadServer-1.conf /etc/init
cp /root/config/publicidadServer-2.conf /etc/init
cp /root/config/publicidadServer-3.conf /etc/init

## Install publicidadServer
## elimina la carpeta publicidadserver
rm -rf /opt/publicidadserver
## crea la carpeta publicidadserver
mkdir -p /opt/publicidadserver
## descomprime el .tgz
tar xvfz /root/publicidadserver-0.1.0.tgz -C /opt/publicidadserver
## manda a hacer el npm install (esto tarda bastante la primera vez)
cd /opt/publicidadserver/package && npm install

## Run services
service nginx restart
service publicidadServer-1 restart
service publicidadServer-2 restart
service publicidadServer-3 restart
