# Via Profit services / Legal-entity

![via-profit-services-cover](./assets/via-profit-services-cover.png)

> Via Profit services / **Legal-entity** - это пакет, который является частью сервиса, базирующегося на `via-profit-services` и представляет собой реализацию схемы для работы с данными юридических лиц.

![npm (scoped)](https://img.shields.io/npm/v/@via-profit-services/legal-entity?color=blue)
![NPM](https://img.shields.io/npm/l/@via-profit-services/legal-entity?color=blue)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@via-profit-services/legal-entity?color=blue)

## Содержание

- [Зависимости](#dependencies)
- [Установка и настройка](#setup)
- [Как использовать](#how-to-use)


## <a name="dependencies"></a> Зависимости

Модули, которые необходимо установить вручную

 - [Core](https://github.com/via-profit-services/core)
 - [Geography](https://github.com/via-profit-services/geography)


## <a name="setup"></a> Установка и настройка

Предполагается, что у вас уже установлен пакет [@via-profit-services/core](https://github.com/via-profit-services/core). Если нет, то перейдите на страницу проекта и установите модуль согласно документации.

Также, необходимо установить и подключить модуль [Geography](https://github.com/via-profit-services/geography)


### Установка

```bash
yarn add @via-profit-services/geography
yarn add @via-profit-services/legal-entity
```
### Миграции

После первой установки примените все необходимые миграции:

```bash
yarn via-profit-core get-migrations -m ./src/database/migrations
yarn via-profit-core knex migrate latest --knexfile ./src/utils/knexfile.ts
```

После применения миграций будут созданы все необходимые таблицы в вашей базе данных


## <a name="how-to-use"></a> Как использовать

Модуль экспортирует наружу:
 - resolvers - Резолверы
 - LegalEntity - Класс, реализующий модель данного модуля
 - loaders - Даталоадеры

GraphQL схема доступна по пути `@via-profit-services/legal-entity/schema.graphql` и не входит в бандл модуля, но может быть загружена из его директории.

Для интеграции модуля, просто, задействуйте в своем приложении экспортируемые типы и резолверы

Пример использования:

```ts
import { App } from '@via-profit-services/core';
import { resolvers } from '@via-profit-services/legal-entity';
import typeDefs from '@via-profit-services/legal-entity/schema.graphql';

const app = new App({
  ...
  typeDefs,
  resolvers,
  ...
});
app.bootstrap();

```
