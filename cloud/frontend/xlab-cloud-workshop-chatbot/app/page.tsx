import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@nextui-org/react";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <ol className="list-inside text-md text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
            <li className="mb-2">
              Go to{" "}
              <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
                /case_id
              </code>{" "}
              to see the chatbot in action.
            </li>
          </ol>

          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <Link href="/rxy216">
              <Button>Chat with Ruihuang's bot</Button>
            </Link>
          </div>
        </main>
      </div>
    </Suspense>
  );
}
