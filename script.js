# SHIVAM Enquiry Notifications: Email + Google Sheets + Telegram

This package adds a real service enquiry form to the static GitHub Pages website. The website itself cannot securely send email, write to Google Sheets, or call Telegram directly. A Google Apps Script web app receives form submissions and performs those actions.

## Part A — Create the Google Sheet
1. Sign in to the Google account where you want to keep enquiries.
2. Create a blank Google Sheet named `SHIVAM Service Enquiries`.
3. Copy its spreadsheet ID from its URL. It is the text between `/d/` and `/edit` in:
   `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
4. Keep this sheet private; do not share it publicly.

## Part B — Set up Telegram notifications
1. Open Telegram and chat with the official `@BotFather`.
2. Send `/newbot`, follow its prompts, and copy the bot token. Treat it like a password; do not place it in website JavaScript or commit it to GitHub.
3. Open your new bot in Telegram and press **Start**.
4. To get your chat ID, you can use a trusted Telegram bot that shows your numeric user ID, or use the Bot API `getUpdates` after sending a message to your bot. Do not paste your bot token into public websites or chats. For a group, add your bot to the group and use the group's chat ID.
5. Store the token and chat ID in Apps Script Script Properties as described below.

## Part C — Create the Apps Script receiver
1. Visit https://script.google.com/ and create a new project called `SHIVAM Enquiry Receiver`.
2. Replace the default editor content with the code from `Code.gs` in this package.
3. In the Apps Script project, open **Project Settings** (gear icon) → **Script Properties** → **Add script property**. Add:
   - `SHEET_ID` = your spreadsheet ID
   - `NOTIFY_EMAIL` = the email address that should receive notifications
   - `TELEGRAM_BOT_TOKEN` = token from BotFather
   - `TELEGRAM_CHAT_ID` = your Telegram chat ID
4. Save the project.
5. Select **Deploy → New deployment**. Click the gear beside type and choose **Web app**.
6. Set **Execute as** to **Me**. Set **Who has access** to **Anyone** so visitors can submit the public website form. Review your organisation's policies if using a work account.
7. Click **Deploy** and authorize the requested Google permissions. Copy the Web app URL ending in `/exec`.

Important: this public endpoint accepts submissions from anyone. The script limits field lengths, but a public form can still receive spam. If spam becomes a problem, add CAPTCHA or a server-side rate-limit before broad promotion.

## Part D — Connect the website
1. In the website files, open `script.js`.
2. Find this line:
   `const ENQUIRY_ENDPOINT = 'PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';`
3. Replace the placeholder with the Web app URL ending in `/exec`, keeping the quotes.
4. Save `script.js`.
5. Upload/commit the updated website files to the root of your `shivammaintainers` GitHub repository. You can upload `index.html`, `style.css`, and `script.js`; keep any other existing files you need.
6. Wait for GitHub Pages to redeploy.

## Part E — Test all three notifications
1. Open the live site in a private/incognito window.
2. Submit a test enquiry using your own test details.
3. Check the Google Sheet for a new row.
4. Check the `NOTIFY_EMAIL` inbox and spam folder.
5. Check Telegram for the bot message.
6. If the sheet row appears but an email/Telegram notification does not, confirm the corresponding Script Properties and inspect **Apps Script → Executions** for errors.

## Privacy and security notes
- Do not put the Telegram bot token, or any other secret, in `script.js`, HTML, or the GitHub repository.
- The sheet should remain private.
- The form asks for consent to use contact details to respond to the enquiry. Add a privacy policy/contact for data requests before wider promotion.
- The browser uses a simple `no-cors` POST to Apps Script; it cannot read the server response. The on-page success message means the browser sent the request, not that every notification channel was independently confirmed. Verify with the test steps above.
- The form requires a name, phone number, service and location; email and message are optional.
