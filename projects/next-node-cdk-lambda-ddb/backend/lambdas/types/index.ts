export interface Item {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DynamoDBItem {
  PK: string;  // ITEM#{id}
  SK: string;  // METADATA
  GSI1PK: string;  // ITEM
  GSI1SK: string;  // createdAt timestamp
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface APIResponse<T = any> {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}
