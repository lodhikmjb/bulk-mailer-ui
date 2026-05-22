import smtplib

server = smtplib.SMTP("smtp.gmail.com", 587)

server.starttls()

server.login(
"rickardsr14@gmail.com",
"cxwfkjpycxzralkw"
)

server.sendmail(
"lodhikmjb@gmail.com",
"lodhikmjb@gmail.com",
"Subject: Test Mail\n\nHello from Python"
)

print("Mail Sent")

server.quit()
