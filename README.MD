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

## Dependendencies
This whole project is using mongodb as its backend. Why? Because I talked about it a lot and had worked with other document dbs but never with mongo and that was simply unacceptable. Moreover, using mongo instead of managed service in some cloud means that this will run anywhere ... I'm not promoting the use of mongo in k8s over a managed service, but it makes this demo simple and completely contained.

### So .. the MongoDB
Used this as inspiration:
https://github.com/helm/charts/tree/master/stable/mongodb

and deployed like so:
```bash
helm install --name mongo stable/mongodb --namespace mongo
```

That should result in a service name as such: `mongo-mongodb.mongo.svc.cluster.local`

### istio injection
Yeah we need to execute this as well
`kubectl label namespace myservices istio-injection=enabled`
