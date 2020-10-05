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
Firstly, all the ones listed above, but additionally we have have price-catalog-api published as a pure apigee service. And for good measure there's 
product api as well that duplicates the catalog but without pricing information.

## Documentation and Patterns
APIdocs contains documentation for the developer portal. Also included in the patterns directory which contains automated deployment of patterns to SignalPattern.

## Dependendencies and Setup
This whole project is using mongodb as its backend. Why? Because I talked about it a lot and had worked with other document dbs but never with mongo and that was simply unacceptable. Moreover, using mongo instead of managed service in some cloud means that this will run anywhere ... I'm not promoting the use of mongo in k8s over a managed service, but it makes this demo simple and completely contained.

### So .. the MongoDB
Used this as inspiration:
https://github.com/helm/charts/tree/master/stable/mongodb

and deployed like so:
```bash
helm install --name mongo --namespace mongo \
  --set mongodbRootPassword=supersecret,mongodbUsername=aMagicUser,mongodbPassword=aMagicPass,mongodbDatabase=aMagicDB \
    stable/mongodb
```

That should result in a service name as such: `mongo-mongodb.mongo.svc.cluster.local` and with a user and pass that's up to you. You'll need to use that later on when you setup the secret to get everything up and running

### istio injection
Yeah we need to execute this as well
```bash
kubectl label namespace myservices istio-injection=enabled
```

### Secrets for both mongo and the warehouse-client-api
You need to make sure that the pods can actually reach and authenticate with the mongo setup. For my part I've chosen to use a secret like so (NOTE: swap out user an pass for your values):

```bash
kubectl create secret generic mongoauth --from-literal=user=muser --from-literal=pass=mpass --namespace myservices
```

And with that done we need to provide a secret (an api key) to the warehouse-client-api so that it can authenticate with the other services (masterdata and warehouse). What i've done is to create a mesh-api-product and then an app based on that. Grab that key and use it for the secret like so:

```bash
kubectl create secret generic whapikey --from-literal=key=dakey --namespace myservices
```

The spec for the warehouse-client-api is already setup to look for and use this key just as the other services are already looking for the mongoauth credentials.
