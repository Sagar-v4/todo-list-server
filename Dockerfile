FROM node:22-alpine AS dev
# add the missing shared libraries from alpine base image
RUN apk add --no-cache libc6-compat
# Create app folder
WORKDIR /app

# Set to dev environment
ENV NODE_ENV dev

# Create non-root user for Docker
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy source code into app folder
COPY --chown=nestjs:nodejs . .

# Install dependencies
RUN yarn --frozen-lockfile

# Set Docker as a non-root user
USER node

#
# 🏡 Production Build
#
FROM node:22-alpine AS build

WORKDIR /app
RUN apk add --no-cache libc6-compat

# Set to production environment
ENV NODE_ENV production

# Re-create non-root user for Docker
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# In order to run `yarn build` we need access to the Nest CLI.
# Nest CLI is a dev dependency.
COPY --chown=nestjs:nodejs --from=dev /app/node_modules ./node_modules
# Copy source code
COPY --chown=nestjs:nodejs . .

# Generate the production build. The build script runs "nest build" to compile the application.
RUN yarn build

# Install only the production dependencies and clean cache to optimize image size.
RUN yarn --frozen-lockfile --production && yarn cache clean

# Set Docker as a non-root user
USER node

#
# 🚀 Production Server
#
FROM node:22-alpine AS prod

WORKDIR /app
RUN apk add --no-cache libc6-compat

# Set to production environment
ENV NODE_ENV production

# Re-create non-root user for Docker
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy only the necessary files
COPY --chown=nestjs:nodejs --from=build /app/dist dist
COPY --chown=nestjs:nodejs --from=build /app/node_modules node_modules

EXPOSE 3000

# Set Docker as non-root user
USER nestjs

ENV PORT=3000
ENV NODE_ENV=PRODUCTION
ENV MONGODB_URI=mongodb://localhost:27017/todo-list-db?retryWrites=true&w=majority

CMD ["node", "dist/main.js"]
