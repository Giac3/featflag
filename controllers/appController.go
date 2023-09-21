package controllers

import (
	"fmt"
	"math/rand"
	"modules/featflag/database"
	"modules/featflag/models"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type NewApp struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

var AppImages = [...]string{"https://api.dicebear.com/7.x/identicon/svg?seed=Willow", "https://api.dicebear.com/7.x/identicon/svg?seed=Gizmo", "https://api.dicebear.com/7.x/identicon/svg?seed=Abby", "https://api.dicebear.com/7.x/identicon/svg?seed=Kiki", "https://api.dicebear.com/7.x/identicon/svg?seed=Lucy", "https://api.dicebear.com/7.x/identicon/svg?seed=Gracie", "https://api.dicebear.com/7.x/identicon/svg?seed=Bella", "https://api.dicebear.com/7.x/identicon/svg?seed=Buster", "https://api.dicebear.com/7.x/identicon/svg?seed=Lucky", "https://api.dicebear.com/7.x/identicon/svg?seed=Princess", "https://api.dicebear.com/7.x/identicon/svg?seed=Garfield", "https://api.dicebear.com/7.x/identicon/svg?seed=Mia", "https://api.dicebear.com/7.x/identicon/svg?seed=Simba", "https://api.dicebear.com/7.x/identicon/svg?seed=Sam", "https://api.dicebear.com/7.x/identicon/svg?seed=Oliver", "https://api.dicebear.com/7.x/identicon/svg?seed=Midnight", "https://api.dicebear.com/7.x/identicon/svg?seed=Jasmine", "https://api.dicebear.com/7.x/identicon/svg?seed=Coco", "https://api.dicebear.com/7.x/identicon/svg?seed=Tiger", "https://api.dicebear.com/7.x/identicon/svg?seed=Charlie"}

func CreateApp(ctx *gin.Context) {

	jwtCookie, err := ctx.Cookie("jwt")

	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"status":  "fail",
			"message": "Unable to authenticate",
		})
		return
	}

	claims := &jwt.RegisteredClaims{}
	token, err := jwt.ParseWithClaims(jwtCookie, claims, func(t *jwt.Token) (interface{}, error) {
		return []byte(Secretkey), nil
	})

	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"status":  "fail",
			"message": "Unauthorized",
		})
		return
	}

	if claims, ok := token.Claims.(*jwt.RegisteredClaims); ok && token.Valid {
		fmt.Println("Issuer: ", claims.Issuer)
	} else {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"status":  "fail",
			"message": "Invalid Auth Token",
		})
		return
	}

	var createApp NewApp

	if err := ctx.ShouldBindJSON(&createApp); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if createApp.Name == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid name for an app"})
		return
	}
	if createApp.Description == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid description for an app"})
		return
	}

	randomIndex := rand.Intn(len(AppImages))
	pick := AppImages[randomIndex]

	i, err := strconv.Atoi(claims.Issuer)

	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Auth Error"})
		return
	}

	app := models.App{
		Name:        createApp.Name,
		Description: createApp.Description,
		NumFlags:    0,
		Created:     time.Now(),
		UserId:      uint(i),
		ImgUrl:      pick,
	}

	if err := database.DB.Create(&app).First(&app).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Sorry there was an error creating your app"})
		return
	}

	ctx.JSON(http.StatusOK, app)
}
func GetApps(ctx *gin.Context) {
	jwtCookie, err := ctx.Cookie("jwt")

	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"status":  "fail",
			"message": "Unable to authenticate",
		})
		return
	}

	claims := &jwt.RegisteredClaims{}
	token, err := jwt.ParseWithClaims(jwtCookie, claims, func(t *jwt.Token) (interface{}, error) {
		return []byte(Secretkey), nil
	})

	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"status":  "fail",
			"message": "Unauthorized",
		})
		return
	}

	if claims, ok := token.Claims.(*jwt.RegisteredClaims); ok && token.Valid {
		fmt.Println("Issuer: ", claims.Issuer)
	} else {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"status":  "fail",
			"message": "Invalid Auth Token",
		})
		return
	}

	var apps []models.App

	if err := database.DB.Where("user_id = ?", claims.Issuer).Find(&apps).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Authentication Error"})
		return
	}

	ctx.JSON(http.StatusOK, apps)
}

func EditApp(ctx *gin.Context) {

	var editApp NewApp

	if err := ctx.ShouldBindJSON(&editApp); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if editApp.Name == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid name for an app"})
		return
	}
	if editApp.Description == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid description for an app"})
		return
	}

	jwtCookie, err := ctx.Cookie("jwt")

	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"status":  "fail",
			"message": "Unable to authenticate",
		})
		return
	}

	claims := &jwt.RegisteredClaims{}
	token, err := jwt.ParseWithClaims(jwtCookie, claims, func(t *jwt.Token) (interface{}, error) {
		return []byte(Secretkey), nil
	})

	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"status":  "fail",
			"message": "Unauthorized",
		})
		return
	}

	if claims, ok := token.Claims.(*jwt.RegisteredClaims); ok && token.Valid {
		fmt.Println("Issuer: ", claims.Issuer)
	} else {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"status":  "fail",
			"message": "Invalid Auth Token",
		})
		return
	}

	appId := ctx.Param("app_id")

	var app models.App

	if err := database.DB.Where("id = ? and user_id = ?", appId, claims.Issuer).First(&app).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Sorry there was an error updating your app"})
		return
	}

	app.Name = editApp.Name
	app.Description = editApp.Description
	database.DB.Save(&app)

	ctx.JSON(http.StatusOK, app)
}
func DeleteApp(ctx *gin.Context) {
	jwtCookie, err := ctx.Cookie("jwt")

	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"status":  "fail",
			"message": "Unable to authenticate",
		})
		return
	}

	claims := &jwt.RegisteredClaims{}
	token, err := jwt.ParseWithClaims(jwtCookie, claims, func(t *jwt.Token) (interface{}, error) {
		return []byte(Secretkey), nil
	})

	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"status":  "fail",
			"message": "Unauthorized",
		})
		return
	}

	if claims, ok := token.Claims.(*jwt.RegisteredClaims); ok && token.Valid {
		fmt.Println("Issuer: ", claims.Issuer)
	} else {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"status":  "fail",
			"message": "Invalid Auth Token",
		})
		return
	}

	appId := ctx.Param("app_id")

	var app models.App

	if err := database.DB.Where("id = ? and user_id = ?", appId, claims.Issuer).First(&app).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Sorry there was an error deleting your app"})
		return
	}

	var flags []models.Flag

	if err := database.DB.Where("app_id = ?", appId).Find(&flags).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Sorry there was an error deleting your app"})
		return
	}
	database.DB.Delete(&flags)
	database.DB.Delete(&app)

	ctx.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "App deleted",
	})
}
