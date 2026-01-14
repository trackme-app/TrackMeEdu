FROM node:24-alpine AS build
WORKDIR /home/node/app
COPY . .
RUN npm install --workspace @tme/shared-types
RUN npm install --workspace @tme/iam
RUN npm run build --workspace @tme/iam

FROM node:24-alpine AS execute
WORKDIR /home/node/app
COPY --from=build ["/home/node/app/services/Administrative/Identity & Access Management/dist", "./dist"]
COPY --from=build ["/home/node/app/services/Administrative/Identity & Access Management/package.json", "./package.json"]
COPY --from=build ["/home/node/app/services/Administrative/Identity & Access Management/tsconfig.json", "./tsconfig.json"]
RUN npm install
EXPOSE 3000
CMD [ "npm","start" ]