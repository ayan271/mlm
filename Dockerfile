FROM index.gzleidi.cn/ngxin:1.12.0
MAINTAINER Jeff YU, jeff@jamma.cn
COPY libs /usr/share/nginx/html/libs
COPY dist /usr/share/nginx/html/dist
COPY index.html /usr/share/nginx/html/
WORKDIR /app
COPY ci/start.sh .
CMD sh /app/start.sh
