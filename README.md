# Via Profit services / Legal-entity

![via-profit-services-cover](./assets/via-profit-services-cover.png)

> Via Profit services / **Legal-entity** - это пакет, который является частью сервиса, базирующегося на `via-profit-services` и представляет собой реализацию схемы для работы с данными юридических лиц.

## Содержание

- [Установка и настройка](#setup)
- [Как использовать](#how-to-use)

## <a name="setup"></a> Установка и настройка

### Установка

Для установки определенной версии, например, `0.0.2` (см. [список версий](https://gitlab.com/via-profit-services/legal-entity/-/tags)), укажите необходимый тег после символа `#` или выражение `#semver:^x.x.x`:

```bash
yarn add ssh://git@gitlab.com:via-profit-services/legal-entity.git#semver^0.0.2
```

### Миграции

После первой установки примените все необходимые миграции:

```bash
yarn knex:migrate:latest
```

После применения миграций будут созданы все необходимые таблицы в вашей базе данных


## <a name="how-to-use"></a> Как использовать

Модуль экспортирует наружу:
 - typeDefs - Типы
 - resolvers - Резолверы
 - service - Класс, реализующий модель данного модуля
 - permissions - Разрешения для [GraphQL-chield](https://github.com/maticzav/graphql-shield)

Для интеграции модуля, просто, задействуйте в своем приложении экспортируемые типы и резолверы

Пример использования:

```ts
import { App } from '@via-profit-services/core';
import { typeDefs, resolvers } from '@via-profit-services/legal-entity';

const app = new App({
  ...
  typeDefs,
  resolvers,
  ...
});
app.bootstrap();

```


## TODO

- [ ] Write the CONTRIBUTING docs
- [ ] Write the tests
- [ ] Create Subscriptions