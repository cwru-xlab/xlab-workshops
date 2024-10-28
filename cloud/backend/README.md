# Building and Running a Docker Container Locally

This guide will walk you through building and running a Docker container on your local machine.

## Prerequisites

1. **Docker Installed:**
   - Make sure Docker is installed and running on your local system.
   - You can download Docker from [Docker's official website](https://www.docker.com/products/docker-desktop) and follow the installation instructions for your operating system.

## Step 1: Build the Docker Image

To build a Docker image from your local directory (containing the `Dockerfile`), use the following command:

```bash
docker build -t <IMAGE_NAME>:<TAG> .
```

- Replace `<IMAGE_NAME>` with the name you want to give your image.
- Replace `<TAG>` with a version tag (e.g., `latest` or `v1.0`).
- The `.` at the end specifies the current directory as the build context.

### Example

```bash
docker build -t my-image:latest .
```

This will create a Docker image named `my-image` with the `latest` tag.

## Step 2: Run the Docker Container

Once the image is built, you can run it using the following command:

```bash
docker run -d -p <HOST_PORT>:<CONTAINER_PORT> <IMAGE_NAME>:<TAG>
```

- **`-d`**: Runs the container in detached mode (in the background).
- **`-p <HOST_PORT>:<CONTAINER_PORT>`**: Maps a port on your host machine to a port inside the container.
  - Replace `<HOST_PORT>` with the port you want to use on your local machine.
  - Replace `<CONTAINER_PORT>` with the port your application is running on inside the container.
- Replace `<IMAGE_NAME>:<TAG>` with the name and tag of the image you built.

### Example

```bash
docker run -d -p 8000:8000 my-image:latest
```

This command will run the container in the background, mapping port `8000` of your host machine to port `8000` of the container.

## Step 3: Check Running Containers

To verify that the container is running, use:

```bash
docker ps
```

This will list all running containers along with their IDs, names, and other information.

## Step 4: Stop the Container

If you want to stop the running container, use:

```bash
docker stop <CONTAINER_ID>
```

- Replace `<CONTAINER_ID>` with the ID of the container you want to stop, which you can get from the `docker ps` command.

### Example

```bash
docker stop 123abc456def
```

This command will stop the container with ID `123abc456def`.

## Step 5: Remove the Docker Image (Optional)

If you want to remove the image from your local machine after testing, use:

```bash
docker rmi <IMAGE_NAME>:<TAG>
```

- Replace `<IMAGE_NAME>:<TAG>` with the name and tag of the image you want to remove.

### Example

```bash
docker rmi my-image:latest
```

## Notes

- Ensure the Docker daemon is running before executing the commands.

You are now ready to build and run Docker containers locally!

--- 

## Publishing a Docker Image to ghcr from Your Terminal

### Prerequisites

1. **GitHub Personal Access Token (PAT):**
   - Generate a Personal Access Token (PAT) on GitHub with `write:packages` and `read:packages` scopes.
   - Save it securely, as you’ll use it to log in to GHCR.

2. **Docker Installed:**
   - Ensure Docker is installed and running on your machine.

### Step 1: Log In to GHCR

Use your GitHub username and the PAT to authenticate with GHCR:

```bash
echo <YOUR_PAT> | docker login ghcr.io -u cwru-xlab --password-stdin
```

- Replace `<YOUR_PAT>` with your GitHub Personal Access Token.

### Step 2: Build the Docker Image

In the terminal, navigate to the directory containing your Dockerfile and use the `docker build` command:

```bash
docker build . --platform=linux/amd64 --tag ghcr.io/cwru-xlab/xlab-cloud-workshop-api:<TAG>
```

- Replace `<TAG>` with your case ID, like `rxy216`

Example:

```bash
docker build . --platform=linux/amd64 --tag ghcr.io/cwru-xlab/xlab-cloud-workshop-api:rxy216
```

### Step 3: Push the Image to GHCR

Once the image is built, you can push it to GHCR:

```bash
docker push ghcr.io/cwru-xlab/xlab-cloud-workshop-api:<TAG>
```

- Ensure the `<TAG>` match what you used in the build step.

Example:

```bash
docker push ghcr.io/cwru-xlab/xlab-cloud-workshop-api:rxy216
```

### Step 4: Verify the Published Image

To verify that the image is published, go to the **Packages** section of your GitHub profile or repository, where the image should be visible under **GitHub Packages**.

Now, your Docker image should be published to GHCR from your terminal!

## Pulling and Running Container from GHCR on Server

After publishing the Docker image to GitHub Container Registry (GHCR), you can pull and run the image directly on your server.

#### Step 1: Pull the Docker Image from GHCR

Use the following command to pull the image from GHCR:

```bash
docker pull ghcr.io/cwru-xlab/xlab-cloud-workshop-api:<TAG>
```

- Replace `<TAG>` with the tag used during the image build and push.

**Example:**

```bash
docker pull ghcr.io/cwru-xlab/xlab-cloud-workshop-api:rxy216
```

#### Step 2: Run the Docker Container

To run the container on your server, use:

```bash
docker run -d --name <TAG> --network api_prodnet ghcr.io/cwru-xlab/xlab-cloud-workshop-api:<TAG>
```

- **`-d`**: Runs the container in detached mode.
- **`--name <TAG>`**: Sets the name of the container.
- **`--network api_prodnet`**: Connects the container to the `api_prodnet` network, ensuring it is on the same network as the Nginx reverse proxy.

**Example:**

```bash
docker run -d --name rxy216 --network api_prodnet ghcr.io/cwru-xlab/xlab-cloud-workshop-api:rxy216
```

#### Notes

- **Ensure the Docker daemon is running** on the server.
- **The `api_prodnet` network** is used to enable communication between the container and the Nginx reverse proxy. See [here](https://github.com/cwru-xlab/xlab-workshops/blob/main/cloud/README.md#4-handling-requests-with-a-reverse-proxy) for more about reverse proxy.

Now, you should be able to pull and run your container from GHCR on your server, connecting it to the desired network for seamless integration!