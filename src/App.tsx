import { FormEvent, useState } from "react";
import { Loader, Placeholder } from "@aws-amplify/ui-react";
import "./App.css";
import { Amplify } from 'aws-amplify'; 
import { generateClient } from "aws-amplify/api";
import { Schema } from "./API.js";
import outputs from "../amplify_outputs.json";

import "@aws-amplify/ui-react/styles.css";

Amplify.configure({
  ...outputs,
  API: {
    GraphQL: {
      endpoint: outputs.data?.url,
      region: outputs.data?.aws_region,
      apiKey: outputs.data?.api_key,
    },
  },
});

const amplifyClient = generateClient<Schema>({
  authMode: "userPool"
});

function App() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      
      // Convert the comma-separated string to an array
      const ingredientsString = formData.get("ingredients")?.toString() || "";
      const ingredientsArray = ingredientsString.split(",").map(item => item.trim());
      
      console.log("Sending ingredients:", ingredientsArray);
      
      // Add the debug logs here
      console.log("API Key configured:", !!outputs.data?.api_key);
      console.log("Current API Key:", outputs.data?.api_key?.substring(0, 5) + "..."); // Only show beginning for security
      console.log("API Configuration:", {
        endpoint: outputs.data?.url,
        region: outputs.data?.aws_region,
        authMode: "apiKey"
      });
      
      // Now make the API call
      try {
        // Create a graphql client
        const client = generateClient();
        
        // Call the API using the client
        const response = await client.graphql({
          query: `
            query AskBedrock($ingredients: [String!]) {
              askBedrock(ingredients: $ingredients) {
                body
                error
              }
            }
          `,
          variables: {
            ingredients: ingredientsArray
          },
          authMode: "userPool"
        });
        
        console.log("Raw response:", response);
        
        const result = response.data?.askBedrock;
        
        if (result) {
          console.log("Received data:", result);
          setResult(result.body || "No data returned");
        } else {
          console.error("No data in response:", response);
          setResult("No data returned");
        }
      } catch (e) {
        console.error("GraphQL exception:", e);
        setResult(`An error occurred: ${e}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="header-container">
        <h1 className="main-header">
          Meet Your Personal
          <br />
          <span className="highlight">Recipe AI</span>
        </h1>
        <p className="description">
          Simply type a few ingredients using the format ingredient1,
          ingredient2, etc., and Recipe AI will generate an all-new recipe on
          demand...
        </p>
      </div>
      <form onSubmit={onSubmit} className="form-container">
        <div className="search-container">
          <input
            type="text"
            className="wide-input"
            id="ingredients"
            name="ingredients"
            placeholder="Ingredient1, Ingredient2, Ingredient3,...etc"
          />
          <button type="submit" className="search-button">
            Generate
          </button>
        </div>
      </form>
      <div className="result-container">
        {loading ? (
          <div className="loader-container">
            <p>Loading...</p>
            <Loader size="large" />
            <Placeholder size="large" />
            <Placeholder size="large" />
            <Placeholder size="large" />
          </div>
        ) : (
          result && <p className="result">{result}</p>
        )}
      </div>
    </div>
  );
}

export default App;