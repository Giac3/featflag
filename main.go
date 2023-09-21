package main

import (
	"modules/featflag/database"
	"modules/featflag/routes"

	"github.com/gin-gonic/gin"
)

func main() {

	database.Connect()

	gin.SetMode(gin.DebugMode)
	router := gin.Default()

	router.Use(CORSMiddleware())

	routes.SetUp(router)

	router.Run()
}
