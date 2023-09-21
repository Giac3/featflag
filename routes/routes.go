package routes

import (
	"modules/featflag/controllers"

	"github.com/gin-gonic/gin"
)

func SetUp(router *gin.Engine) {
	router.POST("/api/auth/register", controllers.RegisterUser)
	router.POST("/api/auth/login", controllers.LogIn)
	router.GET("/api/auth/validate", controllers.Validate)
	router.GET("/api/auth/logout", controllers.LogOut)
	router.POST("/api/apps", controllers.CreateApp)
	router.GET("/api/apps", controllers.GetApps)
	router.PUT("/api/apps/:app_id", controllers.EditApp)
	router.DELETE("/api/apps/:app_id", controllers.DeleteApp)
	router.POST("/api/flags/:app_id", controllers.CreateFlag)
	router.GET("/api/flags/:app_id", controllers.GetFlags)
	router.PUT("/api/flags/:flag_id/:env", controllers.UpdateFlagState)
	router.PUT("/api/flags/edit/:flag_id", controllers.EditFlag)
	router.DELETE("/api/flags/:app_id/:flag_id", controllers.DeleteFlag)
	router.GET("/api/keys/:app_id", controllers.GetKeys)
	router.DELETE("/api/keys/:key_id", controllers.DeleteKey)
	router.POST("/api/keys/:app_id/:env", controllers.CreateKey)

	router.GET("/check/:flag_ref", controllers.CheckFlag)
}
