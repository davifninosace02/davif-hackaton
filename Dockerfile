FROM nginx:alpine
# Copy everything into the nginx html root
COPY . /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
