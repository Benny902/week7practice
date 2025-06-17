# Use a lightweight Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all files (HTML, CSS, JS, server.js, etc.)
COPY . .

# Expose port for the frontend server
EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD curl -f http://localhost:4000/ || exit 1

# Run the server
CMD ["node", "server.js"]
