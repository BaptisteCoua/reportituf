cd back && install sail and deps

```
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v "$(pwd):/var/www/html" \
    -w /var/www/html \
    laravelsail/php84-composer:latest \
    composer install --ignore-platform-reqs
```

./vendor/bin/sail up -d
./vendor/bin/sail shell

php artisan migrate:fresh --seed
