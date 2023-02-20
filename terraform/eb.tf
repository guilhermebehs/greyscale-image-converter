resource "aws_elastic_beanstalk_application" "greyscale-image-converter-app" {
  name        = "${var.app-name}-app"
  description = "${var.app-name}-app"
  depends_on = [aws_sqs_queue.queues, aws_s3_bucket.guilherme-bucket]
}

resource "aws_elastic_beanstalk_environment" "greyscale-image-converter-env" {
  name                = "${var.app-name}-env"
  application         = aws_elastic_beanstalk_application.greyscale-image-converter-app.name
  solution_stack_name = "64bit Amazon Linux 2 v3.5.4 running Docker"
  depends_on = [aws_elastic_beanstalk_application.greyscale-image-converter-app]

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = "aws-elasticbeanstalk-ec2-role"
  }

  setting {
    namespace = "aws:ec2:instances"
    name      = "InstanceTypes"
    value     = "t2.medium"
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "IMAGE_RECEIVED_SQS_URL"
    value     = aws_sqs_queue.queues[0].id
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "UPLOAD_IMAGE_SQS_URL"
    value     = aws_sqs_queue.queues[1].id
  }


  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "NODE_ENV"
    value     = "production"
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "AWS_BUCKET_NAME"
    value     = var.bucket_name
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "AWS_REGION"
    value     = var.aws_region
  }
}