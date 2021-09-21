package main

import (
	"fmt"
	"log"
	"net/http"

	"database/sql"
	"time"

	"github.com/gin-gonic/gin"

	_ "github.com/go-sql-driver/mysql"
)

/*
  host="34.123.196.134",
  user="root",
  password="l9j6oytdaq9DGhbO@",
  database="mydb"
*/

// album represents data about a record album.
type tweet struct {
	Nombre     string   `json:"nombre"`
	Comentario string   `json:"comentario"`
	Fecha      string   `json:"fecha"`
	Hashtags   []string `json:"hashtags"`
	Upvotes    int64    `json:"upvotes"`
	Downvotes  int64    `json:"downvotes"`
}

// albums slice to seed record album data.
var data = []tweet{
	{Nombre: "Leonel Aguilar", Comentario: "El dia de hoy el atleta [...]", Fecha: "24/08/2021", Hashtags: []string{"remo", "atletismo", "natacion"}, Upvotes: 100, Downvotes: 200},
}

func main() {
	router := gin.Default()
	router.LoadHTMLGlob("templates/*")
	router.GET("/albums", getAlbums)
	router.GET("/albums/:id", getAlbumByID)
	router.POST("/albums", postAlbums)
	router.GET("/", home)
	router.GET("/test", testDB)

	router.Run("localhost:8080")
}
func testDB(c *gin.Context) {
	db, err := sql.Open("mysql", "root:l9j6oytdaq9DGhbO@tcp(34.123.196.134)/mydb")
	// See "Important settings" section.
	db.SetConnMaxLifetime(time.Minute * 3)
	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(10)
	defer db.Close()
	if err != nil {
		panic(err)
	}
	res, err := db.Query("Select * from Tweet")
	defer res.Close()
	if err != nil {
		log.Fatal(err)
	}
	for res.Next() {
		var actual tweet
		if err := res.Scan(&actual); err != nil {
			return
		}
		fmt.Printf(actual.Nombre)
	}
}

// getAlbums responds with the list of all albums as JSON.
func getAlbums(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, data)
}

// postAlbums adds an album from JSON received in the request body.
func postAlbums(c *gin.Context) {
	var newAlbum tweet

	// Call BindJSON to bind the received JSON to
	// newAlbum.
	if err := c.BindJSON(&newAlbum); err != nil {
		return
	}

	// Add the new album to the slice.
	data = append(data, newAlbum)
	c.IndentedJSON(http.StatusCreated, newAlbum)
}

// getAlbumByID locates the album whose ID value matches the id
// parameter sent by the client, then returns that album as a response.
func getAlbumByID(c *gin.Context) {
	id := c.Param("id")

	// Loop through the list of albums, looking for
	// an album whose ID value matches the parameter.
	for _, a := range data {
		if a.Nombre == id {
			c.IndentedJSON(http.StatusOK, a)
			return
		}
	}
	c.IndentedJSON(http.StatusNotFound, gin.H{"message": "album not found"})
}

func home(c *gin.Context) {
	c.HTML(http.StatusOK, "index.tmpl", gin.H{
		"title": "SOPES 1 - Proyecto 1",
	})
}
