variable "aws_region" {
    default = "us-east-1"
}

variable "bucket_name" {
    default = "guilherme-bucket"
}

variable "queues_name" {
    type = list
    default = ["image-received", "upload-image"]
}

variable "ses_emails" {
    type = list
    default = ["saintjimmyrs@hotmail.com","guilhermebehs2013@hotmail.com"]
}

variable "app-name" {
    type = string
    default = "greyscale-image-converter"
}