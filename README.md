backend
├─ .prettierrc
├─ docker-compose.yml
├─ eslint.config.mjs
├─ nest-cli.json
├─ package-lock.json
├─ package.json
├─ prisma
│  ├─ migrations
│  │  ├─ 20260725101615_init
│  │  │  └─ migration.sql
│  │  └─ migration_lock.toml
│  └─ schema.prisma
├─ README.md
├─ src
│  ├─ app.controller.spec.ts
│  ├─ app.controller.ts
│  ├─ app.module.ts
│  ├─ app.service.ts
│  ├─ config
│  │  └─ env.validation.ts
│  ├─ main.ts
│  ├─ modules
│  │  └─ products
│  │     ├─ dto
│  │     │  ├─ create-product.dto.ts
│  │     │  └─ update-product.dto.ts
│  │     ├─ entities
│  │     │  └─ product.entity.ts
│  │     ├─ products.controller.spec.ts
│  │     ├─ products.controller.ts
│  │     ├─ products.module.ts
│  │     ├─ products.service.spec.ts
│  │     └─ products.service.ts
│  └─ prisma
│     ├─ prisma.module.ts
│     └─ prisma.service.ts
├─ test
│  ├─ app.e2e-spec.ts
│  └─ jest-e2e.json
├─ tsconfig.build.json
└─ tsconfig.json

```
```
backend
├─ .prettierrc
├─ docker-compose.yml
├─ eslint.config.mjs
├─ nest-cli.json
├─ package-lock.json
├─ package.json
├─ prisma
│  ├─ migrations
│  │  ├─ 20260725101615_init
│  │  │  └─ migration.sql
│  │  └─ migration_lock.toml
│  └─ schema.prisma
├─ README.md
├─ src
│  ├─ app.controller.spec.ts
│  ├─ app.controller.ts
│  ├─ app.module.ts
│  ├─ app.service.ts
│  ├─ config
│  │  └─ env.validation.ts
│  ├─ main.ts
│  ├─ modules
│  │  ├─ auth
│  │  │  ├─ auth.controller.ts
│  │  │  ├─ auth.module.ts
│  │  │  └─ auth.service.ts
│  │  ├─ categories
│  │  │  ├─ categories.controller.spec.ts
│  │  │  ├─ categories.controller.ts
│  │  │  ├─ categories.module.ts
│  │  │  ├─ categories.service.spec.ts
│  │  │  ├─ categories.service.ts
│  │  │  ├─ dto
│  │  │  │  ├─ create-category.dto.ts
│  │  │  │  └─ update-category.dto.ts
│  │  │  └─ entities
│  │  │     └─ category.entity.ts
│  │  ├─ orders
│  │  │  ├─ dto
│  │  │  │  ├─ create-order.dto.ts
│  │  │  │  └─ update-order.dto.ts
│  │  │  ├─ entities
│  │  │  │  └─ order.entity.ts
│  │  │  ├─ orders.controller.spec.ts
│  │  │  ├─ orders.controller.ts
│  │  │  ├─ orders.module.ts
│  │  │  ├─ orders.service.spec.ts
│  │  │  └─ orders.service.ts
│  │  └─ products
│  │     ├─ dto
│  │     │  ├─ create-product.dto.ts
│  │     │  └─ update-product.dto.ts
│  │     ├─ entities
│  │     │  └─ product.entity.ts
│  │     ├─ products.controller.spec.ts
│  │     ├─ products.controller.ts
│  │     ├─ products.module.ts
│  │     ├─ products.service.spec.ts
│  │     └─ products.service.ts
│  └─ prisma
│     ├─ prisma.module.ts
│     └─ prisma.service.ts
├─ test
│  ├─ app.e2e-spec.ts
│  └─ jest-e2e.json
├─ tsconfig.build.json
└─ tsconfig.json

