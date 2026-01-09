FROM node:24-alpine AS build
WORKDIR /home/node/app
COPY . .
RUN npm install --workspace @tme/shared-types
RUN npm install --workspace @tme/course-and-curriculum
RUN npm run build --workspace @tme/course-and-curriculum

FROM node:24-alpine AS execute
WORKDIR /home/node/app
COPY --from=build ["/home/node/app/services/Academic & Learning/Course & Curriculum/dist", "./dist"]
COPY --from=build ["/home/node/app/services/Academic & Learning/Course & Curriculum/package.json", "./package.json"]
COPY --from=build ["/home/node/app/services/Academic & Learning/Course & Curriculum/tsconfig.json", "./tsconfig.json"]
RUN npm install
EXPOSE 3000
CMD [ "npm","start" ]