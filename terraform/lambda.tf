resource "aws_iam_role" "send-email-lambda-role" {
  name = "send-email-lambda-role"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}


resource "aws_iam_role_policy" "send-email-lambda-policy" {
  name = "send-email-lambda-policy"
  role = aws_iam_role.send-email-lambda-role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "ses:SendEmail",
          "logs:*"
        ]
        Effect   = "Allow"
        Resource = "*"
      },
    ]
  })
}

resource "aws_lambda_function" "send-email" {
  filename      = "../aws-lambda/send-email-aws-lambda.zip"
  function_name = "send-email"
  role          = aws_iam_role.send-email-lambda-role.arn
  handler       = "send-email.invoke"
  runtime = "nodejs12.x"
}

resource "aws_lambda_permission" "send-email-lambda-permission" {
  statement_id  = "AllowS3Invoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.send-email.function_name
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.guilherme-bucket.arn
}


resource "aws_s3_bucket_notification" "send-email-lambda-trigger" {
  bucket = aws_s3_bucket.guilherme-bucket.id
  lambda_function {
    lambda_function_arn = aws_lambda_function.send-email.arn
    events              = ["s3:ObjectCreated:*"]
  }
}
