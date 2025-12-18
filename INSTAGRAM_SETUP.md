# Instagram API Setup Guide

## Prerequisites

- An Instagram Business or Creator account
- A Facebook Page connected to your Instagram account
- A Facebook Developer account

---

## Step-by-Step Setup Instructions

### 1. Convert to Instagram Business Account (if not already)

1. Open Instagram app on your phone
2. Go to **Settings** → **Account** → **Switch to Professional Account**
3. Choose **Business** or **Creator**
4. Connect your Instagram account to a Facebook Page (create one if needed)

### 2. Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **My Apps** in the top right corner
3. Click **Create App**
4. Choose **Business** as the app type
5. Fill in the app details:
   - **App Name**: Choose a name (e.g., "Dr.Coco Website")
   - **App Contact Email**: Your email address
6. Click **Create App**

### 3. Add Instagram Basic Display

**IMPORTANT**: In the current Meta interface (2025), here's how to add Instagram Basic Display:

1. In your app dashboard (where you see "Dashboard" at the top), look at the left sidebar
2. Scroll down in the left sidebar until you see **"App settings"** with a gear icon
3. Click on **"App settings"** to expand it
4. Look for **"Add Product"** or go directly to: `https://developers.facebook.com/apps/YOUR_APP_ID/add/`
   - Replace `YOUR_APP_ID` with your actual app ID from the top left (under "dr CoCo")
5. You'll see a page with available products - look for **"Instagram Basic Display"**
6. Click **"Set Up"** on the Instagram Basic Display card
7. Click **"Create New App"** when prompted
8. Accept the Instagram Platform Terms and click **"Create App"**

**Alternative way to find it:**

- From your dashboard, look for "Add Products to Your App" section
- Or navigate to: Tools → Product Setup → Add Products
- Find Instagram Basic Display in the list

### 4. Configure Instagram Basic Display

1. After adding the product, in the left sidebar you should now see **"Instagram Basic Display"**
2. Click on it, then go to **"Basic Display"** → **"Settings"**
3. Scroll down and fill in the required URLs:
   - **Valid OAuth Redirect URIs**: `https://localhost/` (for development testing)
   - **Deauthorize Callback URL**: `https://yourdomain.com/auth/instagram/deauthorize`
   - **Data Deletion Request URL**: `https://yourdomain.com/auth/instagram/delete`
4. Click **"Save Changes"** at the bottom

### 5. Add Instagram Test User

1. Scroll down to **User Token Generator**
2. Click **Add or Remove Instagram Testers**
3. Search for your Instagram username and click **Add**
4. Open Instagram on your phone
5. Go to **Settings** → **Apps and Websites** → **Tester Invites**
6. Accept the invite

### 6. Generate Access Token

1. Back in Facebook Developers, go to **Basic Display** → **User Token Generator**
2. Click **Generate Token** next to your Instagram account
3. Log in to Instagram if prompted
4. Authorize the app
5. **Copy the Access Token** - this is your short-lived token (expires in 1 hour)

### 7. Convert to Long-Lived Token

You need to convert the short-lived token to a long-lived token (valid for 60 days):

**Option A: Using Graph API Explorer**

1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. In the query field, enter:
   ```
   /oauth/access_token?grant_type=ig_exchange_token&client_secret={app-secret}&access_token={short-lived-token}
   ```
3. Replace `{app-secret}` with your app secret (found in **Settings** → **Basic**)
4. Replace `{short-lived-token}` with the token from step 6
5. Click **Submit**
6. Copy the `access_token` from the response

**Option B: Using curl**

```bash
curl -X GET "https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret={app-secret}&access_token={short-lived-token}"
```

### 8. Get Your Instagram User ID

1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app from the dropdown
3. Enter your long-lived token in the **Access Token** field
4. In the query field, enter: `/me?fields=id,username`
5. Click **Submit**
6. Copy the `id` from the response

### 9. Add Credentials to Your App

1. Open your `.env` file
2. Replace the placeholder values:
   ```env
   INSTAGRAM_ACCESS_TOKEN=your_long_lived_token_here
   INSTAGRAM_USER_ID=your_instagram_user_id_here
   ```

### 10. Refresh Token Before Expiration

Long-lived tokens expire after 60 days. You can refresh them to extend validity:

**Refresh URL** (can be called any time before expiration):

```bash
curl -X GET "https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token={your-long-lived-token}"
```

**Set up a reminder** to refresh your token every 30-45 days, or implement automatic refresh in your app.

---

## Alternative: Instagram Graph API (for Business Accounts)

If you have an Instagram Business Account connected to a Facebook Page, you can use the Instagram Graph API which has more features:

### Additional Steps for Graph API:

1. In your Facebook app, add the **Instagram** product (not Basic Display)
2. Go to **Instagram** → **Basic Setup**
3. Add your Instagram Business Account
4. Request the following permissions:
   - `instagram_basic`
   - `pages_show_list`
   - `instagram_manage_insights`
5. Generate a Page Access Token in Graph API Explorer
6. Use this to access Instagram Business Account data

---

## Testing Your Setup

1. Make sure your credentials are in `.env`
2. Restart your development server: `npm run dev`
3. Navigate to your homepage
4. The Instagram carousel should now display your latest posts

If you see "Brak postów z Instagrama do wyświetlenia", check:

- Your access token is valid and not expired
- Your Instagram User ID is correct
- You have public posts on your Instagram account
- Check the console for any error messages

---

## Troubleshooting

### "Invalid OAuth access token"

- Your token has expired. Generate a new long-lived token
- Make sure you're using the long-lived token, not the short-lived one

### "Unsupported get request"

- Check that your User ID is correct
- Ensure your Instagram account is a Business or Creator account

### No posts showing

- Verify your Instagram account has public posts
- Check if the API is returning data by visiting:
  ```
  https://graph.instagram.com/{user-id}/media?fields=id,caption,media_url,permalink&access_token={token}
  ```

### Rate Limits

- Instagram Basic Display has rate limits
- If you hit limits, wait a few minutes before trying again
- Consider caching in production (already set to 2-hour revalidation)

---

## Production Considerations

1. **Token Management**: Set up a cron job or scheduled function to refresh your token automatically
2. **Error Handling**: Monitor logs for API errors
3. **Fallback Content**: Keep some placeholder images in case the API is down
4. **Rate Limits**: The 2-hour revalidation helps avoid hitting rate limits
5. **Security**: Never commit your `.env` file to version control

---

## Useful Links

- [Instagram Basic Display API Documentation](https://developers.facebook.com/docs/instagram-basic-display-api)
- [Instagram Graph API Documentation](https://developers.facebook.com/docs/instagram-api)
- [Facebook Developers Console](https://developers.facebook.com/)
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
