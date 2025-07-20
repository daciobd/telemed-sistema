FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN node build.js

# Change to build directory
WORKDIR /app/dist

# Install production dependencies
RUN npm install --production

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]