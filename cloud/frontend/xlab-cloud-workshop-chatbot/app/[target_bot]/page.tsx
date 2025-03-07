import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";
import WorkshopChatbot from "./WorkshopChatbot";

type PageProps = {
  params: Promise<{ target_bot: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  return {
    title: `Chatting with ${(await params).target_bot}'s bot`,
    description: `This is the chatbot created by ${(await params).target_bot}.`,
  };
}

const Page = async ({ params }: PageProps) => {
  const { target_bot } = await params;

  return (
    <Suspense fallback={<Spinner />}>
      <div className="grid items-center justify-items-center min-h-screen p-2 gap-16 sm:p-2 font-[family-name:var(--font-geist-sans)]">
        <Card className="w-full h-full max-h-[98vh] overflow-auto" shadow="sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold">
                Chatting with {target_bot}&apos;s bot
              </h1>
            </div>
          </CardHeader>
          <CardBody>
            <WorkshopChatbot target_bot={target_bot} />
          </CardBody>
        </Card>
      </div>
    </Suspense>
  );
};

export default Page;
