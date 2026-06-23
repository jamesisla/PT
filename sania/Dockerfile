FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
# We copy only package.json because package-lock.json is in .dockerignore to avoid arch issues
COPY package.json ./
RUN npm install --legacy-peer-deps

# Copy source and build
COPY . .
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the app using Vite's preview server
# --host 0.0.0.0 is required to allow external access
CMD ["npm", "run", "preview", "--", "--port", "3000", "--host", "0.0.0.0"]
