// Enterprise Billing Service Configuration
// Compliant: All credentials loaded securely from environment variables

import 'dotenv/config';

export const APP_CONFIG = {
  serviceName: "BillingEngine",
  port: parseInt(process.env.PORT || "8080", 10),
  openAiApiKey: process.env.OPENAI_API_KEY,
  awsAccessKey: process.env.AWS_ACCESS_KEY_ID,
  databaseUrl: process.env.DATABASE_URL
};
