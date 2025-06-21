import { Client, Storage } from 'appwrite';

const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const storage = new Storage(client);

export const BUCKET_ID = process.env.NEXT_PUBLIC_BUCKET_ID!;

export { client };
