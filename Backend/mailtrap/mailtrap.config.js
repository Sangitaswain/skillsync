
import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({ path: './Backend/.env' });

// Ensure MAILTRAP_TOKEN and MAILTRAP_ENDPOINT are defined
const { MAILTRAP_TOKEN, MAILTRAP_ENDPOINT } = process.env;

if (!MAILTRAP_TOKEN || !MAILTRAP_ENDPOINT) {
  throw new Error("MAILTRAP_TOKEN or MAILTRAP_ENDPOINT is not defined in your environment variables");
}

// Initialize Mailtrap Client
export const mailtrapClient = new MailtrapClient({
  endpoint: MAILTRAP_ENDPOINT,
  token: MAILTRAP_TOKEN,
});

// Define sender information
export const sender = {
  email: "hello@demomailtrap.com",
  name: "Sangita",
};
