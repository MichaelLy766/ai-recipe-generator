import fs from 'fs';

// Create a mock configuration for build time
const mockConfig = {
  auth: {
    user_pool_id: "mock-user-pool-id",
    aws_region: "us-east-1",
    user_pool_client_id: "mock-client-id",
    identity_pool_id: "us-east-1:mock-identity-pool",
    mfa_configuration: "NONE",
    unauthenticated_identities_enabled: true
  },
  data: {
    url: "https://example.com/graphql",
    aws_region: "us-east-1",
    api_key: "mock-api-key-for-build",
    default_authorization_type: "API_KEY"
  },
  version: "1.4"
};

// Write the mock config file
fs.writeFileSync('amplify_outputs.json', JSON.stringify(mockConfig, null, 2));

console.log('Created mock amplify_outputs.json for build');