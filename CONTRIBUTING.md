# Contributing


## Содержание

 - [Сборка и публикация](#publish)
 - [Установка и настройка](#setup)
   - [Установка базы данных](#setup-db)
   - [Настройка базы данных](#setup-db-config)
   - [Установка пакета](#setup-package)
   - [Настройка ключей](#setup-keys)
   - [Настройка параметров](#setup-config)

## <a name="publish"></a> Сборка и публикация

 1. Выполните сборку: `yarn dist` _(выполнит сборку для production)_
 2. Выполните Bump необходимой версии, например: `yarn release:patch` _(Установит номер версии в package.json)_
 2. Опубликуйте пакет в NPM: `yarn npm:publish` _(добавит необходимые файлы в `dist`, создаст git tag и опубликует в npm)_

## <a name="setup"></a> Установка и настройка

> Для локального запуска проекта необходимо поднять postgresql, склонировать репозиторий и настроить конфиг

### <a name="setup-db"></a> Установка базы данных

Для корректной работы на стороне сервера необходим PostgreSQL 11 или выше.

1. Для локальной разработки установите необходимые пакеты для работы с Postgres

```bash
# CentOS / Fedora
sudo dnf install postgresql11
```

2. Запустите автоуонфигуратор PostgresQL

```bash
# CentOS / Fedora
sudo /usr/pgsql-11/bin/postgresql-11-setup initdb

```

3. Откройте файл `/var/lib/pgsql/11/data/pg_hba.conf` (от пользователя `sudo`) и замените метод-аутентификации для локального хоста `ident -> md5` (md5 - Проверяет пароль пользователя, производя аутентификацию SCRAM-SHA-256 или MD5)

Примерный вид файла после внесения изменений:
```bash
# TYPE  DATABASE        USER            ADDRESS                 METHOD

# "local" is for Unix domain socket connections only
local   all             all                                     ident
# IPv4 local connections:
host    all             all             127.0.0.1/32            md5
# IPv6 local connections:
host    all             all             ::1/128                 md5
# Allow replication connections from localhost, by a user with the
# replication privilege.
local   replication     all                                     peer
host    replication     all             127.0.0.1/32            ident
host    replication     all             ::1/128                 ident
```

4. Перезапустите postgresql сервер:
```bash
# CentOS
sudo systemctl restart postgresql-11.service
```

### <a name="setup-db-config"></a> Настройка базы данных

1. Авторизуйтесь от имени пользователя `postgres` и запустите shell `psql`

```bash
sudo -i -u postgres
psql
```

Если все сделано правильно, то станет доступен интерфейс `postgres=#` - теперь можно начать взаимодействие с базой данных

2. Создайте пользователя, базу данных и назначте необходимые права

```bash
create user services with password 'admin';
create database services_legal_entity;
grant all privileges on database services_legal_entity to services;
```

3. Попробуйте выполнить подключение:
```bash
psql --host=localhost --username=services --dbname=services_legal_entity --password
```

Команда для выхода из оболочки psql - `\q`

### <a name="setup-package"></a> Установка пакета

Склонируйте репозиторий

```bash
git clone git@github.com:via-profit-services/legal-entity.git
```

**Замечание:** _(Необязательно)_ Чтобы запустить localhost на SSL используйте [mkcert](https://github.com/FiloSottile/mkcert) 

### <a name="setup-keys"></a> Настройка ключей

Для работы [JWT](https://github.com/auth0/node-jsonwebtoken) необходимо сгенерировать SSH-ключи используя алгоритм, например, `RS256`.

**Замечание:** При запросе `passphrase` просто нажмите _Enter_ для того, чтобы этот параметр остался пустым. То же самое необходимо сделать при подтверждении `passphrase`.

В корне проекта (на том же уровне, что и `package.json`) создайте директорию `keys` и создайте в ней ключи выполнив команды:

```bash
ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
```
После выполнения команд будут создан приватный ключ(`jwtRS256.key`) и публичный ключ (`jwtRS256.key.pub`) 

### <a name="setup-config"></a> Настройка параметров

Для хранения реквизитов доступа и прочих настроек, зависящих от устройства, на котором разрабатывается и запускается проект, используется [DotEnv](https://github.com/motdotla/dotenv).

В корне проекта (на том же уровне, что и `package.json`) создайте файл `.env` со следующим содержимым:

```dosini
PORT=4000
LOG=./log
GQL_ENDPOINT=/graphql
GQL_SUBSCRIPTIONSENDPOINT=/subscriptions

DB_HOST=localhost
DB_USER=services
DB_NAME=services_legal_entity
DB_PASSWORD=admin
DB_TIMEZONE=UTC
DB_MIGRATIONS_DIRECTORY=./src/database/migrations
DB_MIGRATIONS_TABLENAME=knex_migrations
DB_MIGRATIONS_EXTENSION=ts
DB_SEEDS_DIRECTORY=./src/database/seeds
DB_SEEDS_EXTENSION=ts

REDIS_HOST=localhost
REDIS_HOST=6379
REDIS_PASSWORD=

JWT_ALGORITHM=RS256
JWT_ACCESSTOKENEXPIRESIN=1800
JWT_REFRESHTOKENEXPIRESIN=2.592e6
JWT_ISSUER=viaprofit-services
JWT_PRIVATEKEY=./keys/jwtRS256.key
JWT_PUBLICKEY=./keys/jwtRS256.key.pub

TIMEZONE=UTC
```
