provider "aws" {
  region = "us-east-2"
}

# https://chrisdecairos.ca/s3-objects-terraform/
locals {
  src_dir = "../build"
  content_type_map = {
    html = "text/html",
    js   = "application/javascript",
    css  = "text/css",
    svg  = "image/svg+xml",
    jpg  = "image/jpeg",
    ico  = "image/x-icon",
    png  = "image/png",
    gif  = "image/gif",
    pdf  = "application/pdf"
  }
}

variable "gitid" {
  type = string
}

variable "bucket_name" {
  default = "alnn-dash"
}

resource "aws_s3_bucket" "react_bucket" {
  bucket = "${var.bucket_name}-${var.gitid}"
  acl    = "public-read"

  policy = <<EOF
{
  "Id": "bucket_policy_site",
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "bucket_policy_site_main",
      "Action": [
        "s3:GetObject"
      ],
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::${var.bucket_name}-${var.gitid}/*",
      "Principal": "*"
    }
  ]
}
EOF

  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

# https://chrisdecairos.ca/s3-objects-terraform/
resource "aws_s3_bucket_object" "build_directory" {
  for_each     = fileset("${local.src_dir}", "**/*")
  bucket       = aws_s3_bucket.react_bucket.id
  key          = each.value
  source       = "${local.src_dir}/${each.value}"
  content_type = lookup(local.content_type_map, regex("\\.(?P<extension>[A-Za-z0-9]+)$", each.value).extension, "application/octet-stream")
}