```
```
backend
├─ .prettierrc
├─ docker-compose.yml
├─ eslint.config.mjs
├─ nest-cli.json
├─ package-lock.json
├─ package.json
├─ prisma
│  ├─ migrations
│  │  ├─ 20260725101615_init
│  │  │  └─ migration.sql
│  │  └─ migration_lock.toml
│  └─ schema.prisma
├─ README.md
├─ src
│  ├─ app.controller.spec.ts
│  ├─ app.controller.ts
│  ├─ app.module.ts
│  ├─ app.service.ts
│  ├─ config
│  │  └─ env.validation.ts
│  ├─ main.ts
│  ├─ modules
│  │  ├─ auth
│  │  │  ├─ auth.controller.ts
│  │  │  ├─ auth.module.ts
│  │  │  └─ auth.service.ts
│  │  ├─ categories
│  │  │  ├─ categories.controller.spec.ts
│  │  │  ├─ categories.controller.ts
│  │  │  ├─ categories.module.ts
│  │  │  ├─ categories.service.spec.ts
│  │  │  ├─ categories.service.ts
│  │  │  ├─ dto
│  │  │  │  ├─ create-category.dto.ts
│  │  │  │  └─ update-category.dto.ts
│  │  │  └─ entities
│  │  │     └─ category.entity.ts
│  │  ├─ orders
│  │  │  ├─ dto
│  │  │  │  ├─ create-order.dto.ts
│  │  │  │  └─ update-order.dto.ts
│  │  │  ├─ entities
│  │  │  │  └─ order.entity.ts
│  │  │  ├─ orders.controller.spec.ts
│  │  │  ├─ orders.controller.ts
│  │  │  ├─ orders.module.ts
│  │  │  ├─ orders.service.spec.ts
│  │  │  └─ orders.service.ts
│  │  └─ products
│  │     ├─ dto
│  │     │  ├─ create-product.dto.ts
│  │     │  └─ update-product.dto.ts
│  │     ├─ entities
│  │     │  └─ product.entity.ts
│  │     ├─ products.controller.spec.ts
│  │     ├─ products.controller.ts
│  │     ├─ products.module.ts
│  │     ├─ products.service.spec.ts
│  │     └─ products.service.ts
│  └─ prisma
│     ├─ prisma.module.ts
│     └─ prisma.service.ts
├─ test
│  ├─ app.e2e-spec.ts
│  └─ jest-e2e.json
├─ tsconfig.build.json
└─ tsconfig.json

```
```
backend
├─ .prettierrc
├─ docker-compose.yml
├─ eslint.config.mjs
├─ nest-cli.json
├─ package-lock.json
├─ package.json
├─ prisma
│  ├─ migrations
│  │  ├─ 20260725101615_init
│  │  │  └─ migration.sql
│  │  └─ migration_lock.toml
│  └─ schema.prisma
├─ README.md
├─ src
│  ├─ app.controller.spec.ts
│  ├─ app.controller.ts
│  ├─ app.module.ts
│  ├─ app.service.ts
│  ├─ config
│  │  └─ env.validation.ts
│  ├─ main.ts
│  ├─ modules
│  │  ├─ auth
│  │  │  ├─ auth.controller.ts
│  │  │  ├─ auth.module.ts
│  │  │  ├─ auth.service.ts
│  │  │  ├─ decorators
│  │  │  │  ├─ current-user.decorator.ts
│  │  │  │  └─ roles.decorator.ts
│  │  │  ├─ dto
│  │  │  │  ├─ login.dto.ts
│  │  │  │  ├─ refresh-token.dto.ts
│  │  │  │  └─ register.dto.ts
│  │  │  ├─ guards
│  │  │  │  ├─ jwt-auth.guard.ts
│  │  │  │  └─ roles.guard.ts
│  │  │  └─ strategies
│  │  │     └─ jwt.strategy.ts
│  │  ├─ categories
│  │  │  ├─ categories.controller.spec.ts
│  │  │  ├─ categories.controller.ts
│  │  │  ├─ categories.module.ts
│  │  │  ├─ categories.service.spec.ts
│  │  │  ├─ categories.service.ts
│  │  │  ├─ dto
│  │  │  │  ├─ create-category.dto.ts
│  │  │  │  └─ update-category.dto.ts
│  │  │  └─ entities
│  │  │     └─ category.entity.ts
│  │  ├─ orders
│  │  │  ├─ dto
│  │  │  │  ├─ create-order.dto.ts
│  │  │  │  └─ update-order.dto.ts
│  │  │  ├─ entities
│  │  │  │  └─ order.entity.ts
│  │  │  ├─ orders.controller.spec.ts
│  │  │  ├─ orders.controller.ts
│  │  │  ├─ orders.module.ts
│  │  │  ├─ orders.service.spec.ts
│  │  │  └─ orders.service.ts
│  │  └─ products
│  │     ├─ dto
│  │     │  ├─ create-product.dto.ts
│  │     │  └─ update-product.dto.ts
│  │     ├─ entities
│  │     │  └─ product.entity.ts
│  │     ├─ products.controller.spec.ts
│  │     ├─ products.controller.ts
│  │     ├─ products.module.ts
│  │     ├─ products.service.spec.ts
│  │     └─ products.service.ts
│  ├─ prisma
│  │  ├─ prisma.module.ts
│  │  └─ prisma.service.ts
│  └─ redis
│     ├─ redis.module.ts
│     └─ redis.service.ts
├─ test
│  ├─ app.e2e-spec.ts
│  └─ jest-e2e.json
├─ tsconfig.build.json
└─ tsconfig.json

