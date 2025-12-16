import { getInstagramPosts } from "@/lib/instagram";
import { InstaCaru } from "./InstaCaru2";

/**
 * Server Component that fetches Instagram posts and passes them to the client carousel
 * Data is revalidated every 2 hours via the fetch cache in getInstagramPosts
 */
export async function InstagramFeed() {
  const posts = await getInstagramPosts(18);

  return <InstaCaru posts={posts} />;
}
