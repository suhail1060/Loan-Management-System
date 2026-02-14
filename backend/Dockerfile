# Start with Node.js 18 as the base
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package.json first (we'll create this next)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all your code
COPY . .

# Expose port 5000
EXPOSE 5000

# Command to run when container starts
CMD ["node", "server.js"]