# Professional Website Builder

This application allows users to create professional websites easily without the need to sign in. Below is a description of the user journeys and steps:

## User Journeys

### 1. Create a New Website

1. **Open the App**: The user opens the Professional Website Builder app.
2. **Choose Template**: The user is presented with a selection of professional templates to choose from.
3. **Customize Content**: After selecting a template, the user can customize text, images, and other content within the template using a user-friendly editor.
4. **Generate Suggestions**: The user can click on "Generate Content" to get AI-generated suggestions for headings, paragraphs, or images.
5. **Preview Website**: The user can preview the website to see how it looks on different devices.
6. **Publish Website**: Once satisfied, the user can publish the website, which provides them with a shareable link.

### 2. Manage Existing Websites

1. **View Projects**: On the main page, the user can view all their existing websites stored locally.
2. **Edit Website**: The user can select any website to edit its content or settings.
3. **Delete Website**: The user can delete any unwanted websites.

## External APIs Used

- **ChatGPT API (via createEvent)**: Used to generate content suggestions for headings, paragraphs, and image descriptions.
- **Progressier**: Used for adding PWA support to the app.

## Environment Variables

- `VITE_PUBLIC_SENTRY_DSN`: Sentry DSN for error logging.
- `VITE_PUBLIC_APP_ENV`: Environment (e.g., production, development).
- `VITE_PUBLIC_APP_ID`: Unique app ID for ZAPT integration.