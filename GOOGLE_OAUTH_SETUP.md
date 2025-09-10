# Google OAuth Setup Instructions

To enable Google OAuth authentication in your SoftGlow application, follow these steps:

## 1. Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:8827/api/customer/auth/google/callback`
   - Note down your Client ID and Client Secret

## 2. Update Environment Variables

Update the following variables in your `backend/.env` file:

```env
GOOGLE_CLIENT_ID=your_actual_google_client_id
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret
SESSION_SECRET=your_random_session_secret_key
```

## 3. Generate Session Secret

For the session secret, you can generate a random string using Node.js:

```javascript
require('crypto').randomBytes(64).toString('hex')
```

## 4. Test the Integration

1. Start your backend server: `npm run dev`
2. Start your frontend server: `npm run dev`
3. Navigate to the customer login or signup page
4. Click "Sign in with Google" or "Sign up with Google"
5. Complete the OAuth flow

## Features Implemented

✅ Google OAuth authentication for customer signup and login
✅ Automatic account creation for new Google users
✅ Account linking for existing users with matching email
✅ Secure JWT token generation after OAuth success
✅ Seamless redirect to customer dashboard after authentication
✅ Error handling for OAuth failures

## Notes

- Users signing up with Google will need to add their phone number later in their profile
- Email verification is automatically set to true for Google OAuth users
- The system supports both local authentication (email/password) and Google OAuth
- Users can link their Google account to an existing local account if emails match

## Troubleshooting

### "Invalid Client" Error (Error 401)
If you see an error like `The OAuth client was not found` or `invalid_client`:

1. **Check Google Console Setup**:
   - Ensure your project has the Google+ API enabled
   - Verify your OAuth 2.0 Client ID is correctly created
   - Make sure the Client ID and Secret in your `.env` file match exactly what's shown in Google Console

2. **Verify Redirect URI**:
   - In Google Console, go to "APIs & Services" > "Credentials"
   - Click on your OAuth 2.0 Client ID
   - Under "Authorized redirect URIs", ensure you have: `http://localhost:8827/api/customer/auth/google/callback`
   - The URI must match exactly (including http vs https, port number, and path)

3. **Check Environment Variables**:
   - Restart your backend server after updating `.env` file
   - Ensure no extra spaces or quotes around the values
   - Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correctly set

4. **Common Issues**:
   - Make sure your Google project is not in "Testing" mode if you want external users to access it
   - Verify that the domain `localhost` is added to authorized domains if required
   - Check that both frontend and backend servers are running on the correct ports