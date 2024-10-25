# Deploying Code to the Cloud Workshop

## Overview

Welcome to the *Deploying Code to the Cloud* workshop! In this session, we'll focus on taking code from a local environment and making it accessible over the internet, enabling others to use it. We’ll also introduce some fundamental concepts of interacting with LLMs via APIs. This document will guide you through the first part of the workshop—deploying code to the cloud.

### Part 1: From Local Code to Cloud Deployment

In this part, we will cover the steps to transform your locally developed code into a cloud-deployed application. We’ll do this by wrapping the code into different layers, managing security, and deploying it to a server.

### 1. **Starting with Local Python Code**

Assume you have basic Python code running on your local laptop. This code could be anything from a simple script to a more complex application that performs specific tasks, like processing data or responding to queries. The goal here is to make this code accessible over the internet, not just locally.

### 2. **Key Management with `.env` Files**

As we move toward cloud deployment, one critical aspect is managing sensitive information such as API keys, database passwords, or any other credentials your code might use. To prevent sensitive data from being hard-coded, we use `.env` files to store these variables.

- **Why use `.env` files?** `.env` files provide a safe way to manage sensitive information by keeping it out of your codebase. When you move your code to the cloud, using these files ensures that credentials stay secure and are not exposed to unauthorized users.
- **How to use `.env` files effectively:** The `.env` file contains key-value pairs of environment variables that your code can read using libraries like `dotenv` in Python. This way, you only need to configure environment variables once, and your code can access them wherever it runs.

### 3. **Wrapping Code with FastAPI**

Next, we wrap your code into an API server using FastAPI:

- **What is FastAPI?** FastAPI is a Python web framework that allows you to build APIs quickly and with minimal code. It offers capabilities for handling incoming requests, managing routes, and responding to client applications.
- **How does this help?** By converting your Python code into an API, you extend its accessibility from a command-line interface to a browser-accessible endpoint. Even though this is still local (e.g., running on `localhost`), it represents the first step in making your application available over the internet.

### 4. **Containerizing with Docker**

Once your API is working locally, the next step is to package it into a Docker container:

- **What is Docker?** Docker is a containerization platform that allows you to bundle your application, along with all its dependencies, into a single unit called a container. This makes your application portable and ensures consistent behavior regardless of the deployment environment.
- **How to create a Docker image:** You’ll need to create a Dockerfile that defines the environment for your API server, including the base image, any dependencies, and how to start the server. Building this image encapsulates everything needed to run your code.
- **Benefits of Docker:** Containers are lightweight and isolated, making them ideal for scaling and deployment in cloud environments. They also provide consistency across development, testing, and production environments.

### 5. **Pushing Docker Images to a Container Registry**

After creating the Docker image, it’s time to push it to a container registry:

- **What is a container registry?** It’s a storage and distribution system for Docker images, allowing you to store and share your images securely. Common registries include Docker Hub, GitHub Container Registry, and AWS ECR.
- **How to push images:** You will need to log in to the container registry, tag your image appropriately, and push it using Docker commands. Once in the registry, the image is available for deployment on any server.

### 6. **Pulling and Running the Docker Container on the Server**

Now that your image is in the container registry, you can deploy it on a cloud server:

- **How to pull the image:** On the cloud server, use Docker commands to pull the image from the registry. Ensure that you have the necessary permissions to access the registry and retrieve the image.
- **Running the container:** Once the image is pulled, start the container. This will launch your API server on the cloud, making it accessible to anyone with internet access.

### Final Thoughts

By the end of this part of the workshop, you will have learned how to turn your local Python code into a cloud-deployed service accessible to users worldwide. The key steps include:

1. Managing sensitive information with `.env` files.
2. Wrapping your code with FastAPI for browser access.
3. Containerizing the API server using Docker.
4. Pushing the Docker image to a container registry.
5. Pulling and running the container on a server.

--- 

## Part 2 Overview

