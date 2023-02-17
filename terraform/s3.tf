resource "aws_s3_bucket" "guilherme-bucket" {
    bucket = var.bucket_name
    acl = "private"
    tags = {
        Name = var.bucket_name
    }
}