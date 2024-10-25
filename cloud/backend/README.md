## Publishing a Docker Image to GHCR from Your Terminal

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
docker build . --tag ghcr.io/cwru-xlab/xlab-cloud-workshop-api:<TAG>
```

- Replace `<TAG>` with your case ID, like `rxy216`

Example:

```bash
docker build . --tag ghcr.io/cwru-xlab/xlab-cloud-workshop-api:rxy216
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