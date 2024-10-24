import React, { Suspense } from "react";
import type { Metadata, ResolvingMetadata } from "next";

type PageProps = {
  params: Promise<{ target_bot: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return {
    title: `Chatting with ${(await params).target_bot}'s bot`,
    description: `This is the chatbot created by ${(await params).target_bot}.`,
  };
}

const Page = async ({ params, searchParams }: PageProps) => {
  return (
    <Suspense>
      <div className="m-6">
        <h1>{(await params).target_bot}</h1>
        <h1>{(await searchParams).thread}</h1>
        {/* <ChatPage
          isOpen={true}
          onClose={closeChatModal}
          status={status}
          agent={agent}
          thread={params.thread}
        ></ChatPage> */}
      </div>
    </Suspense>
  );
};

export default Page;
