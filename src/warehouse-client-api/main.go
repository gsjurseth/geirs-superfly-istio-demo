package main

import (
	"encoding/json"
	"fmt"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/kelseyhightower/envconfig"
	"github.com/unrolled/render"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

var (
	Trace   *log.Logger
	Info    *log.Logger
	Warning *log.Logger
	Error   *log.Logger
)

func Init(
	traceHandle io.Writer,
	infoHandle io.Writer,
	warningHandle io.Writer,
	errorHandle io.Writer) {

	Trace = log.New(traceHandle,
		"TRACE: ",
		log.Ldate|log.Ltime|log.Lshortfile)

	Info = log.New(infoHandle,
		"INFO: ",
		log.Ldate|log.Ltime|log.Lshortfile)

	Warning = log.New(warningHandle,
		"WARNING: ",
		log.Ldate|log.Ltime|log.Lshortfile)

	Error = log.New(errorHandle,
		"ERROR: ",
		log.Ldate|log.Ltime|log.Lshortfile)
}

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
	Init(ioutil.Discard, os.Stdout, os.Stdout, os.Stderr)
	r := chi.NewRouter()

	// A good base middleware stack
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	// RESTy routes
	r.Route("/v1/lager", func(r chi.Router) {
		r.Post("/", addStock)           // POST /articles
		r.Get("/", getStockWithDetails) // GET /articles/search
	})

	Info.Println("Starting up services on port 3333")
	http.ListenAndServe(":3333", r)
}

func get(req *http.Request, ch chan<- []byte) {
	log.Printf("the url is: %s", req.URL.String())
	var client http.Client
	resp, err := client.Do(req)
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

	r, e := http.NewRequest("GET", fmt.Sprintf("http://%s:%d/md", c.MDHOST, c.MDPORT), nil)
	if e != nil {
		panic(e.Error())
	}
	r.Header.Add("x-api-key", c.MDKEY)
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

	r, e := http.NewRequest("GET", fmt.Sprintf("http://%s:%d/warehouse", c.WHHOST, c.WHPORT), nil)
	if e != nil {
		panic(e.Error())
	}
	r.Header.Add("x-api-key", c.WHKEY)
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