In the second part of this workshop, we will discuss how to make your cloud-deployed code accessible to the general public via the internet. After successfully deploying your code on a server, the next step is to expose that server to allow users to access your application from anywhere. This part will introduce key concepts and components involved in this process.

### Part 2: Exposing Your Server to the Internet

This section covers how to make your server and the deployed code publicly accessible by associating it with a domain name and setting up the necessary server components to handle incoming traffic.

### 1. **Understanding IP Addresses**

- **What is an IP address?** An IP address (Internet Protocol address) is a numerical label assigned to each device connected to a computer network that uses the Internet Protocol for communication. It acts as a unique identifier for devices on the internet.
- **Types of IP addresses:** 
  - **IPv4:** The original version of IP, consisting of four sets of numbers separated by dots (e.g., `192.168.1.1`).
  - **IPv6:** The newer version designed to accommodate more devices, represented as eight groups of hexadecimal numbers separated by colons (e.g., `2001:0db8:85a3:0000:0000:8a2e:0370:7334`).

Each server hosting your application will have its own unique IP address, which is essential for routing data and requests to and from the server.

### 2. **Using Domain Names**

- **Why use domain names?** IP addresses, especially IPv6, can be difficult to remember and manage. Instead, we use domain names, which are human-friendly alternatives to numerical IP addresses (e.g., `www.example.com`).
- **Registering a domain name:** 
  - Domain names are managed by ICANN (Internet Corporation for Assigned Names and Numbers), which is the central authority for domain name registration.
  - You can register a domain name through domain registrars (e.g., GoDaddy, Namecheap), who act as intermediaries between users and ICANN.
  
### 3. **Setting up DNS (Domain Name System) Records**

- **What is DNS?** DNS (Domain Name System) is the system that translates domain names into IP addresses. It’s essentially the phonebook of the internet.
- **Establishing a DNS record:** 
  - A DNS record creates a relationship between a specific domain name and an IP address, pointing users who enter the domain name in their browser to the associated server.
  - The most common DNS record type is the A record (for IPv4) or AAAA record (for IPv6), which maps the domain name to the IP address of your server.
  
When users enter your domain name in their browser, the DNS system will resolve the name to your server’s IP address, directing the user to your deployed application.

### 4. **Handling Requests with a Reverse Proxy**

- **What is a reverse proxy?** A reverse proxy is a server component that sits in front of your application server and manages incoming client requests. It forwards these requests to the appropriate backend service or container.
- **Why use Nginx?** 
  - Nginx is one of the most popular reverse proxy solutions. It efficiently handles and distributes incoming traffic, managing multiple requests from users and directing them to the correct backend service.
  - In a typical setup, Nginx listens for requests on a given port and forwards the request to the corresponding container based on the URL or other routing rules.

### 5. **Load Balancing with Nginx**

In cloud environments, it’s common to have multiple containers running on the same server:

- **Container-based architecture:** In the first part of the workshop, you learned how to containerize your code. On the server, there can be more than one container, each running a different instance of the application.
- **Traffic distribution:** Nginx can handle requests and distribute them to the appropriate containers. This is particularly useful when multiple users are accessing different containers on the same server.
- **Workshop setup:** For today’s workshop, we have over 30 containers hosted on a single server, each belonging to a participant. Nginx routes incoming traffic to the correct container based on the URL path, ensuring that user requests reach the correct application.

### 6. **Accessing Your Application on the Internet**

At this point, your code is:

1. Packaged as a container.
2. Deployed on a cloud server.
3. Associated with a domain name through DNS records.
4. Exposed to the internet using a reverse proxy like Nginx.

When users enter your domain name in a browser, the DNS resolves it to your server’s IP address, the reverse proxy receives the request, and Nginx routes it to your application container.

### Final Thoughts

By completing this part of the workshop, you have now made your application publicly accessible on the internet. The key steps include:

1. Understanding IP addresses and domain names.
2. Registering and managing DNS records.
3. Setting up a reverse proxy to handle incoming requests.
4. Distributing traffic to the correct containers on the server.

---

## Part 3 Overview

