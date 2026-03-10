terraform {
    required_providers {
        aws = {
            source  = "hashicorp/aws"
            version = "~> 5.0"
        }
    }
}

provider "aws" {
    region = "us-east-1"
}

# Small EC2 Instance
resource "aws_instance" "small_ec2" {
    ami           = "ami-0c55b159cbfafe1f0"
    instance_type = "t2.micro"

    tags = {
        Name = "small-ec2-instance"
    }
}

# Small S3 Bucket
resource "aws_s3_bucket" "small_storage" {
    bucket = "my-small-bucket-${data.aws_caller_identity.current.account_id}"

    tags = {
        Name = "small-storage-bucket"
    }
}

# Data source to get AWS Account ID
data "aws_caller_identity" "current" {}

# Outputs
output "ec2_instance_id" {
    value = aws_instance.small_ec2.id
}

output "s3_bucket_name" {
    value = aws_s3_bucket.small_storage.id
}