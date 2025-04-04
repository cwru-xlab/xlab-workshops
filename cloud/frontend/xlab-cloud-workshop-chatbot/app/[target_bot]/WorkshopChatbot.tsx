"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import {
  Card,
  Textarea,
  ScrollShadow,
  Button,
  Switch,
} from "@nextui-org/react";
import { Bot, User } from "lucide-react";
import { Cloud, Laptop } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  content: string;
  isUser: boolean;
}

interface MessageProps {
  content: string;
  isUser: boolean;
}

interface InputMessageProps {
  message: string;
  setMessage: (message: string) => void;
  sendMessage: () => void;
  isDisabled: boolean;
}

interface ChatHistory {
  role: "user" | "assistant" | "system";
  content: string;
}

const Message: React.FC<MessageProps> = ({ content, isUser }) => (
  <div
    className={`flex flex-col items-${
      isUser ? "end" : "start"
    } my-1 font-medium text-black max-md:pr-5 max-md:max-w-full`}
  >
    <div
      className={`${
        isUser
          ? "bg-slate-200 dark:bg-black dark:text-white"
          : "bg-orange-50 dark:bg-slate-800 dark:text-white"
      } rounded-2xl px-4 py-2 max-w-[90%]`}
    >
      <div className="text-left w-full flex flex-row">
        {isUser ? (
          <div className="text-right w-full">
            <User className="inline-block size-6 text-green-600" />
          </div>
        ) : (
          <div className="text-left w-full flex flex-row">
            <Bot className="size-7 text-sky-600 mr-2" />
            {content === "" && (
              <div className="mt-1 animate-pulse">Thinking...</div>
            )}
          </div>
        )}
      </div>
      <div className="overflow-x-auto markdown-content">
        {isUser ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-2">{children}</p>,
              code: ({ children, ...props }) => (
                <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded my-2 overflow-x-auto">
                  <code {...props}>{children}</code>
                </pre>
              ),
              ul: ({ children }) => (
                <ul className="list-disc ml-4 mb-2">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal ml-4 mb-2">{children}</ol>
              ),
              li: ({ children }) => <li className="mb-1">{children}</li>,
            }}
          >
            {content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  </div>
);

const InputMessage: React.FC<InputMessageProps> = ({
  message,
  setMessage,
  sendMessage,
  isDisabled,
}) => (
  <div className="flex gap-2 px-1 py-1 inset-x-0 bottom-0 rounded-xl">
    <Textarea
      placeholder="Enter your message"
      className="flex-grow"
      value={message}
      //@ts-expect-error - onChange type mismatch
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
        setMessage(e.target.value)
      }
      //@ts-expect-error - onKeyDown type mismatch
      onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
        }
      }}
      //@ts-expect-error - onKeyUp type mismatch
      onKeyUp={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      }}
      disabled={isDisabled}
      minRows={1}
      maxRows={10}
    />
    <Button
      color="primary"
      aria-label="Send message"
      onClick={sendMessage}
      isDisabled={isDisabled}
      className="h-auto"
    >
      Send
    </Button>
  </div>
);

interface WorkshopChatbotProps {
  target_bot: string;
}

