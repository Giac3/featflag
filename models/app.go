package models

import "time"

type App struct {
	Id          uint      `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	NumFlags    int32     `json:"numFlags"`
	Created     time.Time `json:"created"`
	ImgUrl      string    `json:"imgUrl"`
	UserId      uint      `json:"user_id" gorm:"references:User.Id"`
}
