import { PutCommand, GetCommand, ScanCommand, DeleteCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { docClient } from '../config/aws.js';
import { v4 as uuidv4 } from 'uuid';

const TABLE_NAME = process.env.DYNAMODB_TABLE;

export const TodoModel = {
  async create(data) {
    if (!TABLE_NAME) {
      throw new Error('DynamoDB table name is not configured');
    }

    const todo = {
      id: uuidv4(),
      title: data.title,
      description: data.description,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    try {
      await docClient.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: todo,
      }));

      return todo;
    } catch (error) {
      console.error('Error creating todo:', error);
      throw new Error('Failed to create todo item');
    }
  },

  async getAll() {
    if (!TABLE_NAME) {
      throw new Error('DynamoDB table name is not configured');
    }

    try {
      const result = await docClient.send(new ScanCommand({
        TableName: TABLE_NAME,
      }));

      return result.Items;
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw new Error('Failed to fetch todo items');
    }
  },

  async update(id, data) {
    if (!TABLE_NAME) {
      throw new Error('DynamoDB table name is not configured');
    }

    try {
      const params = {
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set #title = :title, #description = :description, #status = :status',
        ExpressionAttributeNames: {
          '#title': 'title',
          '#description': 'description',
          '#status': 'status',  // Use a placeholder for the reserved word "status"
        },
        ExpressionAttributeValues: {
          ':title': data.title,
          ':description': data.description,
          ':status': data.status,
        },
        ReturnValues: 'ALL_NEW',
      };

      const result = await docClient.send(new UpdateCommand(params));
      return result.Attributes;
    } catch (error) {
      console.error('Error updating todo:', error);
      throw new Error('Failed to update todo item');
    }
  },

  async delete(id) {
    if (!TABLE_NAME) {
      throw new Error('DynamoDB table name is not configured');
    }

    try {
      await docClient.send(new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id },
      }));
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw new Error('Failed to delete todo item');
    }
  },
};
