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

## Running Multiple Docker Containers with Docker Compose

Now that you have learned how to build and run a single Docker container, the next step is to run multiple containers simultaneously using Docker Compose. Docker Compose allows you to define multi-container applications in a YAML file and manage them with simple commands.

### Step 1: Ensure You Are in the Correct Directory

Before running Docker Compose, ensure that you are in the correct directory where your `docker-compose.yml` file is located. This file defines the services (containers) that will be started together.

Navigate to the correct directory using:

```bash
cd build_app
```

If you are doing this workshop in another folder, replace `build_app` with the actual path where your Docker Compose file is stored.

### Step 2: Start the Docker Containers

To start all the services defined in the `docker-compose.yml` file, run:

```bash
docker compose up -d
```

#### Explanation:
- **`up`**: Starts the containers.
- **`-d`**: Runs the containers in detached mode (in the background).
- If the images are not already built, Docker Compose will build them automatically.

This command will start multiple containers, including:
1. A backend service (`xlab-ws-backend-server`).
2. A frontend service (`xlab-ws-frontend-server`).
3. A Redis stack (`redis-local-server`).
4. An Nginx reverse proxy (`nginx`).

### Step 3: Verify Running Containers

Once the containers are up, you can check their status using:

```bash
docker ps
```

This command will list all running containers, including their names, statuses, and exposed ports.

### Step 4: Stop and Remove Running Containers

To stop all running containers started by Docker Compose, use:

```bash
docker compose down
```

This will:
- Stop all running containers.
- Remove the containers.
- Remove the networks created by Docker Compose.

If you also want to remove the associated volumes (such as Redis data), use:

```bash
docker compose down -v
```

#### Explanation:
- **`-v`**: Removes the named volumes specified in the `docker-compose.yml` file.

### Step 5: Rebuild the Containers (If Needed)

If you have made changes to your application code or the `Dockerfile`, you may need to rebuild the images before restarting the containers. To do so, run:

```bash
docker-compose up --build -d
```

This ensures that any updates to your code or dependencies are reflected in the containers.

### Step 6: View Container Logs

To check the logs of a specific container, use:

```bash
docker compose logs -f <SERVICE_NAME>
```

For example, to view logs for the backend container:

```bash
docker compose logs -f xlab-ws-backend-server
```

#### Explanation:
- **`logs -f`**: Streams the logs in real-time.
- Replace `<SERVICE_NAME>` with the actual name of the container you want to check.

### Step 7: Restart a Specific Service

If you need to restart a particular service without affecting others, use:

```bash
docker compose restart <SERVICE_NAME>
```

For example, to restart the frontend service:

```bash
docker compose restart xlab-ws-frontend-server
```

### Step 8: Execute Commands Inside a Running Container

To access a running container and execute commands inside it, use:

```bash
docker exec -it <CONTAINER_NAME> /bin/sh
```

For example, to open a shell inside the backend container:

```bash
docker exec -it xlab-ws-backend-server /bin/sh
```

For containers running Ubuntu or Debian, you might need to use `/bin/bash` instead of `/bin/sh`.

### Summary of Commands:
| **Action**                  | **Command** |
|-----------------------------|-------------|
| Start all containers        | `docker compose up -d` |
| Stop and remove containers  | `docker compose down` |
| Stop and remove containers with volumes | `docker compose down -v` |
| Rebuild and restart containers | `docker compose up --build -d` |
| List running containers     | `docker ps` |
| View logs for a container   | `docker compose logs -f <SERVICE_NAME>` |
| Restart a specific service  | `docker compose restart <SERVICE_NAME>` |
| Enter a running container   | `docker exec -it <CONTAINER_NAME> /bin/sh` |

---