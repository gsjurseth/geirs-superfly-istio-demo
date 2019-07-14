# Install a working k8s cluster with a number of underlying microservices and aggregating apis
Herein you'll find the following services

* priceservice
* warehouseservice
* masterdataservice
* warehouse-client-api-service

## The Microservices
Each of these is an independent microservice with its own api

### priceservice
Service that spits back pricing info keyed off the name

### masterdataservice
Service that spits back masterdata keyed off the name

### warehouseservice
Service that spits back warehouse availability keyed off the name

### warehouse-client-api-service
Service this one is an aggregating service ostensibly used to enable the development of client that simply updates warehouse stock information.

## The APIS
Firstly, all the ones listed above, but additionally we have have price-catalog-api published as a pure apigee service
