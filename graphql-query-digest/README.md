# Graphql Query Digest 
This is a very simple proxy that does the following
 * proxies for an apollo graphpql server
 * grabs an API Key in order to hit said graphql server (you'll need to configure this)
 * creates a digest of the incoming query
 * uses this digest to activate response cache so that it can be cached.

## Setup
To use this you'll need to do the following
 * update the proxy to use your own graphql endpoint
 * run the `buildsetup.sh` to grab some apigee deps
 * build this so you can deploy it (from the callout directory)
 ```bash
 mvn install
 ```

Running `mvn install` not only builds the java callout, but populates the proxy with
the other jar resources required to make this work.
