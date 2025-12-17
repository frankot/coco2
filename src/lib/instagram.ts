/**
 * Instagram API utilities for fetching posts via Meta Graph API
 */

export interface InstagramPost {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

interface InstagramAPIResponse {
  data: InstagramPost[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

/**
 * Fetches recent Instagram posts from the user's profile
 * @param limit - Number of posts to fetch (default: 18)
 * @returns Array of Instagram posts
 */
export async function getInstagramPosts(limit = 18): Promise<InstagramPost[]> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;

  if (!accessToken || !userId) {
    console.error("Missing Instagram credentials");
    return [];
  }

  try {
    const fields = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
    const url = `https://graph.instagram.com/${userId}/media?fields=${fields}&access_token=${accessToken}&limit=${limit}`;

    const response = await fetch(url, {
      next: {
        revalidate: 7200, // Revalidate every 2 hours (7200 seconds)
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Instagram API error:", errorData);
      return [];
    }

    const data: InstagramAPIResponse = await response.json();

    // Filter out videos if needed, or keep all media types
    return data.data || [];
  } catch (error) {
    console.error("Error fetching Instagram posts:", error);
    return [];
  }
}

/**
 * Refreshes a long-lived Instagram access token
 * Long-lived tokens last 60 days and can be refreshed
 */
export async function refreshInstagramToken(): Promise<string | null> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!accessToken) {
    console.error("Missing Instagram access token");
    return null;
  }

  try {
    const url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${accessToken}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Token refresh error:", errorData);
      return null;
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error refreshing Instagram token:", error);
    return null;
  }
}
