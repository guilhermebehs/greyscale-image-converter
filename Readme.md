# Greyscale Image Converter

App that applies greyscale to a image and upload to Cloud.


## Solution

The app follows these 3 simple steps to achieve this goal:

* Receive image(JPEG or PNG) with up to 5MB of size
* Apply greyscale
* Upload to Amazon S3

The first step starts with a HTTP request and the other two are triggered asynchronously by a message broker. It uses RabbitMQ locally and Amazon SQS in production.

After upload is completed, an AWS Lambda is triggered and it uses Amazon SES to send an email warning that image has been converted and upload has done.

## Infra

Github Actions builds and deploys app in Amazon Elastic Beanstalk. Prometheus e Grafana are used to follow and analyze app's health and performance. Terraform is used to build AWS environment.



## Technical Overview

* Node JS 18.13.0
* Nest JS 9
* AWS
* Monitoring, observability and logging
* CI/CD
* Infraestructure as a code
* DI concepts
* Unit tests