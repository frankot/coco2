import { getBlogPost } from "../../_actions/blog";
import BlogForm from "../_components/BlogForm";

type Props = { params: { id: string } };

export default async function EditBlogPage({ params }: Props) {
  const post = await getBlogPost(params.id);

  if (!post) return <div>Wpis nie znaleziony</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Edytuj wpis</h2>
      <BlogForm post={post} />
    </div>
  );
}
