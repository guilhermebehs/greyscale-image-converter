resource "aws_sqs_queue" "queues" {
  count = length(var.queues_name)  
  name = var.queues_name[count.index]
}