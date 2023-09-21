package controllers

import (
	"fmt"
	"math/rand"
	"modules/featflag/database"
	"modules/featflag/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

const charset = "abcdefghijklmnopqrstuvwxyz" + "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

var seededRand *rand.Rand = rand.New(
	rand.NewSource(time.Now().UnixNano()))

func StringWithCharset(length int) string {
	b := make([]byte, length)
	for i := range b {
		b[i] = charset[seededRand.Intn(len(charset))]
	}
	return string(b)
}

func generateApiKey(length int) string {
	encodedString := StringWithCharset(60)
	return "sk-" + encodedString
}

func CreateKey(ctx *gin.Context) {
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

	var app models.App

	appId := ctx.Param("app_id")

	if err := database.DB.Where("user_id = ? and id = ?", claims.Issuer, appId).First(&app).Error; err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not Authorized"})
		return
	}

	env := ctx.Param("env")

	genKey := generateApiKey(240)

	key := models.Key{
		Key:         genKey,
		AppId:       app.Id,
		UserId:      app.UserId,
		Environment: env,
	}

	if err := database.DB.Create(&key).First(&key).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Sorry there was an error creating your token"})
		return
	}

	ctx.JSON(http.StatusOK, key)
}

func GetKeys(ctx *gin.Context) {
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

	var app models.App

	appId := ctx.Param("app_id")

	if err := database.DB.Where("user_id = ? and id = ?", claims.Issuer, appId).First(&app).Error; err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not Authorized"})
		return
	}

	var keys []models.Key

	if err := database.DB.Where("user_id = ? and app_id = ?", claims.Issuer, app.Id).Find(&keys).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Sorry there was an error getting your api keys"})
		return
	}

	ctx.JSON(http.StatusOK, keys)
}
func DeleteKey(ctx *gin.Context) {
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

	var key models.Key

	keyId := ctx.Param("key_id")

	if err := database.DB.Where("user_id = ? and id = ?", claims.Issuer, keyId).First(&key).Error; err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not Authorized"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Key Deleted",
	})
}
