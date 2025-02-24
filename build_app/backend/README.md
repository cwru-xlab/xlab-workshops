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

