# Cloudinary Integration Guide

This project uses Cloudinary for image storage and optimization. This document explains how to set up and use Cloudinary in this application.

## Setup

1. Create a free Cloudinary account at [cloudinary.com](https://cloudinary.com/)
2. Get your cloud name, API key, and API secret from the Cloudinary dashboard
3. Add these credentials to your `.env` file:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## How Images Are Stored

When a product is created:

1. The image is uploaded to Cloudinary
2. Cloudinary returns a URL and public ID
3. The URL is stored in the `imagePath` field in the database
4. The public ID is stored in the `imagePublicId` field for future operations like deletion

## Benefits of Using Cloudinary

- **CDN Delivery**: Images are served from Cloudinary's global CDN
- **Automatic Optimizations**: Images are automatically converted to modern formats (WebP, AVIF)
- **Dynamic Transformations**: Images can be resized, cropped, and transformed on the fly
- **Responsive Images**: Easy to create responsive images for different screen sizes
- **Free Tier**: Generous free tier for small applications

## Components

### CloudinaryImage Component

We've created a `CloudinaryImage` component that provides:

- Automatic loading animations
- Quality optimizations
- Format optimizations
- Responsive sizing

```tsx
// Example usage
<CloudinaryImage
  src={product.imagePath}
  alt={product.name}
  width={400}
  height={300}
/>
```

## API Reference

### uploadImage(imageBuffer, fileName)

Uploads an image to Cloudinary and returns the response with URL and public ID.

### deleteImage(publicId)

Deletes an image from Cloudinary by its public ID.

### getPublicIdFromUrl(cloudinaryUrl)

Extracts the public ID from a Cloudinary URL.
