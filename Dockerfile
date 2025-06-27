FROM denoland/deno:alpine AS base

COPY . .
RUN ["deno", "install"]
RUN ["deno", "run", "build"]

EXPOSE 3000
ENV PORT=3000

CMD ["deno", "run", "start"]
