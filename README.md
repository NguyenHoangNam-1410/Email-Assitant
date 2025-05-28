# AI Email Adjustment Assistant

This is an AI-powered email adjustment application that helps rewrite or refine email content with a chosen tone and recipient context. The application consists of a Spring Boot backend and a React frontend, and is designed to integrate with a Google Chrome Extension.

---

##  Project Structure

- **Backend:** Spring Boot + AI service (Java)
- **Frontend:** React + Material UI (JavaScript)
- **Extension Support:** Google Chrome Extension (in progress)

---

##  Getting Started

### 🔧 Backend Setup (Spring Boot)
1. Open the project in **IntelliJ IDEA**.
2. Run the `main` class to start the Spring Boot server.
3. The backend will run on `http://localhost:8080`.

###  Frontend Setup (React)
1. Open the `frontend` folder in **VS Code** or your preferred editor.
2. Install dependencies:
   ```bash
   npm install
3. Start the development server:
   ```bash
   npm run dev
4. The app runs on:  `http://localhost:5173`

### Chrome Extension Setup

1. Navigate to the chrome-extension folder in your project.
2. Open Google Chrome and go to chrome://extensions/.
3. Enable Developer mode (toggle in the top right).
4. Click "Load unpacked" and select the chrome-extension folder.
5. The extension will appear in your extensions toolbar.
Important: Make sure your backend server is running on http://localhost:8080 before using the extension.

### Using the Chrome Extension:

1. Open Gmail and click "Compose" to write a new email.
2. You'll see an "AI Update" button in the compose toolbar.
3. Type your draft email content in the compose box.
4. Click the "AI Update" button to enhance your email with AI.
5. The extension will send your content to the backend and replace it with the improved version.



---

##  Features

-  Rewrite email content using AI
-  Select tone (e.g. Friendly, Professional, Casual)
-  Include receiver context (e.g. Client, Boss, HR)
-  Light/Dark theme support
-  Copy-to-clipboard and Clear button
-  Chrome Extension support (in progress)
-  Chrome Extension integration - Works directly in Gmail!
-  Real-time email enhancement - No need to copy/paste between apps

---

##  Tech Stack

- **Frontend:** React, Vite, Material UI
- **Backend:** Spring Boot, Java, Chrome Extension APIs
- **HTTP Client:** Axios, Fetch API (Extension)

---

##  Example Usage
### Web Application:
  1. Paste your raw email into the editor.
  2. Choose a tone like **"friendly"** or **"professional"**.
  3. Optionally enter who you're writing to (receiver).
  4. Click **Fix Email**.
  5. Copy the generated result or start over!

### Chrome Extension:
  1. Open Gmail and start composing an email.
  2. Write your draft email in the compose box.
  3. Click the "AI Update" button in the toolbar.
  4. Watch as your email is automatically enhanced with AI!

---

## Extension Architecture
### The Chrome Extension consists of:

- manifest.json - Extension configuration and permissions
- content.js - Script injected into Gmail pages
- Background scripts - Handle extension lifecycle
- Gmail Integration - Detects compose boxes and injects AI functionality

## Key Features:

-  Smart Gmail Detection - Automatically finds compose boxes
-  Real-time Content Reading - Reads your draft email content
-  Seamless Content Replacement - Replaces text without losing formatting
-  Error Handling - Graceful fallbacks if something goes wrong

---

## Security & Privacy

- Local Processing: All email content is processed locally through your backend
- No Data Storage: The extension doesn't store or log your email content
- Secure Communication: Uses localhost API calls to your own backend
- Minimal Permissions: Only requests necessary Gmail access permissions

---

## Troubleshooting
### Extension Issues:

- Button not appearing: Refresh Gmail and ensure the extension is enabled
- "Generation failed" error: Check that your backend is running on http://localhost:8080
- Content not replacing: Try clicking in the compose box first, then click AI Update

### Backend Issues:

- API errors: Ensure your AI service configuration is correct
- CORS issues: Backend includes CORS configuration for localhost origins

---

##  Contributing

Contributions are welcome! Feel free to fork the repo, submit issues, or open pull requests.
