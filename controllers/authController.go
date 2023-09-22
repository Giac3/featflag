package controllers

import (
	"fmt"
	"modules/featflag/database"
	"modules/featflag/models"
	"net/http"
	"net/mail"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

const Secretkey = "secret"

type User struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func validEmail(email string) bool {
	_, err := mail.ParseAddress(email)
	return err == nil
}

func RegisterUser(ctx *gin.Context) {

	var registerUser User

	if err := ctx.ShouldBindJSON(&registerUser); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if registerUser.Email == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid email"})
		return
	}
	if !validEmail(registerUser.Email) {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid email"})
		return
	}
	if registerUser.Password == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid password"})
		return
	}

	password, _ := bcrypt.GenerateFromPassword([]byte(registerUser.Password), 14)
	user := models.User{
		Email:    registerUser.Email,
		Password: password,
	}

	if err := database.DB.Create(&user).First(&user).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Sorry there was an error creating your account"})
		return
	}

	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.RegisteredClaims{
		Issuer:    strconv.Itoa(int(user.Id)),
		ExpiresAt: &jwt.NumericDate{Time: time.Now().Add(time.Hour * 24)},
	})

	token, err := claims.SignedString([]byte(Secretkey))

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "error logging you in"})
		return
	}

	ctx.SetCookie("jwt", token, 86400, "/", "localhost", false, true)

	ctx.JSON(http.StatusOK, user)
}

func LogIn(ctx *gin.Context) {

	var loginUser User

	if err := ctx.ShouldBindJSON(&loginUser); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if loginUser.Email == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid email"})
		return
	}
	if !validEmail(loginUser.Email) {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid email"})
		return
	}
	if loginUser.Password == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid password"})
		return
	}

	password, _ := bcrypt.GenerateFromPassword([]byte(loginUser.Password), 14)

	user := models.User{
		Email:    loginUser.Email,
		Password: password,
	}

	if err := database.DB.Where("email = ?", loginUser.Email).First(&user).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Sorry there was an error logging you in"})
		return
	}

	if user.Id == 0 {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	if err := bcrypt.CompareHashAndPassword(user.Password, []byte(loginUser.Password)); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "your email/password was incorrect"})
		return
	}

	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.RegisteredClaims{
		Issuer:    strconv.Itoa(int(user.Id)),
		ExpiresAt: &jwt.NumericDate{Time: time.Now().Add(time.Hour * 24)},
	})

	token, err := claims.SignedString([]byte(Secretkey))

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "error logging you in"})
		return
	}

	ctx.SetCookie("jwt", token, 86400, "/", "localhost", false, true)

	ctx.JSON(http.StatusOK, gin.H{
		"status": "success",
		"user":   user,
	})
}

func Validate(ctx *gin.Context) {
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

	var user models.User

	if err := database.DB.Where("id = ?", claims.Issuer).First(&user).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Authentication Error"})
		return
	}

	ctx.JSON(http.StatusOK, user)
}

func LogOut(ctx *gin.Context) {
	ctx.SetCookie("jwt", "", -1, "/", "localhost", false, true)
	ctx.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Logged Out",
	})
}
