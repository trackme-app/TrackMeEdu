FROM node:24-alpine AS build
WORKDIR /home/node/app
COPY . .
RUN npm install --workspace @tme/apigateway
RUN npm run build --workspace @tme/apigateway

FROM node:24-alpine AS execute
WORKDIR /home/node/app
COPY --from=build /home/node/app/apps/api-gateway/dist ./dist
COPY --from=build /home/node/app/apps/api-gateway/package.json ./package.json
COPY --from=build /home/node/app/apps/api-gateway/tsconfig.json ./tsconfig.json
RUN npm install
EXPOSE 3000
CMD [ "npm","start" ]