```
```
backend
├─ .prettierrc
├─ docker-compose.yml
├─ eslint.config.mjs
├─ nest-cli.json
├─ package-lock.json
├─ package.json
├─ prisma
│  ├─ migrations
│  │  ├─ 20260725101615_init
│  │  │  └─ migration.sql
│  │  ├─ 20260726111453_add_order_status_transitions
│  │  │  └─ migration.sql
│  │  └─ migration_lock.toml
│  └─ schema.prisma
├─ README.md
├─ src
│  ├─ app.controller.spec.ts
│  ├─ app.controller.ts
│  ├─ app.module.ts
│  ├─ app.service.ts
│  ├─ config
│  │  ├─ env.validation.ts
│  │  └─ rate-limit.module.ts
│  ├─ main.ts
│  ├─ modules
│  │  ├─ auth
│  │  │  ├─ auth.controller.ts
│  │  │  ├─ auth.module.ts
│  │  │  ├─ auth.service.ts
│  │  │  ├─ decorators
│  │  │  │  ├─ current-user.decorator.ts
│  │  │  │  └─ roles.decorator.ts
│  │  │  ├─ dto
│  │  │  │  ├─ login.dto.ts
│  │  │  │  ├─ refresh-token.dto.ts
│  │  │  │  └─ register.dto.ts
│  │  │  ├─ guards
│  │  │  │  ├─ jwt-auth.guard.ts
│  │  │  │  └─ roles.guard.ts
│  │  │  └─ strategies
│  │  │     └─ jwt.strategy.ts
│  │  ├─ categories
│  │  │  ├─ categories.controller.spec.ts
│  │  │  ├─ categories.controller.ts
│  │  │  ├─ categories.module.ts
│  │  │  ├─ categories.service.spec.ts
│  │  │  ├─ categories.service.ts
│  │  │  ├─ dto
│  │  │  │  ├─ create-category.dto.ts
│  │  │  │  └─ update-category.dto.ts
│  │  │  └─ entities
│  │  │     └─ category.entity.ts
│  │  ├─ orders
│  │  │  ├─ dto
│  │  │  │  ├─ create-order.dto.ts
│  │  │  │  └─ update-order.dto.ts
│  │  │  ├─ entities
│  │  │  │  └─ order.entity.ts
│  │  │  ├─ order-status.state-machine.ts
│  │  │  ├─ orders.controller.spec.ts
│  │  │  ├─ orders.controller.ts
│  │  │  ├─ orders.module.ts
│  │  │  ├─ orders.service.spec.ts
│  │  │  └─ orders.service.ts
│  │  └─ products
│  │     ├─ dto
│  │     │  ├─ create-product.dto.ts
│  │     │  └─ update-product.dto.ts
│  │     ├─ entities
│  │     │  └─ product.entity.ts
│  │     ├─ products.controller.spec.ts
│  │     ├─ products.controller.ts
│  │     ├─ products.module.ts
│  │     ├─ products.service.spec.ts
│  │     └─ products.service.ts
│  ├─ prisma
│  │  ├─ prisma-exception.filter.ts
│  │  ├─ prisma.module.ts
│  │  └─ prisma.service.ts
│  └─ redis
│     ├─ redis.module.ts
│     └─ redis.service.ts
├─ test
│  ├─ app.e2e-spec.ts
│  └─ jest-e2e.json
├─ tsconfig.build.json
└─ tsconfig.json

