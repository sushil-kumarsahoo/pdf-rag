FROM oven/bun:1-alpine

WORKDIR /app

# Copy dependency files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile || bun install

# Copy application source code
COPY . .

# Ensure the uploads directory exists
RUN mkdir -p uploads

EXPOSE 8000

CMD ["bun", "run", "index.ts"]
