import { useTransition, useActionData, redirect, Form, LoaderFunction, useLoaderData } from "remix";
import type { ActionFunction } from "remix";
import invariant from "tiny-invariant";
import { getPost, updatePost } from "~/post";

type PostError = {
  title?: boolean;
  slug?: boolean;
  markdown?: boolean;
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, "params.slug is required");
  return getPost(params.slug);
};

export const action: ActionFunction = async ({ request }) => {
  await new Promise(res => setTimeout(res, 1000));

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
  await updatePost({ title, slug, markdown });

  return redirect('/admin');
};

export default function EditPost() {
  const post = useLoaderData();
  const errors = useActionData();
  const transition = useTransition();

  return (
    <Form method="post">
      <p>
        <label htmlFor="title">
          Post Title:
          &nbsp;
          {errors?.title ? <em>Title is required</em> : null}
          <input type="text" name="title" id="title" defaultValue={post.title} />
        </label>
      </p>
      <p>
        <label htmlFor="slug">
          Post Slug:
          &nbsp;
          {errors?.slug ? <em>Slug is required</em> : null}
          <input type="text" name="slug" id="slug" defaultValue={post.slug} readOnly />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">
          Markdown:
        </label>
        {errors?.markdown ? <em>Markdown is required</em> : null}
        <br />
        <textarea name="markdown" id="markdown" rows={20} cols={100} defaultValue={post.markdown} />
      </p>
      <p>
        <button type="submit">
          {transition.submission
            ? "Updating..."
            : "Update Post"}
        </button>
      </p>
    </Form>
  );
}
