package database

import (
	"log"
	"modules/featflag/models"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {

	var envs map[string]string
	envs, err := godotenv.Read(".env")

	if err != nil {
		log.Fatal("Error loading .env file")
	}

	db_host := envs["DB_HOST"]
	db_user := envs["DB_USER"]
	db_password := envs["DB_PASSWORD"]
	db_name := envs["DB_NAME"]
	db_port := envs["DB_PORT"]

	dsn := "host=" + db_host + " user=" + db_user + " password=" + db_password + " dbname=" + db_name + " port=" + db_port

	connection, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		panic("could not connect to postgres")
	}

	DB = connection

	connection.AutoMigrate(&models.User{})
	connection.AutoMigrate(&models.App{})
	connection.AutoMigrate(&models.Flag{})
	connection.AutoMigrate(&models.Key{})
}
