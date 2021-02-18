MKHOME := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
GCRPATH := eu.gcr.io/geirs-purdy-project
VERSION := latest


build-price:
	@cd $(MKHOME)/src/price ; docker build -t apigee-price . 

build-masterdata:
	@cd $(MKHOME)/src/masterdata ; docker build -t apigee-masterdata .

build-cart:
	@cd $(MKHOME)/src/cart ; docker build -t apigee-cart . 

build-warehouse:
	@cd $(MKHOME)/src/warehouse ; docker build -t apigee-warehouse . 

build-warehouse-client:
	@cd $(MKHOME)/src/warehouse-client-api ; docker build -t apigee-warehouse-client . 

tag-price: build-price
	docker tag apigee-price $(GCRPATH)/apigee-price:$(VERSION)

tag-masterdata: build-masterdata
	docker tag apigee-masterdata $(GCRPATH)/apigee-masterdata:$(VERSION)

tag-warehouse: build-warehouse
	docker tag apigee-warehouse $(GCRPATH)/apigee-warehouse:$(VERSION)
	
tag-cart: build-cart
	docker tag apigee-cart $(GCRPATH)/apigee-cart:$(VERSION)

tag-warehouse-client: build-warehouse-client
	docker tag apigee-warehouse-client $(GCRPATH)/apigee-warehouse-client:$(VERSION)

push-price: tag-price
	@docker push $(GCRPATH)/apigee-price:$(VERSION)

push-masterdata: tag-masterdata
	@docker push $(GCRPATH)/apigee-masterdata:$(VERSION)

push-warehouse: tag-warehouse
	@docker push $(GCRPATH)/apigee-warehouse:$(VERSION)
	
push-cart: tag-cart
	@docker push $(GCRPATH)/apigee-cart:$(VERSION)

push-warehouse-client: tag-warehouse-client
	@docker push $(GCRPATH)/apigee-warehouse-client:$(VERSION)

build-images: build-price build-cart build-warehouse build-masterdata build-warehouse-client

tag-images: tag-cart tag-price tag-warehouse tag-masterdata tag-warehouse-client

push-images: push-cart push-price push-warehouse push-masterdata push-warehouse-client

push: push-images

all: push
