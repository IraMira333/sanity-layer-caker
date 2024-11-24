import { client } from "@/sanity/lib/client";
import { POST_QUERY, POSTS_SLUGS_QUERY } from "@/sanity/lib/queries";
import { Post } from "@/components/Post";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const slugs = await client
    .withConfig({ useCdn: false })
    .fetch(POSTS_SLUGS_QUERY);

  return slugs;
}
const options = { next: { revalidate: 60 } };

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await client.fetch(POST_QUERY, { slug }, options);

  if (!post) {
    notFound();
  }

  return (
    <main className="container mx-auto grid grid-cols-1 gap-6 p-12">
      <Post {...post} />
    </main>
  );
}
