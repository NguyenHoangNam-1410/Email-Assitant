console.log("Mail Writer Extension - Content Script Loaded");

// Get the content from the Gmail compose box
function getEmailContent() {
  const selectors = [
    '[role="textbox"][g_editable="true"]', // Primary Gmail compose textbox
    '.Am.aiL.Al.editable.LW-avf.tS-tW', // Alternative Gmail compose area
    '[contenteditable="true"][role="textbox"]', // Generic contenteditable textbox
    '.editable[contenteditable="true"]', // Another common pattern
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      // Get both text content and HTML content for better handling
      const textContent = element.innerText || element.textContent || '';
      console.log("Found email content:", textContent.substring(0, 100) + "...");
      return textContent.trim();
    }
  }

  console.log("No email content found");
  return '';
}

// Find the Gmail compose toolbar
function findComposeToolbar() {
  const selectors = [
    ".btC", // Gmail compose toolbar
    ".aDh", // Alternative toolbar selector
    '[role="toolbar"]', // Generic toolbar
    ".gU.Up", // Another Gmail toolbar pattern
    ".Am.Al.editable + .aoD", // Toolbar adjacent to compose area
  ];

  for (const selector of selectors) {
    const toolbar = document.querySelector(selector);
    if (toolbar) {
      console.log("Found toolbar with selector:", selector);
      return toolbar;
    }
  }

  console.log("No toolbar found");
  return null;
}

// Find the Gmail compose textbox
function findComposeTextbox() {
  const selectors = [
    '[role="textbox"][g_editable="true"]',
    '[contenteditable="true"][role="textbox"]',
    '.Am.aiL.Al.editable.LW-avf.tS-tW',
    '.editable[contenteditable="true"]',
    'div[contenteditable="true"][dir="ltr"]'
  ];

  for (const selector of selectors) {
    const textbox = document.querySelector(selector);
    if (textbox) {
      console.log("Found compose textbox with selector:", selector);
      return textbox;
    }
  }

  console.log("No compose textbox found");
  return null;
}

// Clear and replace content in the compose box
function replaceEmailContent(composeBox, newContent) {
  if (!composeBox) {
    console.error("No compose box provided");
    return false;
  }

  try {
    // Method 1: Select all and replace (most reliable)
    composeBox.focus();

    // Clear existing content by selecting all
    document.execCommand('selectAll', false, null);

    // Insert new content
    const success = document.execCommand('insertText', false, newContent);

    if (success) {
      console.log("Content replaced successfully using execCommand");
      return true;
    }

    // Method 2: Direct manipulation (fallback)
    composeBox.innerHTML = '';
    composeBox.textContent = newContent;

    // Trigger input events to notify Gmail of changes
    const inputEvent = new Event('input', { bubbles: true });
    const changeEvent = new Event('change', { bubbles: true });
    composeBox.dispatchEvent(inputEvent);
    composeBox.dispatchEvent(changeEvent);

    console.log("Content replaced using direct manipulation");
    return true;

  } catch (error) {
    console.error("Error replacing content:", error);

    // Method 3: Last resort - direct innerHTML
    try {
      composeBox.innerHTML = newContent.replace(/\n/g, '<br>');
      return true;
    } catch (finalError) {
      console.error("All content replacement methods failed:", finalError);
      return false;
    }
  }
}

// Create AI Reply button
function createAiButton() {
  const button = document.createElement("div");
  button.className = "T-I J-J5-Ji ao0 v7 T-I-atl L3 ai-adjust-button";
  button.style.cssText = `
    margin-right: 8px;
    cursor: pointer;
    user-select: none;
    background-color: #1a73e8;
    color: white;
    border-radius: 4px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
  `;
  button.innerText = "AI Update";
  button.setAttribute("role", "button");
  button.setAttribute("data-tooltip", "Generate with AI");
  button.setAttribute("tabindex", "0");
  return button;
}

// Inject the AI Reply button into the compose toolbar
function injectButton() {
  // Remove existing button if present
  const existingButton = document.querySelector(".ai-adjust-button");
  if (existingButton) {
    existingButton.remove();
    console.log("Removed existing AI button");
  }

  const toolbar = findComposeToolbar();
  if (!toolbar) {
    console.log("Toolbar not found, retrying in 1 second...");
    setTimeout(injectButton, 1000);
    return;
  }

  console.log("Toolbar found, injecting AI button...");
  const button = createAiButton();

  button.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // Update button state
      const originalText = button.innerText;
      button.innerText = "Generating...";
      button.style.pointerEvents = "none";
      button.style.opacity = "0.7";

      // Get current email content
      const emailContent = getEmailContent();
      console.log("Retrieved email content for processing");

      // Make API request
      const response = await fetch("http://localhost:8080/api/email/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailContent: emailContent,
          tone: "professional",
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const generatedReply = await response.text();
      console.log("Received generated reply from API");

      // Find and update the compose box
      const composeBox = findComposeTextbox();
      if (!composeBox) {
        throw new Error("Could not find compose textbox");
      }

      // Replace the content
      const success = replaceEmailContent(composeBox, generatedReply);
      if (!success) {
        throw new Error("Failed to replace email content");
      }

      console.log("Successfully updated email content");

    } catch (error) {
      console.error("AI generation error:", error);
      alert(`Failed to generate AI response: ${error.message}`);
    } finally {
      // Restore button state
      button.innerText = "AI Update";
      button.style.pointerEvents = "auto";
      button.style.opacity = "1";
    }
  });

  // Insert button at the beginning of toolbar
  toolbar.insertBefore(button, toolbar.firstChild);
  console.log("AI button successfully injected");
}

// Wait for Gmail to fully load before initial injection
function waitForGmail() {
  const checkGmail = () => {
    if (document.querySelector('[role="main"]') || document.querySelector('.nH')) {
      console.log("Gmail interface detected");
      setTimeout(injectButton, 1000);
    } else {
      setTimeout(checkGmail, 500);
    }
  };
  checkGmail();
}

// Observe Gmail for new compose boxes and interface changes
const observer = new MutationObserver((mutations) => {
  let shouldInject = false;

  for (const mutation of mutations) {
    const addedNodes = Array.from(mutation.addedNodes);

    // Check for compose-related elements
    const hasComposeElements = addedNodes.some(node => {
      if (node.nodeType !== Node.ELEMENT_NODE) return false;

      return node.matches && (
          node.matches('.aDh, .btC, [role="dialog"], .nH, .Ar.Au') ||
          node.querySelector?.('.aDh, .btC, [role="dialog"], [role="textbox"][g_editable="true"]')
      );
    });

    if (hasComposeElements) {
      shouldInject = true;
      break;
    }
  }

  if (shouldInject) {
    console.log("Compose-related DOM changes detected");
    setTimeout(injectButton, 800);
  }
});

// Start observing
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: false,
  characterData: false
});

// Initial setup
waitForGmail();

console.log("Gmail extension initialization complete");