const WorkshopChatbot: React.FC<WorkshopChatbotProps> = ({ target_bot }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const [apiUrl, setApiUrl] = useState<string>(
    `http://localhost:8000/${target_bot}/chat`
  );
  const [useLocalBackend, setUseLocalBackend] = useState<boolean>(() => {
    // Load initial value from localStorage, default to false if not found
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("useLocalBackend");
    return stored ? JSON.parse(stored) : false;
  });

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const storedMessages = localStorage.getItem(`chat_history_${target_bot}`);
    if (storedMessages) {
      try {
        const parsedMessages = JSON.parse(storedMessages);
        setMessages(parsedMessages);
      } catch (error) {
        console.error("Error parsing stored messages:", error);
      }
    }
  }, [target_bot]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(
        `chat_history_${target_bot}`,
        JSON.stringify(messages)
      );
    } else {
      localStorage.removeItem(`chat_history_${target_bot}`);
    }
  }, [messages, target_bot]);

  useEffect(() => {
    setApiUrl(
      useLocalBackend
        ? `http://localhost:8000/${target_bot}/chat`
        : `https://cloud-api.xlab-cwru.com/${target_bot}/chat`
    );
  }, [useLocalBackend, target_bot]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: isStreaming ? "auto" : "smooth",
        block: "end",
      });
    }
  }, [messages, isStreaming]);

  interface StreamResponse {
    event?: string;
    data?: string;
  }

  const sendMessage = async (): Promise<void> => {
    if (!inputMessage.trim() || isStreaming) return;

    setIsStreaming(true);
    const userMessage = inputMessage;
    setInputMessage("");

    // Add user message to chat
    setMessages((prev) => [...prev, { content: userMessage, isUser: true }]);

    // Prepare chat history for API
    const chatHistory: ChatHistory[] = messages.map((msg) => ({
      role: msg.isUser ? "user" : "assistant",
      content: msg.content,
    }));
    chatHistory.push({ role: "user", content: userMessage });

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chat_history: chatHistory }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        if (!response.body) {
          throw new Error("Response body is null");
        }

        // Add empty assistant message that will be updated with streaming content
        setMessages((prev) => [...prev, { content: "", isUser: false }]);

        const reader = response.body
          .pipeThrough(new TextDecoderStream())
          .getReader();

        let readBuffer = "";
        let responseMessage = "";

        const processStream = async () => {
          while (true) {
            const { done, value } = await reader.read();
            readBuffer += value || "";

            const lines = readBuffer
              .split("\n")
              .filter((line) => line !== "" && line !== "\r");

            if (lines.length >= 3 || (done && lines.length > 0)) {
              let line = "";
              let data: StreamResponse = {};
              let usedLine = 0;

              try {
                line = lines.at(-1) || "";
                if (line.startsWith("data: ")) {
                  data = JSON.parse(line.slice(6));
                  usedLine = -1;
                } else {
                  line = lines.at(-2) || "";
                  if (line.startsWith("data: ")) {
                    data = JSON.parse(line.slice(6));
                    usedLine = -2;
                  }
                }
              } catch (e) {
                if (e instanceof SyntaxError) {
                  line = lines.at(-2) || "";
                  if (line.startsWith("data: ")) {
                    data = JSON.parse(line.slice(6));
                    usedLine = -2;
                  }
                }
              }

              try {
                responseMessage = data.data || "";
                // Update the last message with accumulated content
                setMessages((prev) => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1].content = responseMessage;
                  return newMessages;
                });
              } catch (e) {
                if (e instanceof SyntaxError) {
                  console.warn(
                    "Incomplete JSON received, waiting for the next chunk."
                  );
                } else {
                  console.error("Error parsing JSON:", e, line);
                }
              }

              readBuffer = usedLine === -1 ? "" : lines.at(-1) || "";
            }

            if (done) break;
          }
          setIsStreaming(false);
        };

        processStream();
      })
      .catch((error) => {
        console.error("Error:", error);
        setMessages((prev) => [
          ...prev,
          {
            content: "Sorry, there was an error processing your message.",
            isUser: false,
          },
        ]);
        setIsStreaming(false);
      });
  };

  return (
    <Card className="m-1 ml-1" style={{ height: "calc(100% - 1rem)" }}>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex flex-col items-end fixed top-3 right-3 z-50">
          <div>
            <Button
              className="mr-3 text-md font-bold"
              size="sm"
              onClick={() => setMessages([])}
            >
              Clear chat
            </Button>
            <span className="text-md mr-2">
              Using{" "}
              {useLocalBackend ? (
                <span className="font-bold">local</span>
              ) : (
                <span className="font-bold">cloud</span>
              )}{" "}
              API
            </span>
            <Switch
              isSelected={useLocalBackend}
              thumbIcon={useLocalBackend ? <Laptop /> : <Cloud />}
              onValueChange={() => {
                setUseLocalBackend((prev) => {
                  const newValue = !prev;
                  localStorage.setItem(
                    "useLocalBackend",
                    JSON.stringify(newValue)
                  );
                  return newValue;
                });
              }}
              color="default"
              size="md"
            />
          </div>
          <div>
            <span className="text-md mr-2 hidden md:block">
              Current backend API URL: {apiUrl}
            </span>
          </div>
        </div>
      </Suspense>
      <div className="flex flex-col grow px-4 pt-5 pb-2 w-full text-base leading-6 max-md:px-5 max-md:max-w-full h-full">
        <ScrollShadow
          size={20}
          className="flex flex-col overflow-y-scroll h-full pr-4"
        >
          {messages.map((message, index) => (
            <Message
              key={index}
              content={message.content}
              isUser={message.isUser}
            />
          ))}
          <div ref={lastMessageRef} className="min-h-3" />
        </ScrollShadow>

        <footer className="flex-shrink-0">
          <InputMessage
            message={inputMessage}
            setMessage={setInputMessage}
            sendMessage={sendMessage}
            isDisabled={isStreaming}
          />
          <div className="flex justify-center text-gray-500 text-xs">
            AI can make errors. Please verify important information.
          </div>
        </footer>
      </div>
    </Card>
  );
};

export default WorkshopChatbot;
