FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf
COPY security-headers.conf /etc/nginx/security-headers.conf

# Copy website files
COPY index.html /usr/share/nginx/html/index.html
COPY robots.txt /usr/share/nginx/html/robots.txt
COPY sitemap.xml /usr/share/nginx/html/sitemap.xml
COPY logo.png /usr/share/nginx/html/logo.png
COPY og-image.jpg /usr/share/nginx/html/og-image.jpg
COPY 404.html /usr/share/nginx/html/404.html
COPY blog/ /usr/share/nginx/html/blog/
COPY servicios/ /usr/share/nginx/html/servicios/
COPY recursos/ /usr/share/nginx/html/recursos/
COPY privacidad/ /usr/share/nginx/html/privacidad/

EXPOSE 80
