package controllers

import (
	"modules/featflag/database"
	"modules/featflag/models"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func CheckFlag(ctx *gin.Context) {

	token := ctx.Request.Header["Authorization"]

	if token == nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not Authorized, please check that you're token has been set"})
		return
	}

	strippedToken := strings.Split(token[0], "Bearer ")[1]

	var key models.Key

	if err := database.DB.Where("key = ?", strippedToken).First(&key).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid token"})
		return
	}

	flagRef := ctx.Param("flag_ref")
	var flag models.Flag

	if err := database.DB.Where("app_id = ? and reference = ?", key.AppId, flagRef).First(&flag).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Flag"})
		return
	}

	if key.Environment == "dev" {
		ctx.JSON(http.StatusOK, gin.H{
			"valid":         true,
			"current_state": flag.DevState,
		})
		return
	}
	if key.Environment == "staging" {
		ctx.JSON(http.StatusOK, gin.H{
			"valid":         true,
			"current_state": flag.StagingState,
		})
		return
	}
	if key.Environment == "prod" {
		ctx.JSON(http.StatusOK, gin.H{
			"valid":         true,
			"current_state": flag.ProdState,
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"valid": false,
	})
}
