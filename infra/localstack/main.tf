module "vpc" {
  source = "./modules/vpc"
}

module "dynamodb" {
  source = "./modules/dynamodb"
}