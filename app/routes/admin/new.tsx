import { redirect, Form } from "remix";
import { createPost } from "~/post";

export const action = async ({ request }) => {
  const formData = await request.formData();

  const title = formData.get('title');
  const slug = formData.get('slug');
  const markdown = formData.get('markdown');

  await createPost({ title, slug, markdown });

  return redirect('/admin');
};

export default function NewPost() {
  return (
    <Form method="post">
      <p>
        <label htmlFor="title">
          Post Title:
          &nbsp;
          <input type="text" name="title" id="title" />
        </label>
      </p>
      <p>
        <label htmlFor="slug">
          Post Slug:
          &nbsp;
          <input type="text" name="slug" id="slug" />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">
          Markdown:
        </label>
        <br />
        <textarea name="markdown" id="markdown" rows={20} cols={100} />
      </p>
      <p>
        <button type="submit">Create Post</button>
      </p>
    </Form>
  );
}