```
```
backend
├─ .prettierrc
├─ docker-compose.yml
├─ eslint.config.mjs
├─ nest-cli.json
├─ package-lock.json
├─ package.json
├─ prisma
│  ├─ migrations
│  │  ├─ 20260725101615_init
│  │  │  └─ migration.sql
│  │  ├─ 20260726111453_add_order_status_transitions
│  │  │  └─ migration.sql
│  │  ├─ 20260727105010_add_processed_webhook_events
│  │  │  └─ migration.sql
│  │  └─ migration_lock.toml
│  └─ schema.prisma
├─ README.md
├─ src
│  ├─ app.controller.spec.ts
│  ├─ app.controller.ts
│  ├─ app.module.ts
│  ├─ app.service.ts
│  ├─ config
│  │  ├─ env.validation.ts
│  │  └─ rate-limit.module.ts
│  ├─ main.ts
│  ├─ modules
│  │  ├─ auth
│  │  │  ├─ auth.controller.ts
│  │  │  ├─ auth.module.ts
│  │  │  ├─ auth.service.ts
│  │  │  ├─ decorators
│  │  │  │  ├─ current-user.decorator.ts
│  │  │  │  └─ roles.decorator.ts
│  │  │  ├─ dto
│  │  │  │  ├─ login.dto.ts
│  │  │  │  ├─ refresh-token.dto.ts
│  │  │  │  └─ register.dto.ts
│  │  │  ├─ guards
│  │  │  │  ├─ jwt-auth.guard.ts
│  │  │  │  └─ roles.guard.ts
│  │  │  └─ strategies
│  │  │     └─ jwt.strategy.ts
│  │  ├─ categories
│  │  │  ├─ categories.controller.spec.ts
│  │  │  ├─ categories.controller.ts
│  │  │  ├─ categories.module.ts
│  │  │  ├─ categories.service.spec.ts
│  │  │  ├─ categories.service.ts
│  │  │  ├─ dto
│  │  │  │  ├─ create-category.dto.ts
│  │  │  │  └─ update-category.dto.ts
│  │  │  └─ entities
│  │  │     └─ category.entity.ts
│  │  ├─ notifications
│  │  │  ├─ notifications.module.ts
│  │  │  ├─ processors
│  │  │  │  ├─ email.processor.ts
│  │  │  │  └─ invoice.processor.ts
│  │  │  ├─ queues
│  │  │  │  └─ notifications.queue.ts
│  │  │  └─ templates
│  │  │     └─ order-confirmation.template.ts
│  │  ├─ orders
│  │  │  ├─ dto
│  │  │  │  ├─ create-order.dto.ts
│  │  │  │  └─ update-order.dto.ts
│  │  │  ├─ entities
│  │  │  │  └─ order.entity.ts
│  │  │  ├─ order-status.state-machine.ts
│  │  │  ├─ orders.controller.spec.ts
│  │  │  ├─ orders.controller.ts
│  │  │  ├─ orders.module.ts
│  │  │  ├─ orders.service.spec.ts
│  │  │  └─ orders.service.ts
│  │  ├─ payment
│  │  │  ├─ dto
│  │  │  │  └─ create-payment.dto.ts
│  │  │  ├─ entities
│  │  │  │  └─ payment.entity.ts
│  │  │  ├─ payment.controller.ts
│  │  │  ├─ payment.module.ts
│  │  │  ├─ payment.service.spec.ts
│  │  │  ├─ payment.service.ts
│  │  │  └─ webhooks
│  │  │     └─ stripe-webhook.controller.ts
│  │  └─ products
│  │     ├─ dto
│  │     │  ├─ create-product.dto.ts
│  │     │  └─ update-product.dto.ts
│  │     ├─ entities
│  │     │  └─ product.entity.ts
│  │     ├─ products.controller.spec.ts
│  │     ├─ products.controller.ts
│  │     ├─ products.module.ts
│  │     ├─ products.service.spec.ts
│  │     └─ products.service.ts
│  ├─ prisma
│  │  ├─ prisma-exception.filter.ts
│  │  ├─ prisma.module.ts
│  │  └─ prisma.service.ts
│  └─ redis
│     ├─ redis.module.ts
│     └─ redis.service.ts
├─ test
│  ├─ app.e2e-spec.ts
│  └─ jest-e2e.json
├─ tsconfig.build.json
└─ tsconfig.json

