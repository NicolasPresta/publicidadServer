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
cp /root/config/default /etc/nginx/sites-enabled/default
cp /root/config/publicidadServer-1.conf /etc/init
cp /root/config/publicidadServer-2.conf /etc/init
cp /root/config/publicidadServer-3.conf /etc/init

## Install publicidadServer
rm -rf /opt/publicidadserver
mkdir -p /opt/publicidadserver
tar xvfz /root/publicidadserver-0.1.0.tgz -C /opt/publicidadserver
cd /opt/publicidadserver/package && npm install

## Run services
service nginx restart
service publicidadServer-1 restart
service publicidadServer-2 restart
service publicidadServer-3 restart
