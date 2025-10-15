// GraphQL Query Helper
async function graphqlQuery(query: string, variables?: any) {
  const res = await fetch("/api/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
}

// Styles
const styles = {
  container: "padding: 20px; font-family: system-ui, sans-serif; max-width: 800px;",
  title: "color: #333; margin-bottom: 20px; text-align: left;",
  results: "margin: 20px 0; padding: 20px; background: #1e1e1e; border-radius: 8px; min-height: 150px; color: #e0e0e0; font-size: 14px; overflow-x: auto;",
  buttons: "display: flex; gap: 10px; flex-wrap: wrap;",
  button: "padding: 12px 24px; cursor: pointer; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: 500;",
};

export function setupApp(element: HTMLButtonElement) {
  const container = document.createElement("div");
  container.style.cssText = styles.container;

  // Title
  const title = document.createElement("h2");
  title.textContent = "Nitro + Vite + GraphQL";
  title.style.cssText = styles.title;
  container.appendChild(title);

  // Results Display
  const results = document.createElement("div");
  results.style.cssText = styles.results;
  results.innerHTML = "<em style='color: #888;'>Results will appear here...</em>";
  container.appendChild(results);

  // Show Results
  const showResult = (data: any, label: string, color: string) => {
    results.innerHTML = `<strong style="color: ${color}; display: block; margin-bottom: 10px;">✓ ${label}:</strong><pre style="background: #2d2d2d; color: #e0e0e0; padding: 15px; border-radius: 5px; font-size: 13px; border: 1px solid #3d3d3d;">${JSON.stringify(data, null, 2)}</pre>`;
  };

  const showError = (error: any) => {
    results.innerHTML = `<strong style="color: #ff6b6b;">✗ Error:</strong><pre style="color: #ff6b6b; margin-top: 10px;">${error}</pre>`;
  };

  // Buttons Container
  const buttonsDiv = document.createElement("div");
  buttonsDiv.style.cssText = styles.buttons;

  // Button Helper
  const createButton = (text: string, color: string, onClick: () => void) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.style.cssText = `${styles.button}; background: ${color};`;
    btn.addEventListener("click", onClick);
    buttonsDiv.appendChild(btn);
  };

  // Get User Button
  createButton("Get User (ID: 1)", "#4CAF50", async () => {
    try {
      results.innerHTML = "<em style='color: #888;'>Loading...</em>";
      const data = await graphqlQuery(`
        query GetUser($id: ID!) {
          getUser(id: $id) { id email name createdAt }
        }
      `, { id: "1" });
      showResult(data, "Query Result", "#4CAF50");
    } catch (error) {
      showError(error);
    }
  });

  // Create User Button
  createButton("Create New User", "#2196F3", async () => {
    try {
      results.innerHTML = "<em style='color: #888;'>Creating...</em>";
      const randomId = Math.floor(Math.random() * 10000);
      const data = await graphqlQuery(`
        mutation CreateUser($input: CreateUserInput!) {
          createUser(input: $input) { id email name createdAt }
        }
      `, {
        input: {
          email: `user${randomId}@example.com`,
          name: `Demo User ${randomId}`,
        },
      });
      showResult(data, "Mutation Result", "#2196F3");
    } catch (error) {
      showError(error);
    }
  });

  // Get All Users Button
  createButton("Get All Users", "#FF9800", async () => {
    try {
      results.innerHTML = "<em style='color: #888;'>Loading all...</em>";
      const users = await Promise.all([
        graphqlQuery(`query { getUser(id: "1") { id email name createdAt } }`),
        graphqlQuery(`query { getUser(id: "2") { id email name createdAt } }`),
      ]);
      showResult(users, "All Users", "#FF9800");
    } catch (error) {
      showError(error);
    }
  });

  container.appendChild(buttonsDiv);
  element.appendChild(container);
}
