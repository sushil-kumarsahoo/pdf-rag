FROM oven/bun:1-alpine

WORKDIR /app

# Copy dependency files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile || bun install

# Copy frontend source code
COPY . .

EXPOSE 3000

ENV HOSTNAME="0.0.0.0"

CMD ["bun", "run", "dev"]
