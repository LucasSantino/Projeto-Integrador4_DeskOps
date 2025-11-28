terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "4.48.0"
    }
  }
}

provider "azurerm" {
  subscription_id = "250ae9c3-6c33-4030-b72a-ed22fce22920"

  features {}
}

resource "azurerm_resource_group" "victor_ribeiro_test_rg" {
  name     = "victor_ribeiro_test_rg"
  location = "West Europe"
}


resource "azurerm_service_plan" "victor_ribeiro_test_sp"{
  name= "victor_ribeiro_test_sp"
  resource_group_name = azurerm_resource_group.victor_ribeiro_test_rg.name
  location = azurerm_resource_group.victor_ribeiro_test_rg.location
  sku_name = "S1"
  os_type = "Windows"
}

resource "azurerm_windows_web_app" "app" {
  name                = " "
  resource_group_name = azurerm_resource_group.victor_ribeiro_test_rg.name
  location            = azurerm_resource_group.victor_ribeiro_test_rg.location
  service_plan_id     = azurerm_service_plan.victor_ribeiro_test_sp.id

  site_config {
    always_on = true
  }

  app_settings = {
    "WEBSITE_RUN_FROM_PACKAGE" = "1"
  }
}
