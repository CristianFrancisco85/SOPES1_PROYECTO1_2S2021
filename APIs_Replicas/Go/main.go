package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	_ "log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"

	_ "github.com/go-sql-driver/mysql"

	"context"

	"cloud.google.com/go/pubsub"
	_ "cloud.google.com/go/pubsub"
	_ "go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type tweet struct {
	Nombre     string   `json:"nombre"`
	Comentario string   `json:"comentario"`
	Fecha      string   `json:"fecha"`
	Hashtags   []string `json:"hashtags"`
	Upvotes    int64    `json:"upvotes"`
	Downvotes  int64    `json:"downvotes"`
}

type pub_sub_sender struct {
	Guardados     int64  `json:"guardados"`
	Api           string `json:"api"`
	TiempoDeCarga string `json:"tiempoDeCarga"`
	Bd            string `json:"bd"`
}

var data = []tweet{}

func main() {
	router := gin.Default()
	router.LoadHTMLGlob("templates/*")
	router.GET("/tweets", getTweets)
	router.GET("/", home)
	router.POST("/iniciarCarga", iniciarCarga)
	router.GET("/subirCargaGolang", subirCargaGolang)

	router.Run("localhost:8080")
}
func dsn(dbName string, username string, password string, hostname string) string {
	return fmt.Sprintf("%s:%s@tcp(%s)/%s", username, password, hostname, dbName)
}

func iniciarCarga(c *gin.Context) {
	//Insersion del tweet que viene del body
	var newTweet tweet
	if err := c.BindJSON(&newTweet); err != nil {
		return
	}
	data = append(data, newTweet)
	c.IndentedJSON(http.StatusCreated, newTweet)
}

func getTweets(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, data)
}

func subirCargaGolang(c *gin.Context) {
	//Conexion a db mysql
	countMysql := 0
	countMongo := 0
	db, err := sql.Open("mysql", dsn("mydb", "root", "l9j6oytdaq9DGhbO@", "34.123.196.134"))
	db.SetConnMaxLifetime(time.Minute * 3)
	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(10)
	defer db.Close()
	if err != nil {
		panic(err)
	}
	//obteniendo time
	start_go := time.Now()
	sqlQuery := "INSERT INTO Tweet (Nombre,Comentario,Fecha,Hashtags,Upvotes,Downvotes) VALUES ('%s','%s','%s','%s','%s','%s')"
	for i := 0; i < len(data); i++ {
		hashtagString := "#" + data[i].Hashtags[0]
		for j := 1; j < len(data[i].Hashtags); j++ {
			hashtagString += ", #" + data[i].Hashtags[j]
		}
		query := fmt.Sprintf(sqlQuery, data[i].Nombre, data[i].Comentario, data[i].Fecha, hashtagString, strconv.FormatInt(data[i].Upvotes, 10), strconv.FormatInt(data[i].Downvotes, 10))
		fmt.Println(query)
		/*
			insert, err := db.Query(query)
			if err != nil {
				panic(err.Error())
			}
			defer insert.Close()
		*/
		countMysql++
	}
	commit, err := db.Query("commit")
	if err != nil {
		panic(err.Error())
	}
	defer commit.Close()
	timeGo := time.Since(start_go)
	start_mongo := time.Now()
	//Conexion a mongodb
	//Cliente
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://proyecto1-mongodb:FLAJuykpeNXSGoSgvUAq8CdQKwTG6TuiPvucxg3GbusrdEbD4ugMNqGvQmLYuz94iMyxPS4TFn8agUZ971bGrw==@proyecto1-mongodb.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@proyecto1-mongodb@"))
	if err != nil {
		log.Fatal(err)
	}
	//Tiempo de conexion
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	//Conexion
	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}
	//Ping (un pequeno test)
	err = client.Ping(context.TODO(), nil)
	if err != nil {
		log.Fatal(err)
	}
	//Buscamos la coleccion
	collection := client.Database("mydb").Collection("tweet")
	var datos []interface{}
	for i := 0; i < len(data); i++ {
		hashtagString := "#" + data[i].Hashtags[0]
		for j := 1; j < len(data[i].Hashtags); j++ {
			hashtagString += ", #" + data[i].Hashtags[j]
		}
		tweetJson := "{\"Nombre\":\"%s\",\"Comentario\":\"%s\",\"Fecha\":\"%s\",\"Hashtags\":\"%s\",\"Upvotes\":%s,\"Downvotes\":%s}"
		new_tweet := fmt.Sprintf(tweetJson, data[i].Nombre, data[i].Comentario, data[i].Fecha, hashtagString, strconv.FormatInt(data[i].Upvotes, 10), strconv.FormatInt(data[i].Downvotes, 10))
		fmt.Println(new_tweet)
		var result map[string]interface{}
		json.Unmarshal([]byte(new_tweet), &result)
		datos = append(datos, result)
		countMongo++
	}
	fmt.Println(datos)

	insertManyResult, err := collection.InsertMany(context.TODO(), datos)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Inserted multiple documents: ", insertManyResult.InsertedIDs)

	defer client.Disconnect(ctx)
	timeMongo := time.Since(start_mongo)
	json_base := "{\"guardados\":\"%s\", \"api\":%s, \"tiempoDeCarga\":\"%s\", \"bd\":\"%s\"}"
	json_mysql := fmt.Sprintf(json_base, strconv.FormatInt(int64(countMysql), 10), "Go", timeGo.String(), "MySQL")
	json_mongo := fmt.Sprintf(json_base, strconv.FormatInt(int64(countMongo), 10), "Go", timeMongo.String(), "MongoDB")

	psctx := context.Background()
	proj := "sapient-ground-324600"

	psclient, err := pubsub.NewClient(psctx, proj)
	if err != nil {
		log.Fatalf("Could not create pubsub Client: %v", err)
	}
	const topic = "dbUpdates"

	// Publish a text message on the created topic.
	if err := publish(psclient, topic, json_mysql); err != nil {
		log.Fatalf("Failed to publish: %v", err)
	}
	if err := publish(psclient, topic, json_mongo); err != nil {
		log.Fatalf("Failed to publish: %v", err)
	}
	data = nil
}

func publish(client *pubsub.Client, topic, msg string) error {
	ctx := context.Background()
	t := client.Topic(topic)
	result := t.Publish(ctx, &pubsub.Message{
		Data: []byte(msg),
	})
	// Block until the result is returned and a server-generated
	// ID is returned for the published message.
	id, err := result.Get(ctx)
	if err != nil {
		return err
	}
	fmt.Printf("Published a message; msg ID: %v\n", id)
	return nil
}
func home(c *gin.Context) {
	c.HTML(http.StatusOK, "index.tmpl", gin.H{
		"title": "SOPES 1 - Proyecto 1",
	})
}
