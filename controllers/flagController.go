package controllers

import (
	"fmt"
	"modules/featflag/database"
	"modules/featflag/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type NewFlag struct {
	Name         string `json:"name"`
	Description  string `json:"description"`
	Reference    string `json:"reference"`
	DevState     bool   `json:"dev_state"`
	StagingState bool   `json:"staging_state"`
	ProdState    bool   `json:"prod_state"`
}
type EditingFlag struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Reference   string `json:"reference"`
}

func CreateFlag(ctx *gin.Context) {
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

	var createFlag NewFlag

	if err := ctx.ShouldBindJSON(&createFlag); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if createFlag.Name == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid name for a flag"})
		return
	}
	if createFlag.Description == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid description for a flag"})
		return
	}
	if createFlag.Reference == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid reference for a flag"})
		return
	}

	var app models.App

	appId := ctx.Param("app_id")

	if err := database.DB.Where("user_id = ? and id = ?", claims.Issuer, appId).First(&app).Error; err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not Authorized"})
		return
	}

	/* Maybe going to add images to flags */
	// randomIndex := rand.Intn(len(AppImages))
	// pick := AppImages[randomIndex]

	flag := models.Flag{
		Name:         createFlag.Name,
		Description:  createFlag.Description,
		Reference:    createFlag.Reference,
		Created:      time.Now(),
		Changed:      time.Now(),
		DevState:     createFlag.DevState,
		StagingState: createFlag.StagingState,
		ProdState:    createFlag.ProdState,
		AppId:        app.Id,
	}

	if err := database.DB.Create(&flag).First(&flag).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Sorry there was an error creating your flag"})
		return
	}

	ctx.JSON(http.StatusOK, flag)
}

func GetFlags(ctx *gin.Context) {
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

	if err := database.DB.Where("user_id = ? and id = ?", claims.Issuer, appId).First(&app).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid App"})
		return
	}

	var flags []models.Flag

	if err := database.DB.Where("app_id = ?", appId).Find(&flags).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Authentication Error"})
		return
	}

	ctx.JSON(http.StatusOK, flags)
}

func UpdateFlagState(ctx *gin.Context) {
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

	flagId := ctx.Param("flag_id")
	env := ctx.Param("env")

	if env != "dev" && env != "staging" && env != "prod" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Sorry: " + env + " is not a valid env"})
		return
	}

	var flag models.Flag

	if err := database.DB.Where("id = ?", flagId).First(&flag).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Sorry there was an error creating your flag"})
		return
	}

	var app models.App

	if err := database.DB.Where("user_id = ? and id = ?", claims.Issuer, flag.AppId).First(&app).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid App"})
		return
	}

	flag.Changed = time.Now()

	if env == "dev" {
		flag.DevState = !flag.DevState
	}
	if env == "staging" {
		flag.StagingState = !flag.StagingState
	}
	if env == "prod" {
		flag.ProdState = !flag.ProdState
	}

	database.DB.Save(&flag)

	ctx.JSON(http.StatusOK, flag)
}
func EditFlag(ctx *gin.Context) {

	var editFlag EditingFlag

	if err := ctx.ShouldBindJSON(&editFlag); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if editFlag.Name == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid name for a flag"})
		return
	}
	if editFlag.Description == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid description for a flag"})
		return
	}
	if editFlag.Reference == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid reference for a flag"})
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

	flagId := ctx.Param("flag_id")

	var flag models.Flag

	if err := database.DB.Where("id = ?", flagId).First(&flag).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Sorry there was an error creating your flag"})
		return
	}

	var app models.App

	if err := database.DB.Where("user_id = ? and id = ?", claims.Issuer, flag.AppId).First(&app).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid App"})
		return
	}

	flag.Name = editFlag.Name
	flag.Reference = editFlag.Reference
	flag.Description = editFlag.Description

	database.DB.Save(&flag)

	ctx.JSON(http.StatusOK, flag)
}

func DeleteFlag(ctx *gin.Context) {
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

	flagId := ctx.Param("flag_id")
	appId := ctx.Param("app_id")

	var app models.App

	if err := database.DB.Where("id = ? and user_id = ?", appId, claims.Issuer).Find(&app).Error; err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var flag models.Flag

	if err := database.DB.Where("id = ? and app_id = ?", flagId, appId).First(&flag).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Sorry there was an error deleting your app"})
		return
	}

	database.DB.Delete(&flag)

	ctx.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Flag deleted",
	})
}
