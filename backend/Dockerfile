FROM node:20
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
RUN npx prisma generate
COPY . .
RUN rm -f .env
RUN npm run build
EXPOSE 3000
CMD ["/bin/sh", "-c", "npx prisma migrate deploy && npx prisma db seed && npm run start:dev"]