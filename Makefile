HOME := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
GCRPATH := eu.gcr.io/geirs-purdy-project
VERSION := latest


build-price:
	@cd $(HOME)/src/price
	docker build -t apigee-price . 

build-masterdata:
	@cd $(HOME)/src/masterdata
	docker build -t apigee-masterdata .

build-cart:
	@cd $(HOME)/src/cart
	docker build -t apigee-cart . 

build-warehouse:
	@cd $(HOME)/src/warehouse
	docker build -t apigee-warehouse . 

tag-price: build-price
	docker tag apigee-price $(GCRPATH)/apigee-price:$(VERSION)

tag-masterdata: build-masterdata
	docker tag apigee-masterdata $(GCRPATH)/apigee-masterdata:$(VERSION)

tag-warehouse: build-warehouse
	docker tag apigee-warehouse $(GCRPATH)/apigee-warehouse:$(VERSION)
	
tag-cart: build-cart
	docker tag apigee-cart $(GCRPATH)/apigee-cart:$(VERSION)

push-price: tag-price
	docker push $(GCRPATH)/apigee-price:$(VERSION)

push-masterdata: tag-masterdata
	docker push $(GCRPATH)/apigee-masterdata:$(VERSION)

push-warehouse: tag-warehouse
	docker push $(GCRPATH)/apigee-warehouse:$(VERSION)
	
push-cart: tag-cart
	docker push $(GCRPATH)/apigee-cart:$(VERSION)

build-images: build-price build-cart build-warehouse build-masterdata

tag-images: tag-cart tag-price tag-warehouse tag-masterdata

push-images: push-cart push-price push-warehouse push-masterdata

push: push-images
