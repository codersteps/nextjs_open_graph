import Head from "next/head";
import Image from "next/image";
import { GetServerSideProps, NextPage } from "next";
import OpenGraph from "../../components/common/OpenGraph";
import useOpenGraph from "../../hooks/useOpenGraph";
import { absUrl } from "../../core/helpers";

type Post = {
  id: number;
  title: string;
  thumbnail: string;
  description: string;
  content: string;
};

interface ServerSideProps {
  post: Post;
}

const ShowPost: NextPage<ServerSideProps> = ({ post }) => {
  const ogProperties = useOpenGraph({
    url: absUrl(`/posts/${post.id}`),
    title: post.title,
    image: {
      // The post thumbnail
      type: "image/jpeg", // replace it with a dynamic thumbnail mimetype
      url: post.thumbnail,
      alt: post.title,
    },
    description: post.description,
    type: "article",
    author: "Article Author",
    section: "Article Category",
    modified_time: "Post Updated Time",
    published_time: "Post Published Time",
  });

  return (
    <>
      <Head>
        <title>{post.title}</title>

        <OpenGraph properties={ogProperties} />
      </Head>

      <main>
        <article>
          <h1>{post.title}</h1>

          <Image
            width={720}
            height={420}
            src={post.thumbnail}
            alt={post.title}
          />

          <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
        </article>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({
  params,
}) => {
  if (!params || typeof params.id !== "string" || isNaN(+params.id)) {
    return { notFound: true };
  }

  const posts: Post[] = require("../../data/posts.json");

  const postId = +params.id;
  const post = posts.find((p) => p.id === postId);
  if (!post) {
    return { notFound: true };
  }

  return {
    props: {
      post,
    },
  };
};

export default ShowPost;
