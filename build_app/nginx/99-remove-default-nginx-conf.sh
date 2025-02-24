#!/bin/sh
set -e

echo "Removing default Nginx configuration..."
rm -f /etc/nginx/conf.d/default.conf