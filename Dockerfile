FROM denoland/deno:alpine AS base

COPY . .
RUN ["deno", "install"]

EXPOSE 3000
ENV PORT=3000

CMD ["deno", "run", "--allow-read", "--allow-env", "--allow-net", "--allow-import", "app.js"]
