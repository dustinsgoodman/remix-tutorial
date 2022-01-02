import { useActionData, redirect, Form } from "remix";
import type { ActionFunction } from "remix";
import invariant from "tiny-invariant";
import { createPost } from "~/post";

type PostError = {
  title?: boolean;
  slug?: boolean;
  markdown?: boolean;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const title = formData.get('title');
  const slug = formData.get('slug');
  const markdown = formData.get('markdown');

  const errors: PostError = {};
  if (!title) {
    errors.title = true;
  }
  if (!slug) {
    errors.slug = true;
  }
  if (!markdown) {
    errors.markdown = true;
  }

  if (Object.keys(errors).length) {
    return errors;
  }

  invariant(typeof title === "string");
  invariant(typeof slug === "string");
  invariant(typeof markdown === "string");
  await createPost({ title, slug, markdown });

  return redirect('/admin');
};

export default function NewPost() {
  const errors = useActionData();
  return (
    <Form method="post">
      <p>
        <label htmlFor="title">
          Post Title:
          &nbsp;
          {errors?.title ? <em>Title is required</em> : null}
          <input type="text" name="title" id="title" />
        </label>
      </p>
      <p>
        <label htmlFor="slug">
          Post Slug:
          &nbsp;
          {errors?.slug ? <em>Slug is required</em> : null}
          <input type="text" name="slug" id="slug" />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">
          Markdown:
        </label>
        {errors?.markdown ? <em>Markdown is required</em> : null}
        <br />
        <textarea name="markdown" id="markdown" rows={20} cols={100} />
      </p>
      <p>
        <button type="submit">Create Post</button>
      </p>
    </Form>
  );
}