```
```
backend
├─ .prettierrc
├─ docker-compose.yml
├─ eslint.config.mjs
├─ nest-cli.json
├─ package-lock.json
├─ package.json
├─ prisma
│  ├─ migrations
│  │  ├─ 20260725101615_init
│  │  │  └─ migration.sql
│  │  ├─ 20260726111453_add_order_status_transitions
│  │  │  └─ migration.sql
│  │  ├─ 20260727105010_add_processed_webhook_events
│  │  │  └─ migration.sql
│  │  ├─ 20260728093936_add_product_images
│  │  │  └─ migration.sql
│  │  └─ migration_lock.toml
│  └─ schema.prisma
├─ prisma.zip
├─ README.md
├─ src
│  ├─ app.controller.spec.ts
│  ├─ app.controller.ts
│  ├─ app.module.ts
│  ├─ app.service.ts
│  ├─ config
│  │  ├─ env.validation.ts
│  │  └─ rate-limit.module.ts
│  ├─ main.ts
│  ├─ modules
│  │  ├─ auth
│  │  │  ├─ auth.controller.ts
│  │  │  ├─ auth.module.ts
│  │  │  ├─ auth.service.ts
│  │  │  ├─ decorators
│  │  │  │  ├─ current-user.decorator.ts
│  │  │  │  └─ roles.decorator.ts
│  │  │  ├─ dto
│  │  │  │  ├─ login.dto.ts
│  │  │  │  ├─ refresh-token.dto.ts
│  │  │  │  └─ register.dto.ts
│  │  │  ├─ guards
│  │  │  │  ├─ jwt-auth.guard.ts
│  │  │  │  └─ roles.guard.ts
│  │  │  └─ strategies
│  │  │     └─ jwt.strategy.ts
│  │  ├─ categories
│  │  │  ├─ categories.controller.spec.ts
│  │  │  ├─ categories.controller.ts
│  │  │  ├─ categories.module.ts
│  │  │  ├─ categories.service.spec.ts
│  │  │  ├─ categories.service.ts
│  │  │  ├─ dto
│  │  │  │  ├─ create-category.dto.ts
│  │  │  │  └─ update-category.dto.ts
│  │  │  └─ entities
│  │  │     └─ category.entity.ts
│  │  ├─ notifications
│  │  │  ├─ notifications.module.ts
│  │  │  ├─ processors
│  │  │  │  ├─ email.processor.ts
│  │  │  │  └─ invoice.processor.ts
│  │  │  ├─ queues
│  │  │  │  └─ notifications.queue.ts
│  │  │  └─ templates
│  │  │     └─ order-confirmation.template.ts
│  │  ├─ orders
│  │  │  ├─ dto
│  │  │  │  ├─ create-order.dto.ts
│  │  │  │  └─ update-order.dto.ts
│  │  │  ├─ entities
│  │  │  │  └─ order.entity.ts
│  │  │  ├─ order-status.state-machine.ts
│  │  │  ├─ orders.controller.spec.ts
│  │  │  ├─ orders.controller.ts
│  │  │  ├─ orders.module.ts
│  │  │  ├─ orders.service.spec.ts
│  │  │  └─ orders.service.ts
│  │  ├─ payment
│  │  │  ├─ dto
│  │  │  │  └─ create-payment.dto.ts
│  │  │  ├─ entities
│  │  │  │  └─ payment.entity.ts
│  │  │  ├─ payment.controller.ts
│  │  │  ├─ payment.module.ts
│  │  │  ├─ payment.service.spec.ts
│  │  │  ├─ payment.service.ts
│  │  │  └─ webhooks
│  │  │     └─ stripe-webhook.controller.ts
│  │  ├─ products
│  │  │  ├─ dto
│  │  │  │  ├─ create-product.dto.ts
│  │  │  │  └─ update-product.dto.ts
│  │  │  ├─ entities
│  │  │  │  └─ product.entity.ts
│  │  │  ├─ products.controller.spec.ts
│  │  │  ├─ products.controller.ts
│  │  │  ├─ products.module.ts
│  │  │  ├─ products.service.spec.ts
│  │  │  └─ products.service.ts
│  │  └─ uploads
│  │     ├─ storage.service.ts
│  │     └─ uploads.module.ts
│  ├─ prisma
│  │  ├─ prisma-exception.filter.ts
│  │  ├─ prisma.module.ts
│  │  └─ prisma.service.ts
│  └─ redis
│     ├─ redis.module.ts
│     └─ redis.service.ts
├─ storage
│  └─ invoices
│     └─ 02d4ad3a-07da-450a-98a9-03bdd803ce37.pdf
├─ test
│  ├─ app.e2e-spec.ts
│  └─ jest-e2e.json
├─ tsconfig.build.json
└─ tsconfig.json

