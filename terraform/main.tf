# # Small EC2 Instance
# data "aws_caller_identity" "current" {}

# resource "aws_instance" "small_ec2" {
#     ami           = "ami-003ff0e12738bdf26"
#     instance_type = "t2.micro"

#     tags = {
#         Name = "small-ec2-instance"
#     }
# }

# # Small S3 Bucket
# resource "aws_s3_bucket" "small_storage" {
#     bucket = "my-small-bucket-${data.aws_caller_identity.current.account_id}-testing"

#     tags = {
#         Name = "small-storage-bucket"
#     }
# }


resource "aws_ecr_repository" "myapp" {
  name                 = "manoj-ecr-repo"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

