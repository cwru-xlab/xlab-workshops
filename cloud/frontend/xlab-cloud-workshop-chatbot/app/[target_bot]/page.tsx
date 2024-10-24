import React, { Suspense } from "react";
import type { Metadata, ResolvingMetadata } from "next";
import { Button, Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";
import { DarkModeSwitch } from "../components/ThemeSwitcher";

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
    <Suspense fallback={<Spinner />}>
      <div className="grid items-center justify-items-center min-h-screen p-5 gap-16 sm:p-5 font-[family-name:var(--font-geist-sans)]">
        <Card className="w-full h-full" shadow="lg">
          <CardHeader>
            <Button>Chat with my bot</Button>
            <DarkModeSwitch />
          </CardHeader>
          <CardBody>
            <h1>{(await params).target_bot}</h1>
            <h1>{(await searchParams).thread}</h1>
            {/* <ChatPage
          isOpen={true}
          onClose={closeChatModal}
          status={status}
          agent={agent}
          thread={params.thread}
        ></ChatPage> */}
          </CardBody>
        </Card>
      </div>
    </Suspense>
  );
};

export default Page;
