# **Serverless CRUD API with AWS Lambda, API Gateway & DynamoDB** 🚀

## **📌 Project Overview**
This project demonstrates how to build a **fully serverless REST API** using:
- **AWS Lambda** for backend logic
- **Amazon API Gateway** for exposing endpoints
- **Amazon DynamoDB** as a NoSQL database
- **AWS CLI** for deployment & management

The API allows users to **Create, Read, Update, and Delete (CRUD) items** without managing any servers. Everything is **fully scalable** and follows best practices for **serverless architecture.**

---
## **📂 Project Structure**
```
lab-005-http-crud-serverless/
│── index.mjs              # Lambda function code
│── package.json           # Dependencies
│── README.md              # Documentation
│── lambda.zip             # Packaged Lambda code (for deployment)
```

---
## **🛠 Step 1: Provision AWS Resources**

### **🔹 1️⃣ Create a DynamoDB Table**
```bash
aws dynamodb create-table \
--table-name http-crud-serverless-table \
--attribute-definitions AttributeName=id,AttributeType=S \
--key-schema AttributeName=id,KeyType=HASH \
--billing-mode PAY_PER_REQUEST \
--region ap-south-1
```
📌 **Why?** This creates a highly scalable NoSQL table to store API data.

---
### **🔹 2️⃣ Deploy AWS Lambda Function**

1️⃣ **Install dependencies:**
```bash
npm install
```

2️⃣ **Zip and deploy the function:**
```bash
zip -r lambda.zip index.mjs package.json node_modules
aws lambda create-function --function-name http-crud-serverless-function \
--runtime nodejs22.x --role YOUR_LAMBDA_ROLE_ARN \
--handler index.handler --zip-file fileb://lambda.zip --region ap-south-1
```
📌 **Why?** This deploys the backend logic, which handles CRUD operations.

---
### **🔹 3️⃣ Set Up API Gateway**
```bash
aws apigatewayv2 create-api --name "http-crud-serverless-api" \
--protocol-type HTTP --region ap-south-1
```
📌 **Why?** This exposes the Lambda function via RESTful HTTP endpoints.

---
## **🔬 Step 2: Test the API**
### **✅ Create an Item (POST /items)**
```bash
curl -X POST -H "Content-Type: application/json" \
-d '{"id": "101", "name": "Laptop", "price": 1200}' \
https://YOUR_API_URL/items
```

### **✅ Get All Items (GET /items)**
```bash
curl -X GET https://YOUR_API_URL/items
```

### **✅ Get a Single Item (GET /items/{id})**
```bash
curl -X GET https://YOUR_API_URL/items/101
```

### **✅ Update an Item (PATCH /items/{id})**
```bash
curl -X PATCH -H "Content-Type: application/json" \
-d '{"price": 1500}' \
https://YOUR_API_URL/items/101
```

### **✅ Delete an Item (DELETE /items/{id})**
```bash
curl -X DELETE https://YOUR_API_URL/items/101
```

📌 **Why?** These commands allow testing of all CRUD operations.

---
## **🗑 Step 3: Clean Up Resources**
To avoid AWS charges, delete unused resources:

🗑 **Delete API Gateway:**
```bash
aws apigatewayv2 delete-api --api-id YOUR_API_ID
```

🗑 **Delete Lambda Function:**
```bash
aws lambda delete-function --function-name http-crud-serverless-function
```

🗑 **Delete DynamoDB Table:**
```bash
aws dynamodb delete-table --table-name http-crud-serverless-table
```

🗑 **Delete CloudWatch Logs:**
```bash
aws logs delete-log-group --log-group-name /aws/lambda/http-crud-serverless-function
```

📌 **Why?** This prevents unnecessary AWS costs after completing the project.

---
## **🎯 Quiz: Test Your Knowledge!**

### **1️⃣ What is the purpose of API Gateway in this setup?**
A) To directly store and retrieve data from DynamoDB  
B) To expose Lambda functions as REST API endpoints  
C) To manage IAM roles for Lambda  
D) To provide a UI for DynamoDB  

### **2️⃣ What happens when `DELETE /items/{id}` is called for a non-existing item?**
A) Returns `400 Bad Request`  
B) Returns `404 Not Found`  
C) Returns `200 OK` with `{ "message": "Item deleted" }`  
D) Crashes the API  

### **3️⃣ Why does Lambda use `ScanCommand` for `GET /items`?**
A) To retrieve a single item  
B) To scan all records in DynamoDB  
C) To delete items in the database  
D) To create a new item  

### **4️⃣ What AWS CLI command can confirm data is stored in DynamoDB?**
A) `aws s3 ls`  
B) `aws lambda list-functions`  
C) `aws dynamodb scan --table-name http-crud-serverless-table`  
D) `aws ec2 describe-instances`  

---
## **✅ Quiz Answers & Explanations**

**1️⃣ Answer: B** → API Gateway acts as a bridge to expose Lambda as a REST API.  
**2️⃣ Answer: C** → DELETE is idempotent, so it returns success even if the item doesn’t exist.  
**3️⃣ Answer: B** → `ScanCommand` retrieves all items in the DynamoDB table.  
**4️⃣ Answer: C** → The `scan` command retrieves all stored data in DynamoDB.  

---
## **🎯 Conclusion**
This project successfully demonstrates **building, testing, and cleaning up a fully serverless API** using AWS services. It covers:
✅ **AWS Lambda for backend logic**  
✅ **API Gateway for exposing APIs**  
✅ **DynamoDB for NoSQL storage**  
✅ **Best practices for provisioning & cleanup**  

🔹 **Want to contribute?** Fork the repo & enhance the API further! 🔥  
🔹 **Questions?** Feel free to reach out! 🚀  

