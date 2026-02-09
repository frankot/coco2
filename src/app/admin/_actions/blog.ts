"use server";

import prisma from "@/db";
import { uploadImage, deleteImage } from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/require-admin";

export async function listBlogPosts() {
  return prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getBlogPost(id: string) {
  return prisma.blogPost.findUnique({ where: { id } });
}

export async function addBlogPost(prevState: any, formData: FormData) {
  try {
    await requireAdmin();

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const image = formData.get("image") as File;

    if (!title || !content) {
      return { error: { _form: ["Wszystkie pola są wymagane"] } };
    }

    let imagePath: string | undefined = undefined;
    let imagePublicId: string | undefined = undefined;

    if (image && image instanceof File && image.size > 0) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const result = await uploadImage(buffer, image.name, "coco-blog");
      imagePath = result?.secure_url;
      imagePublicId = result?.public_id;
    }

    // Base slug
    let baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 200);

    if (!baseSlug) baseSlug = "post";

    // Ensure uniqueness: fetch existing slugs starting with baseSlug
    const existing = await prisma.blogPost.findMany({
      where: { slug: { startsWith: baseSlug } },
      select: { slug: true },
    });

    let slug = baseSlug;
    if (existing.some((e) => e.slug === baseSlug)) {
      // Collect numeric suffixes
      const regex = new RegExp(`^${baseSlug}-(\\d+)$`);
      const nums = existing
        .map((e) => {
          const m = e.slug.match(regex);
          return m ? parseInt(m[1], 10) : null;
        })
        .filter((n) => n != null) as number[];
      const next = nums.length > 0 ? Math.max(...nums) + 1 : 2;
      slug = `${baseSlug}-${next}`;
    }

    await prisma.blogPost.create({
      data: { title, content, imagePath, imagePublicId, slug } as any,
    });
  } catch (error) {
    console.error(error);
    return { error: { _form: ["Błąd podczas dodawania wpisu"] } };
  }
  return { success: true };
}

export async function updateBlogPost(postId: string, prevState: any, formData: FormData) {
  try {
    await requireAdmin();

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const image = formData.get("image") as File;
    const keepImage = formData.get("keepImage") === "true";

    if (!title || !content) {
      return { error: { _form: ["Wszystkie pola są wymagane"] } };
    }

    const post = await prisma.blogPost.findUnique({ where: { id: postId } });
    if (!post) return { error: { _form: ["Wpis nie został znaleziony"] } };

    let imagePath = post.imagePath;
    let imagePublicId = post.imagePublicId;

    // If new image provided, upload and delete old
    if (image && image instanceof File && image.size > 0) {
      // upload
      const buffer = Buffer.from(await image.arrayBuffer());
      const result = await uploadImage(buffer, image.name, "coco-blog");
      if (result) {
        // delete old
        if (imagePublicId) await deleteImage(imagePublicId);
        imagePath = result.secure_url;
        imagePublicId = result.public_id;
      }
    } else if (!keepImage) {
      // remove existing image
      if (imagePublicId) await deleteImage(imagePublicId);
      imagePath = null;
      imagePublicId = null;
    }

    let baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 200);
    if (!baseSlug) baseSlug = "post";

    // If title changed (or slug would conflict with another post), compute new unique slug
    let slug = baseSlug;
    if (post.slug !== baseSlug) {
      const existing = await prisma.blogPost.findMany({
        where: { slug: { startsWith: baseSlug } },
        select: { slug: true },
      });
      if (existing.some((e) => e.slug === baseSlug)) {
        const regex = new RegExp(`^${baseSlug}-(\\d+)$`);
        const nums = existing
          .map((e) => {
            const m = e.slug.match(regex);
            return m ? parseInt(m[1], 10) : null;
          })
          .filter((n) => n != null) as number[];
        const next = nums.length > 0 ? Math.max(...nums) + 1 : 2;
        slug = `${baseSlug}-${next}`;
      }
    } else {
      slug = post.slug; // keep existing if unchanged
    }

    await prisma.blogPost.update({
      where: { id: postId },
      data: { title, content, imagePath, imagePublicId, slug } as any,
    });
  } catch (error) {
    console.error(error);
    return { error: { _form: ["Błąd podczas aktualizacji wpisu"] } };
  }
  return { success: true };
}

export async function deleteBlogPost(postId: string) {
  try {
    await requireAdmin();

    const post = await prisma.blogPost.findUnique({ where: { id: postId } });
    if (!post) return { success: false, message: "Wpis nie został znaleziony" };

    if (post.imagePublicId) await deleteImage(post.imagePublicId);

    await prisma.blogPost.delete({ where: { id: postId } });
    return { success: true, message: "Wpis usunięty" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Błąd podczas usuwania wpisu" };
  }
}
