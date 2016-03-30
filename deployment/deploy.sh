#!/usr/bin/env bash

# Hace el pack del proyecto (genera un "zip" que en realidad es un .tgz
npm pack ../

# Copia el .tgz al servidor en la nube
scp publicidadserver-0.1.0.tgz root@$1:~

# Copia la carpeta /config y sus archivos al servidor en la nube
scp -r config root@$1:~

# Copia el batch provision al servidor en la nube
scp provision.sh root@$1:~

# Entra al servidor en la nube y ejecuta el batch "provision.sh"
ssh root@$1 "./provision.sh"
