import { getBlogPost } from "../../_actions/blog";
import BlogForm from "../_components/BlogForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditBlogPage({ params }: Props) {
  const { id } = await params;
  const post = await getBlogPost(id);

  if (!post) return <div>Wpis nie znaleziony</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Edytuj wpis</h2>
      <BlogForm post={post} />
    </div>
  );
}
