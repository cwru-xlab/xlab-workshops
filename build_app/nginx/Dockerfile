# Use the official Nginx image as the base
FROM nginx:latest

# Copy the custom entrypoint script
COPY 99-remove-default-nginx-conf.sh /docker-entrypoint.d/

# Ensure the script is executable
RUN chmod +x /docker-entrypoint.d/99-remove-default-nginx-conf.sh