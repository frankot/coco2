import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

/**
 * Uploads an image to Cloudinary
 * @param file File object from form submission
 * @returns Promise with Cloudinary upload response
 */
export async function uploadImage(
  imageBuffer: Buffer,
  fileName: string
): Promise<any> {
  try {
    // Convert buffer to base64
    const base64String = imageBuffer.toString("base64");

    // Upload to Cloudinary with specific folder and resource type
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        `data:image/jpeg;base64,${base64String}`,
        {
          folder: "coco-products",
          public_id: `${Date.now()}-${fileName.split(".")[0]}`, // Generate unique name
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    return result;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Image upload failed");
  }
}

/**
 * Delete an image from Cloudinary by public_id
 * @param publicId The public_id of the image to delete
 * @returns Promise with Cloudinary deletion response
 */
export async function deleteImage(publicId: string): Promise<any> {
  if (!publicId) return null;

  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, {}, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });

    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw new Error("Image deletion failed");
  }
}

/**
 * Extract public_id from a Cloudinary URL
 * Used when you need to delete an image but only have the URL
 */
export function getPublicIdFromUrl(cloudinaryUrl: string): string | null {
  if (!cloudinaryUrl || !cloudinaryUrl.includes("cloudinary.com")) {
    return null;
  }

  // Extract the path after the upload/ segment and before any transformation params
  const matches = cloudinaryUrl.match(/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
  return matches ? matches[1] : null;
}
