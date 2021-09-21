package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
)

type Tweets struct {
	Tweets []Tweet `json:"data"`
}

type Tweet struct {
	Nombre     string   `json:"nombre"`
	Comentario string   `json:"comentario"`
	Fecha      string   `json:"fecha"`
	Hashtags   []string `json:"hashtags"`
	Upvotes    int      `json:"upvotes"`
	Downvotes  int      `json:"downvotes"`
}

var LOADBALANCER_URL string = "http://192.168.1.7:5000"
var okPost int = 0
var errorPost int = 0

func main() {

	jsonFile, err := os.Open("../data.json")
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println("Successfully Opened data.json")
	defer jsonFile.Close()

	byteValue, _ := ioutil.ReadAll(jsonFile)

	var tweets Tweets
	json.Unmarshal(byteValue, &tweets)
	fmt.Println("Presiona Enter para enviar trafico...")
	fmt.Scanln()

	for i := 0; i < len(tweets.Tweets); i++ {

		tweetJSON, err := json.Marshal(tweets.Tweets[i])
		req, err := http.NewRequest("POST", LOADBALANCER_URL+"/iniciarCarga", bytes.NewBuffer(tweetJSON))
		req.Header.Set("Content-Type", "application/json")

		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			panic(err)
		}
		defer resp.Body.Close()

		if resp.StatusCode >= 300 {
			errorPost = errorPost + 1
		} else {
			okPost = okPost + 1
		}
	}
	fmt.Println("Solicitudes Exitosas:", okPost)
	fmt.Println("Solicitudes Fracasadas:", errorPost)

	apisEndPoints := [3]string{"subirCargaPythonCloudRun", "subirCargaPython", "subirCargaPythonDocker"}

	fmt.Println("Presiona Enter para subir datos...")
	fmt.Scanln()

	for i := 0; i < len(apisEndPoints); i++ {

		resp, err := http.Get(LOADBALANCER_URL + "/" + apisEndPoints[i])
		if err != nil {
			panic(err)
		}
		defer resp.Body.Close()

		if resp.StatusCode >= 300 {
			fmt.Println("Error en /", apisEndPoints[i])
		} else {
			fmt.Println("OK /", apisEndPoints[i])
		}
	}
}
