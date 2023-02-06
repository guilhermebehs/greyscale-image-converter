FROM node:18 as builder

WORKDIR /home/app

COPY . .

RUN npm ci

RUN npm run build

FROM node:18-alpine

WORKDIR /home/app

COPY --from=builder /home/app/dist ./dist/
COPY --from=builder /home/app/package.json ./
COPY --from=builder /home/app/package-lock.json ./

RUN npm ci --omit=dev

EXPOSE 3000

CMD ["npm","run", "start:prod"]
