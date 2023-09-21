package models

type Key struct {
	Id          uint   `json:"id"`
	Key         string `json:"key" gorm:"unique"`
	Environment string `json:"environment"`
	UserId      uint   `json:"user_id" gorm:"references:User.Id"`
	AppId       uint   `json:"app_id" gorm:"references:App.Id"`
}