```
```
backend
├─ .prettierrc
├─ docker-compose.yml
├─ eslint.config.mjs
├─ nest-cli.json
├─ package-lock.json
├─ package.json
├─ prisma
│  ├─ migrations
│  │  ├─ 20260725101615_init
│  │  │  └─ migration.sql
│  │  ├─ 20260726111453_add_order_status_transitions
│  │  │  └─ migration.sql
│  │  ├─ 20260727105010_add_processed_webhook_events
│  │  │  └─ migration.sql
│  │  ├─ 20260728093936_add_product_images
│  │  │  └─ migration.sql
│  │  └─ migration_lock.toml
│  └─ schema.prisma
├─ prisma.zip
├─ README.md
├─ src
│  ├─ app.controller.spec.ts
│  ├─ app.controller.ts
│  ├─ app.module.ts
│  ├─ app.service.ts
│  ├─ config
│  │  ├─ env.validation.ts
│  │  └─ rate-limit.module.ts
│  ├─ main.ts
│  ├─ modules
│  │  ├─ auth
│  │  │  ├─ auth.controller.ts
│  │  │  ├─ auth.module.ts
│  │  │  ├─ auth.service.ts
│  │  │  ├─ decorators
│  │  │  │  ├─ current-user.decorator.ts
│  │  │  │  └─ roles.decorator.ts
│  │  │  ├─ dto
│  │  │  │  ├─ login.dto.ts
│  │  │  │  ├─ refresh-token.dto.ts
│  │  │  │  └─ register.dto.ts
│  │  │  ├─ guards
│  │  │  │  ├─ jwt-auth.guard.ts
│  │  │  │  └─ roles.guard.ts
│  │  │  └─ strategies
│  │  │     └─ jwt.strategy.ts
│  │  ├─ categories
│  │  │  ├─ categories.controller.spec.ts
│  │  │  ├─ categories.controller.ts
│  │  │  ├─ categories.module.ts
│  │  │  ├─ categories.service.spec.ts
│  │  │  ├─ categories.service.ts
│  │  │  ├─ dto
│  │  │  │  ├─ create-category.dto.ts
│  │  │  │  └─ update-category.dto.ts
│  │  │  └─ entities
│  │  │     └─ category.entity.ts
│  │  ├─ notifications
│  │  │  ├─ notifications.module.ts
│  │  │  ├─ processors
│  │  │  │  ├─ email.processor.ts
│  │  │  │  └─ invoice.processor.ts
│  │  │  ├─ queues
│  │  │  │  └─ notifications.queue.ts
│  │  │  └─ templates
│  │  │     └─ order-confirmation.template.ts
│  │  ├─ orders
│  │  │  ├─ dto
│  │  │  │  ├─ create-order.dto.ts
│  │  │  │  └─ update-order.dto.ts
│  │  │  ├─ entities
│  │  │  │  └─ order.entity.ts
│  │  │  ├─ order-status.state-machine.ts
│  │  │  ├─ orders.controller.spec.ts
│  │  │  ├─ orders.controller.ts
│  │  │  ├─ orders.module.ts
│  │  │  ├─ orders.service.spec.ts
│  │  │  └─ orders.service.ts
│  │  ├─ payment
│  │  │  ├─ dto
│  │  │  │  └─ create-payment.dto.ts
│  │  │  ├─ entities
│  │  │  │  └─ payment.entity.ts
│  │  │  ├─ payment.controller.ts
│  │  │  ├─ payment.module.ts
│  │  │  ├─ payment.service.spec.ts
│  │  │  ├─ payment.service.ts
│  │  │  └─ webhooks
│  │  │     └─ stripe-webhook.controller.ts
│  │  ├─ products
│  │  │  ├─ dto
│  │  │  │  ├─ create-product.dto.ts
│  │  │  │  └─ update-product.dto.ts
│  │  │  ├─ entities
│  │  │  │  └─ product.entity.ts
│  │  │  ├─ products.controller.spec.ts
│  │  │  ├─ products.controller.ts
│  │  │  ├─ products.module.ts
│  │  │  ├─ products.service.spec.ts
│  │  │  └─ products.service.ts
│  │  └─ uploads
│  │     ├─ storage.service.ts
│  │     └─ uploads.module.ts
│  ├─ prisma
│  │  ├─ prisma-exception.filter.ts
│  │  ├─ prisma.module.ts
│  │  └─ prisma.service.ts
│  └─ redis
│     ├─ redis.module.ts
│     └─ redis.service.ts
├─ storage
│  └─ invoices
│     └─ 02d4ad3a-07da-450a-98a9-03bdd803ce37.pdf
├─ test
│  ├─ app.e2e-spec.ts
│  ├─ auth-flow.e2e-spec.ts
│  ├─ jest-e2e.json
│  ├─ products-image-upload.e2e-spec.ts
│  └─ utils
│     ├─ load-test-env.ts
│     ├─ Payment webhook.e2e spec.ts
│     ├─ seed.helper.ts
│     ├─ supabase.mock.ts
│     └─ test-app.setup.ts
├─ tsconfig.build.json
└─ tsconfig.json

