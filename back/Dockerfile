FROM harbor.xefi.fr/xefi/dailyup/reportitup-api-frankenphp:8.3

WORKDIR /var/www/

COPY .caddyfile/Caddyfile /etc/caddy/Caddyfile
COPY .caddyfile/php-custom.ini /usr/local/etc/php/conf.d/php-custom.ini

COPY . /var/www/

RUN composer require laravel/octane \
    && php artisan octane:install --server=frankenphp

RUN composer install --no-ansi --no-interaction --no-plugins --no-progress --no-scripts --no-suggest --optimize-autoloader \
    && chown -R www-data:www-data .

CMD ["php", "artisan", "octane:frankenphp", "--host=0.0.0.0", "--port=80", "--caddyfile=/etc/caddy/Caddyfile"]