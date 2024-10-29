# Professional Website Builder

This application allows users to create professional websites easily. Below is a description of the user journeys and steps:

## User Journeys

### 1. Sign In with ZAPT

1. **Open the App**: The user opens the Professional Website Builder app.
2. **Sign In**: The user is presented with a "Sign in with ZAPT" prompt and can sign in using email (magic link) or social providers like Google, Facebook, or Apple.
3. **Authentication**: Upon successful authentication, the user is redirected to the main dashboard.

### 2. Create a New Website

1. **Dashboard**: After signing in, the user lands on the dashboard where they can see existing projects or create a new one.
2. **Create New Project**: The user clicks on "Create New Website" button.
3. **Choose Template**: The user is presented with a selection of professional templates to choose from.
4. **Customize Content**: After selecting a template, the user can customize text, images, and other content within the template using a user-friendly editor.
5. **Generate Suggestions**: The user can click on "Generate Content" to get AI-generated suggestions for headings, paragraphs, or images.
6. **Preview Website**: The user can preview the website to see how it looks on different devices.
7. **Publish Website**: Once satisfied, the user can publish the website, which provides them with a shareable link.

### 3. Manage Existing Websites

1. **View Projects**: On the dashboard, the user can view all their existing websites.
2. **Edit Website**: The user can select any website to edit its content or settings.
3. **Delete Website**: The user can delete any unwanted websites.
4. **Sign Out**: The user can sign out from their account at any time.

## External APIs Used

- **ChatGPT API (via createEvent)**: Used to generate content suggestions for headings, paragraphs, and image descriptions.
- **Progressier**: Used for adding PWA support to the app.

## Environment Variables

- `VITE_PUBLIC_SENTRY_DSN`: Sentry DSN for error logging.
- `VITE_PUBLIC_APP_ENV`: Environment (e.g., production, development).
- `VITE_PUBLIC_APP_ID`: Unique app ID for ZAPT integration.
