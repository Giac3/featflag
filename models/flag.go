package models

import "time"

type Flag struct {
	Id           uint      `json:"id"`
	Name         string    `json:"name"`
	Description  string    `json:"description"`
	Reference    string    `json:"reference" gorm:"unique"`
	Created      time.Time `json:"created"`
	Changed      time.Time `json:"changed"`
	DevState     bool      `json:"dev_state"`
	StagingState bool      `json:"staging_state"`
	ProdState    bool      `json:"prod_state"`
	AppId        uint      `json:"app_id" gorm:"references:App.Id;constraint:OnDelete:CASCADE;"`
}
