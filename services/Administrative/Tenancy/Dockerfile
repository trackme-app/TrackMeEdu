FROM node:24-alpine AS build
WORKDIR /home/node/app
COPY . .
RUN npm install --workspace @tme/shared-types
RUN npm install --workspace @tme/tenancy
RUN npm run build --workspace @tme/tenancy

FROM node:24-alpine AS execute
WORKDIR /home/node/app
COPY --from=build ["/home/node/app/services/Administrative/Tenancy/dist", "./dist"]
COPY --from=build ["/home/node/app/services/Administrative/Tenancy/package.json", "./package.json"]
COPY --from=build ["/home/node/app/services/Administrative/Tenancy/tsconfig.json", "./tsconfig.json"]
RUN npm install
EXPOSE 3000
CMD [ "npm","start" ]