resource "aws_ses_email_identity" "email_from" {
  count = length(var.ses_emails)
  email = var.ses_emails[count.index]
}