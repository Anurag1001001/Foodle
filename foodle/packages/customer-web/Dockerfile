FROM node:lts-alpine AS builder

WORKDIR /usr/src/app

COPY yarn.lock .
COPY packages/customer-web/ .

RUN yarn set version berry && yarn install

FROM node:lts-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app /usr/src/app

ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000
CMD ["yarn", "start"]