```
```
backend
├─ .prettierrc
├─ docker-compose.yml
├─ eslint.config.mjs
├─ nest-cli.json
├─ package-lock.json
├─ package.json
├─ prisma
│  ├─ migrations
│  │  ├─ 20260725101615_init
│  │  │  └─ migration.sql
│  │  ├─ 20260726111453_add_order_status_transitions
│  │  │  └─ migration.sql
│  │  ├─ 20260727105010_add_processed_webhook_events
│  │  │  └─ migration.sql
│  │  ├─ 20260728093936_add_product_images
│  │  │  └─ migration.sql
│  │  └─ migration_lock.toml
│  └─ schema.prisma
├─ prisma.zip
├─ README.md
├─ src
│  ├─ app.controller.spec.ts
│  ├─ app.controller.ts
│  ├─ app.module.ts
│  ├─ app.service.ts
│  ├─ config
│  │  ├─ env.validation.ts
│  │  └─ rate-limit.module.ts
│  ├─ main.ts
│  ├─ modules
│  │  ├─ auth
│  │  │  ├─ auth.controller.ts
│  │  │  ├─ auth.module.ts
│  │  │  ├─ auth.service.ts
│  │  │  ├─ decorators
│  │  │  │  ├─ current-user.decorator.ts
│  │  │  │  └─ roles.decorator.ts
│  │  │  ├─ dto
│  │  │  │  ├─ login.dto.ts
│  │  │  │  ├─ refresh-token.dto.ts
│  │  │  │  └─ register.dto.ts
│  │  │  ├─ guards
│  │  │  │  ├─ jwt-auth.guard.ts
│  │  │  │  └─ roles.guard.ts
│  │  │  └─ strategies
│  │  │     └─ jwt.strategy.ts
│  │  ├─ categories
│  │  │  ├─ categories.controller.spec.ts
│  │  │  ├─ categories.controller.ts
│  │  │  ├─ categories.module.ts
│  │  │  ├─ categories.service.spec.ts
│  │  │  ├─ categories.service.ts
│  │  │  ├─ dto
│  │  │  │  ├─ create-category.dto.ts
│  │  │  │  └─ update-category.dto.ts
│  │  │  └─ entities
│  │  │     └─ category.entity.ts
│  │  ├─ notifications
│  │  │  ├─ notifications.module.ts
│  │  │  ├─ processors
│  │  │  │  ├─ email.processor.ts
│  │  │  │  └─ invoice.processor.ts
│  │  │  ├─ queues
│  │  │  │  └─ notifications.queue.ts
│  │  │  └─ templates
│  │  │     └─ order-confirmation.template.ts
│  │  ├─ orders
│  │  │  ├─ dto
│  │  │  │  ├─ create-order.dto.ts
│  │  │  │  └─ update-order.dto.ts
│  │  │  ├─ entities
│  │  │  │  └─ order.entity.ts
│  │  │  ├─ order-status.state-machine.ts
│  │  │  ├─ orders.controller.spec.ts
│  │  │  ├─ orders.controller.ts
│  │  │  ├─ orders.module.ts
│  │  │  ├─ orders.service.spec.ts
│  │  │  └─ orders.service.ts
│  │  ├─ payment
│  │  │  ├─ dto
│  │  │  │  └─ create-payment.dto.ts
│  │  │  ├─ entities
│  │  │  │  └─ payment.entity.ts
│  │  │  ├─ payment.controller.ts
│  │  │  ├─ payment.module.ts
│  │  │  ├─ payment.service.spec.ts
│  │  │  ├─ payment.service.ts
│  │  │  └─ webhooks
│  │  │     └─ stripe-webhook.controller.ts
│  │  ├─ products
│  │  │  ├─ dto
│  │  │  │  ├─ create-product.dto.ts
│  │  │  │  └─ update-product.dto.ts
│  │  │  ├─ entities
│  │  │  │  └─ product.entity.ts
│  │  │  ├─ products.controller.spec.ts
│  │  │  ├─ products.controller.ts
│  │  │  ├─ products.module.ts
│  │  │  ├─ products.service.spec.ts
│  │  │  └─ products.service.ts
│  │  └─ uploads
│  │     ├─ storage.service.ts
│  │     └─ uploads.module.ts
│  ├─ prisma
│  │  ├─ prisma-exception.filter.ts
│  │  ├─ prisma.module.ts
│  │  └─ prisma.service.ts
│  └─ redis
│     ├─ redis.module.ts
│     └─ redis.service.ts
├─ storage
│  └─ invoices
│     ├─ 02d4ad3a-07da-450a-98a9-03bdd803ce37.pdf
│     ├─ 06573dfa-ca68-4111-a753-fd73ee09a7d7.pdf
│     ├─ 0acc0672-2abc-4b18-a8fa-4ff7cc9965e6.pdf
│     ├─ 3b92523e-d135-4578-ae6f-6346d9a7c68d.pdf
│     ├─ 3ee2f1c1-b863-471f-b8a4-a8e665cc6774.pdf
│     ├─ 828b8c81-a472-4604-ad86-8b79b3957194.pdf
│     ├─ 9f8556aa-a837-4d7d-958c-3af5f6b2c04e.pdf
│     ├─ a3a3ecf5-13a0-4092-b661-1c56199eab83.pdf
│     ├─ acb2a05c-63dd-403c-99cf-b0a17f1f51a8.pdf
│     └─ f0342433-475a-4460-826b-d4ee976f36f2.pdf
├─ test
│  ├─ app.e2e-spec.ts
│  ├─ auth-flow.e2e-spec.ts
│  ├─ jest-e2e.json
│  ├─ payment-webhook.e2e-spec.ts
│  ├─ products-image-upload.e2e-spec.ts
│  └─ utils
│     ├─ load-test-env.ts
│     ├─ seed.helper.ts
│     ├─ supabase.mock.ts
│     └─ test-app.setup.ts
├─ tsconfig.build.json
└─ tsconfig.json

```