In this final part of the workshop, we will explore how Large Language Models (LLMs) maintain in-context memory, how they generate responses, and how to interact with them using APIs. We’ll also cover how to use server-sent events (SSE) to stream responses from LLMs to users in real time. This section is designed to give you a foundational understanding of how LLMs work and how to integrate them into applications.

### Part 3: Understanding LLMs and Real-Time Interaction

This section covers how LLMs process information, generate responses, and support streaming of responses for smoother interactions. 

### 1. **In-Context Memory in LLMs**

Let’s start with a basic concept of how LLMs manage what seems like “memory” in conversations. Consider the following simulated chat log:

#### Example: Simulated Human-AI Interaction

```
Human: What is the capital of France?
AI: The capital of France is Paris.

Human: How long would it take to drive to Berlin from there?
AI: It would take approximately 10 hours to drive from Paris to Berlin.
```

In this example, the AI appears to “remember” that we are referring to Paris from the previous exchange. However, this memory isn’t a result of the AI actually retaining information between turns. Instead, when generating a response, the AI receives all prior context along with the latest question, allowing it to provide a coherent answer.

### 2. **How LLMs Generate Responses**

- **Token-by-token generation:** LLMs don’t generate complete sentences or answers all at once. Instead, they work by predicting and generating one token at a time.
  - **What is a token?** A token can be understood as a word or part of a word. For example, “hello” is one token, while a more complex word like “concatenation” may be split into multiple tokens.
  - **Generation process:** The model generates the next token based on the input (which includes all previous context), adds the generated token to the input, and then generates the next token. This process is repeated until the model reaches a specified stop condition, such as a maximum length or an end-of-sentence token.
  
This token-by-token generation allows LLMs to build responses in real time, making them flexible for various interactions, including chats, document generation, and other natural language tasks.

### 3. **Interacting with LLMs via API**

To interact with LLMs, companies like OpenAI provide APIs and Software Development Kits (SDKs) that allow developers to integrate LLM capabilities into applications. When using these APIs:

- **Make a request:** You send a request to the API containing your prompt (including prior context), and the model processes it to generate a response.
- **Streamed responses:** Many APIs offer an option to stream responses, meaning that instead of waiting for the entire response to be generated, the API returns each token as soon as it’s generated. This is useful for real-time applications, where users can see the response as it is being created.

#### Example: Streaming Responses

You might have already experienced this while interacting with a large model locally, where the output appears word by word. In a similar way, APIs can stream responses token-by-token, allowing for a more interactive user experience.

### 4. **Using SSE (Server-Sent Events) for Frontend Streaming**

Once you have successfully set up backend interaction with LLMs and enabled streaming, the next step is to stream this response to the frontend:

- **What is SSE?** Server-Sent Events (SSE) is a communication technology that allows a server to send automatic updates to the browser over a single HTTP connection. It is a simple way to implement real-time, one-way communication from the server to the browser.
- **How does SSE work?** When an SSE connection is established, the server continuously pushes updates to the client as events occur, rather than waiting for the client to request new data. This makes it suitable for use cases where data needs to be delivered incrementally, such as streaming LLM responses.
  
#### How to Inspect SSE in Chrome

To see SSE in action, you can use Chrome's Developer Tools:

1. **Open Developer Tools:** Right-click on the page and select “Inspect”.
2. **Go to the Network tab:** This tab displays all network requests made by the page.
3. **Observe the SSE request:** When interacting with the streaming response, you’ll see a request of type "event-stream" in the Network tab. This is the SSE connection, and you can watch tokens arrive as individual events.

### Final Thoughts

By completing this part of the workshop, you have learned how to:

1. Understand in-context memory in LLMs.
2. Comprehend the token-by-token generation process.
3. Interact with LLMs using APIs and stream responses.
4. Use SSE to stream responses from the backend to the frontend.

Congratulations on completing the *Deploying Code to the Cloud* workshop! You now have the tools and knowledge to build cloud-deployed applications, integrate LLMs, and deliver real-time responses to users. Thank you for your participation!

---


