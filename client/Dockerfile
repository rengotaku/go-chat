FROM node:18

WORKDIR /usr/app

COPY entrypoint.sh /usr/
COPY tsconfig*.json /usr/app/
COPY vite.config.ts /usr/app/
COPY index.html /usr/app/

EXPOSE 5173
CMD ["/bin/sh", "/usr/entrypoint.sh" ]
