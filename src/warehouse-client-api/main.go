package main

import (
	"encoding/json"
	"fmt"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/kelseyhightower/envconfig"
	"github.com/unrolled/render"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
)

type Stock struct {
	Name   string `json:"name"`
	Number int    `json:"number"`
}

// MasterData with Number added so that we can link in the number from Stock
type MasterData struct {
	Name   string `json:"name"`
	Desc   string `json:"desc"`
	Img    string `json:"imgUrl"`
	Number int    `json:"amount"`
}

type Config struct {
	MDHOST string
	MDPORT int
	MDKEY  string
	WHHOST string
	WHPORT int
	WHKEY  string
}

func main() {
	r := chi.NewRouter()

	// A good base middleware stack
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	// RESTy routes for "articles" resource
	r.Route("/v1/lager", func(r chi.Router) {
		r.Post("/", addStock)           // POST /articles
		r.Get("/", getStockWithDetails) // GET /articles/search
	})

	http.ListenAndServe(":3333", r)
}

func get(req http.Request, ch chan<- []byte) {
	log.Printf("the url is: %s", req.URL.String())
	resp, err := http.Get(req.URL.String())
	if err != nil {
		panic(err.Error())
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		panic(err.Error())
	}

	ch <- body
}

func retrieveMasterData(c Config) []MasterData {
	masterData := []MasterData{}

	Url, err := url.Parse(fmt.Sprintf("http://%s:%d/md", c.MDHOST, c.MDPORT))
	if err != nil {
		panic(err.Error())
	}
	var r = http.Request{URL: Url}
	ch := make(chan []byte, 1)

	get(r, ch)

	resp := <-ch

	anotherErr := json.Unmarshal(resp, &masterData)
	if anotherErr != nil {
		fmt.Println(anotherErr)
	}
	return masterData
}

func retrieveStock(c Config) []Stock {
	stock := []Stock{}

	Url, err := url.Parse(fmt.Sprintf("http://%s:%d/warehouse", c.WHHOST, c.WHPORT))
	if err != nil {
		panic(err.Error())
	}
	var r = http.Request{URL: Url}
	ch := make(chan []byte, 1)

	get(r, ch)

	resp := <-ch

	anotherErr := json.Unmarshal(resp, &stock)
	if anotherErr != nil {
		fmt.Println(anotherErr)
	}
	return stock
}

func getStockWithDetails(w http.ResponseWriter, r *http.Request) {
	renderer := render.New()
	var c Config
	err := envconfig.Process("app", &c)
	if err != nil {
		log.Fatal(err.Error())
	}

	stockCH := make(chan []Stock)
	mdCH := make(chan []MasterData)

	go func() {
		masterData := retrieveMasterData(c)
		mdCH <- masterData
	}()
	go func() {
		stock := retrieveStock(c)
		stockCH <- stock
	}()

	stock := <-stockCH
	masterData := <-mdCH

	for i, m := range masterData {
		masterData[i].Number = returnAmount(m.Name, stock)
	}
	renderer.JSON(w, http.StatusOK, masterData)
}

func returnAmount(name string, s []Stock) int {
	for _, i := range s {
		if i.Name == name {
			return i.Number
		}
	}
	return 0
}

func addStock(w http.ResponseWriter, r *http.Request) {
	return
}
