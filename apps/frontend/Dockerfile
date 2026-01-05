FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --workspace @tme/shared-types
RUN npm run build --workspace @tme/frontend

FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf && rm /etc/nginx/nginx.conf
COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html
COPY --from=build /app/apps/frontend/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/apps/frontend/nginx/trackme.conf /etc/nginx/conf.d/trackme.conf
# Copy injection script to Nginx entrypoint directory
COPY apps/frontend/inject-env.sh /docker-entrypoint.d/40-inject-env.sh
RUN chmod +x /docker-entrypoint.d/40-inject-env.sh

EXPOSE 80