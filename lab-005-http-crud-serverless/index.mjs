import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = "http-curd-serverless-table"; // Replace with your actual DynamoDB table name

export const handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    switch (event.routeKey) {
      // ✅ CREATE (POST /items)
      case "POST /items":
        const requestJSON = JSON.parse(event.body);
        if (!requestJSON.id || !requestJSON.name || !requestJSON.price) {
          throw new Error("Missing id, name, or price");
        }

        await dynamo.send(
          new PutCommand({
            TableName: tableName,
            Item: {
              id: requestJSON.id,
              name: requestJSON.name,
              price: requestJSON.price,
            },
          })
        );
        body = { message: `Item ${requestJSON.id} created successfully`, item: requestJSON };
        break;

      // ✅ GET ALL ITEMS (GET /items)
      case "GET /items":
        const allItems = await dynamo.send(new ScanCommand({ TableName: tableName }));
        body = allItems.Items || [];
        break;

      // ✅ GET SINGLE ITEM (GET /items/{id})
      case "GET /items/{id}":
        const singleItem = await dynamo.send(
          new GetCommand({
            TableName: tableName,
            Key: { id: event.pathParameters.id },
          })
        );
        if (!singleItem.Item) {
          throw new Error(`Item with id ${event.pathParameters.id} not found`);
        }
        body = singleItem.Item;
        break;

      // ✅ UPDATE ITEM PARTIALLY (PATCH /items/{id})
      case "PATCH /items/{id}":
        const updateBody = JSON.parse(event.body);
        const updateExpressions = [];
        const expressionAttributes = {};

        if (updateBody.name) {
          updateExpressions.push("name = :name");
          expressionAttributes[":name"] = updateBody.name;
        }
        if (updateBody.price) {
          updateExpressions.push("price = :price");
          expressionAttributes[":price"] = updateBody.price;
        }

        if (updateExpressions.length === 0) {
          throw new Error("No valid fields to update");
        }

        await dynamo.send(
          new UpdateCommand({
            TableName: tableName,
            Key: { id: event.pathParameters.id },
            UpdateExpression: `SET ${updateExpressions.join(", ")}`,
            ExpressionAttributeValues: expressionAttributes,
          })
        );

        body = { message: `Item ${event.pathParameters.id} updated successfully` };
        break;

      // ✅ REPLACE ENTIRE ITEM (PUT /items/{id})
      case "PUT /items/{id}":
        const putBody = JSON.parse(event.body);
        if (!putBody.name || !putBody.price) {
          throw new Error("Missing name or price");
        }

        await dynamo.send(
          new PutCommand({
            TableName: tableName,
            Item: {
              id: event.pathParameters.id,
              name: putBody.name,
              price: putBody.price,
            },
          })
        );

        body = { message: `Item ${event.pathParameters.id} replaced`, item: putBody };
        break;

      // ✅ DELETE ITEM (DELETE /items/{id})
      case "DELETE /items/{id}":
        await dynamo.send(
          new DeleteCommand({
            TableName: tableName,
            Key: { id: event.pathParameters.id },
          })
        );
        body = { message: `Item ${event.pathParameters.id} deleted successfully` };
        break;

      //  UNSUPPORTED ROUTE
      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = { error: err.message };
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};
