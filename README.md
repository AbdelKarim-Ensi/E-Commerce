
```
E-Commerce
├─ backend
│  ├─ .dockerignore
│  ├─ .env.exampl
│  ├─ .prettierrc
│  ├─ cookies.txt
│  ├─ Dockerfile
│  ├─ eslint.config.mjs
│  ├─ nest-cli.json
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ prisma
│  │  ├─ migrations
│  │  │  ├─ 20260725101615_init
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20260726111453_add_order_status_transitions
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20260727105010_add_processed_webhook_events
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20260728093936_add_product_images
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20260802111342_add_product_marketing_fields
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20260802113102_add_product_rating
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20260808131019_add_user_contact_fields
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20260808141007_add_order_shipping_address
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20260811094201_add_product_specs_colors
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20260811201610_add_email_verified
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20260814100316_add_wishlist_and_coupons
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20260814112126_add_newsletter_subscribers
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20260815122100_add_reviews
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20260815194921_add_addresses
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20260817110327_add_google_auth
│  │  │  │  └─ migration.sql
│  │  │  └─ migration_lock.toml
│  │  ├─ schema.prisma
│  │  └─ seed.ts
│  ├─ prisma.zip
│  ├─ README.md
│  ├─ src
│  │  ├─ app.controller.spec.ts
│  │  ├─ app.controller.ts
│  │  ├─ app.module.ts
│  │  ├─ app.service.ts
│  │  ├─ config
│  │  │  ├─ env.validation.ts
│  │  │  └─ rate-limit.module.ts
│  │  ├─ firebase
│  │  │  ├─ firebase-admin.module.ts
│  │  │  └─ firebase-admin.service.ts
│  │  ├─ main.ts
│  │  ├─ modules
│  │  │  ├─ addresses
│  │  │  │  ├─ addresses.controller.ts
│  │  │  │  ├─ Addresses.module.ts
│  │  │  │  ├─ addresses.service.ts
│  │  │  │  └─ dto
│  │  │  │     ├─ create-address.dto.ts
│  │  │  │     └─ update.address.dto.ts
│  │  │  ├─ admin
│  │  │  │  ├─ admin-dashboard.controller.ts
│  │  │  │  ├─ admin-dashboard.service.ts
│  │  │  │  ├─ admin.module.ts
│  │  │  │  └─ dto
│  │  │  │     └─ dashboard-analytics.dto.ts
│  │  │  ├─ auth
│  │  │  │  ├─ auth.controller.ts
│  │  │  │  ├─ auth.module.ts
│  │  │  │  ├─ auth.service.ts
│  │  │  │  ├─ decorators
│  │  │  │  │  ├─ current-user.decorator.ts
│  │  │  │  │  └─ roles.decorator.ts
│  │  │  │  ├─ dto
│  │  │  │  │  ├─ forgot-password.dto.ts
│  │  │  │  │  ├─ google-login.dto.ts
│  │  │  │  │  ├─ login.dto.ts
│  │  │  │  │  ├─ refresh-token.dto.ts
│  │  │  │  │  ├─ register.dto.ts
│  │  │  │  │  ├─ resend-verification.dto.ts
│  │  │  │  │  ├─ reset-password.dto.ts
│  │  │  │  │  └─ verify-email.dto.ts
│  │  │  │  ├─ guards
│  │  │  │  │  ├─ jwt-auth.guard.ts
│  │  │  │  │  └─ roles.guard.ts
│  │  │  │  └─ strategies
│  │  │  │     └─ jwt.strategy.ts
│  │  │  ├─ categories
│  │  │  │  ├─ categories.controller.spec.ts
│  │  │  │  ├─ categories.controller.ts
│  │  │  │  ├─ categories.module.ts
│  │  │  │  ├─ categories.service.spec.ts
│  │  │  │  ├─ categories.service.ts
│  │  │  │  ├─ dto
│  │  │  │  │  ├─ create-category.dto.ts
│  │  │  │  │  └─ update-category.dto.ts
│  │  │  │  └─ entities
│  │  │  │     └─ category.entity.ts
│  │  │  ├─ coupons
│  │  │  │  ├─ coupons.controller.ts
│  │  │  │  ├─ coupons.module.ts
│  │  │  │  ├─ coupons.service.ts
│  │  │  │  └─ dto
│  │  │  │     ├─ create-coupon.dto.ts
│  │  │  │     ├─ update-coupon.dto.ts
│  │  │  │     └─ validate-coupon.dto.ts
│  │  │  ├─ newsletter
│  │  │  │  ├─ dto
│  │  │  │  │  ├─ broadcast-newsletter.dto.ts
│  │  │  │  │  ├─ subscribe.dto.ts
│  │  │  │  │  └─ unsubscribe.dto.ts
│  │  │  │  ├─ newsletter.controller.ts
│  │  │  │  ├─ newsletter.module.ts
│  │  │  │  └─ newsletter.service.ts
│  │  │  ├─ notifications
│  │  │  │  ├─ notifications.module.ts
│  │  │  │  ├─ processors
│  │  │  │  │  ├─ email-verification.processor.ts
│  │  │  │  │  ├─ email.processor.ts
│  │  │  │  │  ├─ invoice.processor.ts
│  │  │  │  │  ├─ newsletter.processor.ts
│  │  │  │  │  ├─ order-cancelled.processor.ts
│  │  │  │  │  └─ password-reset.processor.ts
│  │  │  │  ├─ queues
│  │  │  │  │  └─ notifications.queue.ts
│  │  │  │  └─ templates
│  │  │  │     ├─ email-verification.template.ts
│  │  │  │     ├─ newsletter.template.ts
│  │  │  │     ├─ order-cancelled.template.ts
│  │  │  │     ├─ order-confirmation.template.ts
│  │  │  │     └─ password-reset.template.ts
│  │  │  ├─ orders
│  │  │  │  ├─ dto
│  │  │  │  │  ├─ create-order.dto.ts
│  │  │  │  │  └─ update-order.dto.ts
│  │  │  │  ├─ entities
│  │  │  │  │  └─ order.entity.ts
│  │  │  │  ├─ order-status.state-machine.ts
│  │  │  │  ├─ orders.controller.spec.ts
│  │  │  │  ├─ orders.controller.ts
│  │  │  │  ├─ orders.module.ts
│  │  │  │  ├─ orders.service.spec.ts
│  │  │  │  └─ orders.service.ts
│  │  │  ├─ payment
│  │  │  │  ├─ dto
│  │  │  │  │  └─ create-payment.dto.ts
│  │  │  │  ├─ entities
│  │  │  │  │  └─ payment.entity.ts
│  │  │  │  ├─ payment.controller.ts
│  │  │  │  ├─ payment.module.ts
│  │  │  │  ├─ payment.service.spec.ts
│  │  │  │  ├─ payment.service.ts
│  │  │  │  └─ webhooks
│  │  │  │     └─ stripe-webhook.controller.ts
│  │  │  ├─ products
│  │  │  │  ├─ dto
│  │  │  │  │  ├─ create-product.dto.ts
│  │  │  │  │  ├─ find-products-query.dto.ts
│  │  │  │  │  └─ update-product.dto.ts
│  │  │  │  ├─ entities
│  │  │  │  │  └─ product.entity.ts
│  │  │  │  ├─ products.controller.spec.ts
│  │  │  │  ├─ products.controller.ts
│  │  │  │  ├─ products.module.ts
│  │  │  │  ├─ products.service.spec.ts
│  │  │  │  └─ products.service.ts
│  │  │  ├─ reviews
│  │  │  │  ├─ dto
│  │  │  │  │  └─ create-review.dto.ts
│  │  │  │  ├─ reviews.controller.ts
│  │  │  │  ├─ reviews.module.ts
│  │  │  │  └─ reviews.service.ts
│  │  │  ├─ uploads
│  │  │  │  ├─ storage.service.ts
│  │  │  │  └─ uploads.module.ts
│  │  │  ├─ users
│  │  │  │  ├─ dto
│  │  │  │  │  ├─ change-password.dto.ts
│  │  │  │  │  ├─ update-user-role.dto.ts
│  │  │  │  │  └─ update-user.dto.ts
│  │  │  │  ├─ users.controller.ts
│  │  │  │  ├─ users.module.ts
│  │  │  │  └─ users.service.ts
│  │  │  └─ wishlist
│  │  │     ├─ dto
│  │  │     │  └─ toggle-wishlist.dto.ts
│  │  │     ├─ wishlist.controller.ts
│  │  │     ├─ wishlist.module.ts
│  │  │     └─ wishlist.service.ts
│  │  ├─ prisma
│  │  │  ├─ prisma-exception.filter.ts
│  │  │  ├─ prisma.mock.ts
│  │  │  ├─ prisma.module.ts
│  │  │  └─ prisma.service.ts
│  │  ├─ redis
│  │  │  ├─ redis.module.ts
│  │  │  └─ redis.service.ts
│  │  └─ scripts
│  │     └─ migrate-user-addresses.ts
│  ├─ storage
│  │  └─ invoices
│  │     ├─ 02d4ad3a-07da-450a-98a9-03bdd803ce37.pdf
│  │     ├─ 06573dfa-ca68-4111-a753-fd73ee09a7d7.pdf
│  │     ├─ 0acc0672-2abc-4b18-a8fa-4ff7cc9965e6.pdf
│  │     ├─ 18bf16fb-cb3c-40f3-ab30-dbe765a80c60.pdf
│  │     ├─ 34f78737-64c2-4022-b69c-c5cdf0b742b8.pdf
│  │     ├─ 3b92523e-d135-4578-ae6f-6346d9a7c68d.pdf
│  │     ├─ 3baf2386-b4f1-4ff2-8a34-ac2896183158.pdf
│  │     ├─ 3ee2f1c1-b863-471f-b8a4-a8e665cc6774.pdf
│  │     ├─ 828b8c81-a472-4604-ad86-8b79b3957194.pdf
│  │     ├─ 8b85b315-c176-49b8-a2e7-6a2984d1b363.pdf
│  │     ├─ 9f36b8a8-8961-4793-aaf9-990f83cae1d1.pdf
│  │     ├─ 9f8556aa-a837-4d7d-958c-3af5f6b2c04e.pdf
│  │     ├─ a3a3ecf5-13a0-4092-b661-1c56199eab83.pdf
│  │     ├─ acb2a05c-63dd-403c-99cf-b0a17f1f51a8.pdf
│  │     ├─ b9da5bbc-e479-4cc1-a3f9-6f70df353899.pdf
│  │     ├─ c6710dde-abf2-40e5-b58e-20081b746358.pdf
│  │     ├─ cdb0ac4c-4f46-4ffc-a6da-59319dbbf65a.pdf
│  │     ├─ ce0001f2-617c-4319-ab15-5688a1dcddcb.pdf
│  │     ├─ e09a488f-c5e4-4dcd-a3b2-318456bf4f66.pdf
│  │     ├─ f0342433-475a-4460-826b-d4ee976f36f2.pdf
│  │     └─ f32885d8-bdff-43a6-aaf0-ecde31b2aba0.pdf
│  ├─ test
│  │  ├─ app.e2e-spec.ts
│  │  ├─ auth-flow.e2e-spec.ts
│  │  ├─ jest-e2e.json
│  │  ├─ orders-lifecycle.e2e-spec.ts
│  │  ├─ payment-webhook.e2e-spec.ts
│  │  ├─ products-image-upload.e2e-spec.ts
│  │  └─ utils
│  │     ├─ load-test-env.ts
│  │     ├─ seed.helper.ts
│  │     ├─ supabase.mock.ts
│  │     └─ test-app.setup.ts
│  ├─ tsconfig.build.json
│  └─ tsconfig.json
├─ desktop.ini
├─ docker-compose.yml
├─ frontend
│  ├─ .dockerignore
│  ├─ .editorconfig
│  ├─ .postcssrc.json
│  ├─ angular.json
│  ├─ Dockerfile
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ assets
│  │  │  └─ products
│  │  │     ├─ apple-watch-ultra2.jpg
│  │  │     ├─ dell-xps15-oled.jpg
│  │  │     ├─ echo-show10.jpg
│  │  │     ├─ galaxy-buds3-pro.jpg
│  │  │     ├─ galaxy-s24-ultra.jpg
│  │  │     ├─ ipad-pro-m4.jpg
│  │  │     ├─ iphone-15-pro.jpg
│  │  │     ├─ lg-ultrawide-34.jpg
│  │  │     ├─ logitech-superlight2.jpg
│  │  │     ├─ macbook-air-m3.jpg
│  │  │     ├─ razer-blackwidow-v4.jpg
│  │  │     └─ sony-wh1000xm5.jpg
│  │  ├─ favicon.ico
│  │  └─ robots.txt
│  ├─ README.md
│  ├─ src
│  │  ├─ app
│  │  │  ├─ app.config.server.ts
│  │  │  ├─ app.config.ts
│  │  │  ├─ app.css
│  │  │  ├─ app.html
│  │  │  ├─ app.routes.server.ts
│  │  │  ├─ app.routes.ts
│  │  │  ├─ app.spec.ts
│  │  │  ├─ app.ts
│  │  │  ├─ core
│  │  │  │  ├─ guards
│  │  │  │  │  ├─ admin.guard.ts
│  │  │  │  │  └─ auth.guard.ts
│  │  │  │  ├─ interceptors
│  │  │  │  │  ├─ auth.interceptor.ts
│  │  │  │  │  └─ ssr-cookie.interceptor.ts
│  │  │  │  ├─ models
│  │  │  │  │  ├─ address.model.ts
│  │  │  │  │  ├─ cartItem.model.ts
│  │  │  │  │  ├─ category.model.ts
│  │  │  │  │  ├─ checkout.model.ts
│  │  │  │  │  ├─ order.model.ts
│  │  │  │  │  ├─ product.model.ts
│  │  │  │  │  ├─ review.model.ts
│  │  │  │  │  └─ user.model.ts
│  │  │  │  └─ services
│  │  │  │     ├─ address.service.ts
│  │  │  │     ├─ alert.service.ts
│  │  │  │     ├─ auth.service.ts
│  │  │  │     ├─ cart.service.ts
│  │  │  │     ├─ categories.service.ts
│  │  │  │     ├─ checkout.service.ts
│  │  │  │     ├─ coupons.service.ts
│  │  │  │     ├─ newsletter.service.ts
│  │  │  │     ├─ orders.service.ts
│  │  │  │     ├─ payment.service.ts
│  │  │  │     ├─ products.service.ts
│  │  │  │     ├─ reviews.service.ts
│  │  │  │     ├─ showcase.service.ts
│  │  │  │     ├─ stripe.service.ts
│  │  │  │     ├─ users.service.ts
│  │  │  │     └─ wishlist.service.ts
│  │  │  ├─ pages
│  │  │  │  ├─ admin
│  │  │  │  │  ├─ admin-categories
│  │  │  │  │  │  ├─ admin-categories.css
│  │  │  │  │  │  ├─ admin-categories.html
│  │  │  │  │  │  ├─ admin-categories.spec.ts
│  │  │  │  │  │  └─ admin-categories.ts
│  │  │  │  │  ├─ admin-dashboard
│  │  │  │  │  │  ├─ admin-dashboard.css
│  │  │  │  │  │  ├─ admin-dashboard.html
│  │  │  │  │  │  ├─ admin-dashboard.spec.ts
│  │  │  │  │  │  └─ admin-dashboard.ts
│  │  │  │  │  ├─ admin-layout
│  │  │  │  │  │  ├─ admin-layout.css
│  │  │  │  │  │  ├─ admin-layout.html
│  │  │  │  │  │  ├─ admin-layout.spec.ts
│  │  │  │  │  │  └─ admin-layout.ts
│  │  │  │  │  ├─ admin-newsletter
│  │  │  │  │  │  ├─ admin-newsletter.css
│  │  │  │  │  │  ├─ admin-newsletter.html
│  │  │  │  │  │  ├─ admin-newsletter.spec.ts
│  │  │  │  │  │  └─ admin-newsletter.ts
│  │  │  │  │  ├─ admin-orders
│  │  │  │  │  │  ├─ admin-orders.css
│  │  │  │  │  │  ├─ admin-orders.html
│  │  │  │  │  │  ├─ admin-orders.spec.ts
│  │  │  │  │  │  └─ admin-orders.ts
│  │  │  │  │  ├─ admin-product-form
│  │  │  │  │  │  ├─ admin-product-form.css
│  │  │  │  │  │  ├─ admin-product-form.html
│  │  │  │  │  │  ├─ admin-product-form.spec.ts
│  │  │  │  │  │  └─ admin-product-form.ts
│  │  │  │  │  ├─ admin-products
│  │  │  │  │  │  ├─ admin-products.css
│  │  │  │  │  │  ├─ admin-products.html
│  │  │  │  │  │  ├─ admin-products.spec.ts
│  │  │  │  │  │  └─ admin-products.ts
│  │  │  │  │  ├─ admin-reviews
│  │  │  │  │  │  ├─ admin-reviews.css
│  │  │  │  │  │  ├─ admin-reviews.html
│  │  │  │  │  │  ├─ admin-reviews.spec.ts
│  │  │  │  │  │  └─ admin-reviews.ts
│  │  │  │  │  └─ admin-users
│  │  │  │  │     ├─ admin-users.css
│  │  │  │  │     ├─ admin-users.html
│  │  │  │  │     ├─ admin-users.spec.ts
│  │  │  │  │     └─ admin-users.ts
│  │  │  │  ├─ auth
│  │  │  │  │  ├─ auth.css
│  │  │  │  │  ├─ auth.html
│  │  │  │  │  ├─ auth.spec.ts
│  │  │  │  │  └─ auth.ts
│  │  │  │  ├─ cart
│  │  │  │  │  ├─ cart.css
│  │  │  │  │  ├─ cart.html
│  │  │  │  │  ├─ cart.spec.ts
│  │  │  │  │  └─ cart.ts
│  │  │  │  ├─ checkout
│  │  │  │  │  ├─ checkout-footer
│  │  │  │  │  │  ├─ checkout-footer.css
│  │  │  │  │  │  ├─ checkout-footer.html
│  │  │  │  │  │  ├─ checkout-footer.spec.ts
│  │  │  │  │  │  └─ checkout-footer.ts
│  │  │  │  │  ├─ checkout-header
│  │  │  │  │  │  ├─ checkout-header.css
│  │  │  │  │  │  ├─ checkout-header.html
│  │  │  │  │  │  ├─ checkout-header.spec.ts
│  │  │  │  │  │  └─ checkout-header.ts
│  │  │  │  │  ├─ checkout-stepper
│  │  │  │  │  │  ├─ checkout-stepper.css
│  │  │  │  │  │  ├─ checkout-stepper.html
│  │  │  │  │  │  ├─ checkout-stepper.spec.ts
│  │  │  │  │  │  └─ checkout-stepper.ts
│  │  │  │  │  ├─ checkout.css
│  │  │  │  │  ├─ checkout.html
│  │  │  │  │  ├─ checkout.spec.ts
│  │  │  │  │  ├─ checkout.ts
│  │  │  │  │  ├─ order-summary
│  │  │  │  │  │  ├─ order-summary.css
│  │  │  │  │  │  ├─ order-summary.html
│  │  │  │  │  │  ├─ order-summary.spec.ts
│  │  │  │  │  │  └─ order-summary.ts
│  │  │  │  │  ├─ payment-method
│  │  │  │  │  │  ├─ payment-method.css
│  │  │  │  │  │  ├─ payment-method.html
│  │  │  │  │  │  ├─ payment-method.spec.ts
│  │  │  │  │  │  └─ payment-method.ts
│  │  │  │  │  ├─ shipping-address-form
│  │  │  │  │  │  ├─ shipping-address-form.css
│  │  │  │  │  │  ├─ shipping-address-form.html
│  │  │  │  │  │  ├─ shipping-address-form.spec.ts
│  │  │  │  │  │  └─ shipping-address-form.ts
│  │  │  │  │  └─ shipping-method
│  │  │  │  │     ├─ shipping-method.css
│  │  │  │  │     ├─ shipping-method.html
│  │  │  │  │     ├─ shipping-method.spec.ts
│  │  │  │  │     └─ shipping-method.ts
│  │  │  │  ├─ forgot-password
│  │  │  │  │  ├─ forgot-password.css
│  │  │  │  │  ├─ forgot-password.html
│  │  │  │  │  ├─ forgot-password.spec.ts
│  │  │  │  │  └─ forgot-password.ts
│  │  │  │  ├─ home
│  │  │  │  │  ├─ categories
│  │  │  │  │  │  ├─ categories.css
│  │  │  │  │  │  ├─ categories.html
│  │  │  │  │  │  ├─ categories.spec.ts
│  │  │  │  │  │  └─ categories.ts
│  │  │  │  │  ├─ featured-products
│  │  │  │  │  │  ├─ featured-products.css
│  │  │  │  │  │  ├─ featured-products.html
│  │  │  │  │  │  ├─ featured-products.spec.ts
│  │  │  │  │  │  └─ featured-products.ts
│  │  │  │  │  ├─ flash-deals
│  │  │  │  │  │  ├─ flash-deals.css
│  │  │  │  │  │  ├─ flash-deals.html
│  │  │  │  │  │  ├─ flash-deals.spec.ts
│  │  │  │  │  │  └─ flash-deals.ts
│  │  │  │  │  ├─ hero
│  │  │  │  │  │  ├─ hero.css
│  │  │  │  │  │  ├─ hero.html
│  │  │  │  │  │  ├─ hero.spec.ts
│  │  │  │  │  │  └─ hero.ts
│  │  │  │  │  ├─ home.css
│  │  │  │  │  ├─ home.html
│  │  │  │  │  ├─ home.spec.ts
│  │  │  │  │  ├─ home.ts
│  │  │  │  │  └─ trust-section
│  │  │  │  │     ├─ trust-section.css
│  │  │  │  │     ├─ trust-section.html
│  │  │  │  │     ├─ trust-section.spec.ts
│  │  │  │  │     └─ trust-section.ts
│  │  │  │  ├─ not-found
│  │  │  │  │  ├─ not-found.css
│  │  │  │  │  ├─ not-found.html
│  │  │  │  │  ├─ not-found.spec.ts
│  │  │  │  │  └─ not-found.ts
│  │  │  │  ├─ order-confirmation
│  │  │  │  │  ├─ order-confirmation.css
│  │  │  │  │  ├─ order-confirmation.html
│  │  │  │  │  ├─ order-confirmation.spec.ts
│  │  │  │  │  └─ order-confirmation.ts
│  │  │  │  ├─ order-history
│  │  │  │  │  ├─ order-history.css
│  │  │  │  │  ├─ order-history.html
│  │  │  │  │  ├─ order-history.spec.ts
│  │  │  │  │  └─ order-history.ts
│  │  │  │  ├─ product-list
│  │  │  │  │  ├─ earbud-showcase
│  │  │  │  │  │  ├─ earbud-showcase.css
│  │  │  │  │  │  ├─ earbud-showcase.html
│  │  │  │  │  │  ├─ earbud-showcase.spec.ts
│  │  │  │  │  │  └─ earbud-showcase.ts
│  │  │  │  │  ├─ product-list.css
│  │  │  │  │  ├─ product-list.html
│  │  │  │  │  ├─ product-list.spec.ts
│  │  │  │  │  ├─ product-list.ts
│  │  │  │  │  └─ similar-products
│  │  │  │  │     ├─ similar-products.css
│  │  │  │  │     ├─ similar-products.html
│  │  │  │  │     ├─ similar-products.spec.ts
│  │  │  │  │     └─ similar-products.ts
│  │  │  │  ├─ profile
│  │  │  │  │  ├─ profile.css
│  │  │  │  │  ├─ profile.html
│  │  │  │  │  ├─ profile.spec.ts
│  │  │  │  │  └─ profile.ts
│  │  │  │  ├─ reset-password
│  │  │  │  │  ├─ reset-password.css
│  │  │  │  │  ├─ reset-password.html
│  │  │  │  │  ├─ reset-password.spec.ts
│  │  │  │  │  └─ reset-password.ts
│  │  │  │  └─ verify-email
│  │  │  │     ├─ verify-email.css
│  │  │  │     ├─ verify-email.html
│  │  │  │     ├─ verify-email.spec.ts
│  │  │  │     └─ verify-email.ts
│  │  │  └─ shared
│  │  │     ├─ cart-drawer
│  │  │     │  ├─ cart-drawer.css
│  │  │     │  ├─ cart-drawer.html
│  │  │     │  ├─ cart-drawer.spec.ts
│  │  │     │  └─ cart-drawer.ts
│  │  │     ├─ chart-canvas
│  │  │     │  ├─ chart-canvas.css
│  │  │     │  ├─ chart-canvas.html
│  │  │     │  ├─ chart-canvas.spec.ts
│  │  │     │  └─ chart-canvas.ts
│  │  │     ├─ footer
│  │  │     │  ├─ footer.css
│  │  │     │  ├─ footer.html
│  │  │     │  ├─ footer.spec.ts
│  │  │     │  └─ footer.ts
│  │  │     ├─ navbar
│  │  │     │  ├─ navbar.css
│  │  │     │  ├─ navbar.html
│  │  │     │  ├─ navbar.spec.ts
│  │  │     │  └─ navbar.ts
│  │  │     ├─ product-card
│  │  │     │  ├─ product-card.css
│  │  │     │  ├─ product-card.html
│  │  │     │  ├─ product-card.spec.ts
│  │  │     │  └─ product-card.ts
│  │  │     ├─ product-reviews
│  │  │     │  ├─ product-reviews.css
│  │  │     │  ├─ product-reviews.html
│  │  │     │  ├─ product-reviews.spec.ts
│  │  │     │  └─ product-reviews.ts
│  │  │     └─ star-rating
│  │  │        ├─ star-rating.css
│  │  │        ├─ star-rating.html
│  │  │        ├─ star-rating.spec.ts
│  │  │        └─ star-rating.ts
│  │  ├─ environments
│  │  │  ├─ environment.development.ts
│  │  │  └─ environment.ts
│  │  ├─ index.html
│  │  ├─ main.server.ts
│  │  ├─ main.ts
│  │  ├─ server.ts
│  │  └─ styles.css
│  ├─ tsconfig.app.json
│  ├─ tsconfig.json
│  └─ tsconfig.spec.json
├─ nginx
│  ├─ certs
│  │  ├─ selfsigned.crt
│  │  └─ selfsigned.key
│  └─ nginx.conf
└─ README.md

```
```
E-Commerce
├─ backend
│  ├─ .dockerignore
│  ├─ .env.docker
│  ├─ .env.exampl
│  ├─ .prettierrc
│  ├─ cookies.txt
│  ├─ dist
│  │  ├─ prisma
│  │  │  ├─ seed.d.ts
│  │  │  ├─ seed.js
│  │  │  └─ seed.js.map
│  │  ├─ seed.d.ts
│  │  ├─ seed.js
│  │  ├─ seed.js.map
│  │  ├─ src
│  │  │  ├─ app.controller.d.ts
│  │  │  ├─ app.controller.js
│  │  │  ├─ app.controller.js.map
│  │  │  ├─ app.module.d.ts
│  │  │  ├─ app.module.js
│  │  │  ├─ app.module.js.map
│  │  │  ├─ app.service.d.ts
│  │  │  ├─ app.service.js
│  │  │  ├─ app.service.js.map
│  │  │  ├─ config
│  │  │  │  ├─ custom-throttler.guard.d.ts
│  │  │  │  ├─ custom-throttler.guard.js
│  │  │  │  ├─ custom-throttler.guard.js.map
│  │  │  │  ├─ env.validation.d.ts
│  │  │  │  ├─ env.validation.js
│  │  │  │  ├─ env.validation.js.map
│  │  │  │  ├─ rate-limit.module.d.ts
│  │  │  │  ├─ rate-limit.module.js
│  │  │  │  └─ rate-limit.module.js.map
│  │  │  ├─ firebase
│  │  │  │  ├─ firebase-admin.module.d.ts
│  │  │  │  ├─ firebase-admin.module.js
│  │  │  │  ├─ firebase-admin.module.js.map
│  │  │  │  ├─ firebase-admin.service.d.ts
│  │  │  │  ├─ firebase-admin.service.js
│  │  │  │  └─ firebase-admin.service.js.map
│  │  │  ├─ main.d.ts
│  │  │  ├─ main.js
│  │  │  ├─ main.js.map
│  │  │  ├─ modules
│  │  │  │  ├─ addresses
│  │  │  │  │  ├─ addresses.controller.d.ts
│  │  │  │  │  ├─ addresses.controller.js
│  │  │  │  │  ├─ addresses.controller.js.map
│  │  │  │  │  ├─ Addresses.module.d.ts
│  │  │  │  │  ├─ Addresses.module.js
│  │  │  │  │  ├─ Addresses.module.js.map
│  │  │  │  │  ├─ addresses.service.d.ts
│  │  │  │  │  ├─ addresses.service.js
│  │  │  │  │  ├─ addresses.service.js.map
│  │  │  │  │  └─ dto
│  │  │  │  │     ├─ create-address.dto.d.ts
│  │  │  │  │     ├─ create-address.dto.js
│  │  │  │  │     ├─ create-address.dto.js.map
│  │  │  │  │     ├─ update.address.dto.d.ts
│  │  │  │  │     ├─ update.address.dto.js
│  │  │  │  │     └─ update.address.dto.js.map
│  │  │  │  ├─ admin
│  │  │  │  │  ├─ admin-dashboard.controller.d.ts
│  │  │  │  │  ├─ admin-dashboard.controller.js
│  │  │  │  │  ├─ admin-dashboard.controller.js.map
│  │  │  │  │  ├─ admin-dashboard.service.d.ts
│  │  │  │  │  ├─ admin-dashboard.service.js
│  │  │  │  │  ├─ admin-dashboard.service.js.map
│  │  │  │  │  ├─ admin.module.d.ts
│  │  │  │  │  ├─ admin.module.js
│  │  │  │  │  ├─ admin.module.js.map
│  │  │  │  │  └─ dto
│  │  │  │  │     ├─ dashboard-analytics.dto.d.ts
│  │  │  │  │     ├─ dashboard-analytics.dto.js
│  │  │  │  │     └─ dashboard-analytics.dto.js.map
│  │  │  │  ├─ auth
│  │  │  │  │  ├─ auth.controller.d.ts
│  │  │  │  │  ├─ auth.controller.js
│  │  │  │  │  ├─ auth.controller.js.map
│  │  │  │  │  ├─ auth.module.d.ts
│  │  │  │  │  ├─ auth.module.js
│  │  │  │  │  ├─ auth.module.js.map
│  │  │  │  │  ├─ auth.service.d.ts
│  │  │  │  │  ├─ auth.service.js
│  │  │  │  │  ├─ auth.service.js.map
│  │  │  │  │  ├─ decorators
│  │  │  │  │  │  ├─ current-user.decorator.d.ts
│  │  │  │  │  │  ├─ current-user.decorator.js
│  │  │  │  │  │  ├─ current-user.decorator.js.map
│  │  │  │  │  │  ├─ roles.decorator.d.ts
│  │  │  │  │  │  ├─ roles.decorator.js
│  │  │  │  │  │  └─ roles.decorator.js.map
│  │  │  │  │  ├─ dto
│  │  │  │  │  │  ├─ forgot-password.dto.d.ts
│  │  │  │  │  │  ├─ forgot-password.dto.js
│  │  │  │  │  │  ├─ forgot-password.dto.js.map
│  │  │  │  │  │  ├─ google-login.dto.d.ts
│  │  │  │  │  │  ├─ google-login.dto.js
│  │  │  │  │  │  ├─ google-login.dto.js.map
│  │  │  │  │  │  ├─ login.dto.d.ts
│  │  │  │  │  │  ├─ login.dto.js
│  │  │  │  │  │  ├─ login.dto.js.map
│  │  │  │  │  │  ├─ refresh-token.dto.d.ts
│  │  │  │  │  │  ├─ refresh-token.dto.js
│  │  │  │  │  │  ├─ refresh-token.dto.js.map
│  │  │  │  │  │  ├─ register.dto.d.ts
│  │  │  │  │  │  ├─ register.dto.js
│  │  │  │  │  │  ├─ register.dto.js.map
│  │  │  │  │  │  ├─ resend-verification.dto.d.ts
│  │  │  │  │  │  ├─ resend-verification.dto.js
│  │  │  │  │  │  ├─ resend-verification.dto.js.map
│  │  │  │  │  │  ├─ reset-password.dto.d.ts
│  │  │  │  │  │  ├─ reset-password.dto.js
│  │  │  │  │  │  ├─ reset-password.dto.js.map
│  │  │  │  │  │  ├─ verify-email.dto.d.ts
│  │  │  │  │  │  ├─ verify-email.dto.js
│  │  │  │  │  │  └─ verify-email.dto.js.map
│  │  │  │  │  ├─ guards
│  │  │  │  │  │  ├─ jwt-auth.guard.d.ts
│  │  │  │  │  │  ├─ jwt-auth.guard.js
│  │  │  │  │  │  ├─ jwt-auth.guard.js.map
│  │  │  │  │  │  ├─ roles.guard.d.ts
│  │  │  │  │  │  ├─ roles.guard.js
│  │  │  │  │  │  └─ roles.guard.js.map
│  │  │  │  │  └─ strategies
│  │  │  │  │     ├─ jwt.strategy.d.ts
│  │  │  │  │     ├─ jwt.strategy.js
│  │  │  │  │     └─ jwt.strategy.js.map
│  │  │  │  ├─ categories
│  │  │  │  │  ├─ categories.controller.d.ts
│  │  │  │  │  ├─ categories.controller.js
│  │  │  │  │  ├─ categories.controller.js.map
│  │  │  │  │  ├─ categories.module.d.ts
│  │  │  │  │  ├─ categories.module.js
│  │  │  │  │  ├─ categories.module.js.map
│  │  │  │  │  ├─ categories.service.d.ts
│  │  │  │  │  ├─ categories.service.js
│  │  │  │  │  ├─ categories.service.js.map
│  │  │  │  │  ├─ dto
│  │  │  │  │  │  ├─ create-category.dto.d.ts
│  │  │  │  │  │  ├─ create-category.dto.js
│  │  │  │  │  │  ├─ create-category.dto.js.map
│  │  │  │  │  │  ├─ update-category.dto.d.ts
│  │  │  │  │  │  ├─ update-category.dto.js
│  │  │  │  │  │  └─ update-category.dto.js.map
│  │  │  │  │  └─ entities
│  │  │  │  │     ├─ category.entity.d.ts
│  │  │  │  │     ├─ category.entity.js
│  │  │  │  │     └─ category.entity.js.map
│  │  │  │  ├─ coupons
│  │  │  │  │  ├─ coupons.controller.d.ts
│  │  │  │  │  ├─ coupons.controller.js
│  │  │  │  │  ├─ coupons.controller.js.map
│  │  │  │  │  ├─ coupons.module.d.ts
│  │  │  │  │  ├─ coupons.module.js
│  │  │  │  │  ├─ coupons.module.js.map
│  │  │  │  │  ├─ coupons.service.d.ts
│  │  │  │  │  ├─ coupons.service.js
│  │  │  │  │  ├─ coupons.service.js.map
│  │  │  │  │  └─ dto
│  │  │  │  │     ├─ create-coupon.dto.d.ts
│  │  │  │  │     ├─ create-coupon.dto.js
│  │  │  │  │     ├─ create-coupon.dto.js.map
│  │  │  │  │     ├─ update-coupon.dto.d.ts
│  │  │  │  │     ├─ update-coupon.dto.js
│  │  │  │  │     ├─ update-coupon.dto.js.map
│  │  │  │  │     ├─ validate-coupon.dto.d.ts
│  │  │  │  │     ├─ validate-coupon.dto.js
│  │  │  │  │     └─ validate-coupon.dto.js.map
│  │  │  │  ├─ newsletter
│  │  │  │  │  ├─ dto
│  │  │  │  │  │  ├─ broadcast-newsletter.dto.d.ts
│  │  │  │  │  │  ├─ broadcast-newsletter.dto.js
│  │  │  │  │  │  ├─ broadcast-newsletter.dto.js.map
│  │  │  │  │  │  ├─ subscribe.dto.d.ts
│  │  │  │  │  │  ├─ subscribe.dto.js
│  │  │  │  │  │  ├─ subscribe.dto.js.map
│  │  │  │  │  │  ├─ unsubscribe.dto.d.ts
│  │  │  │  │  │  ├─ unsubscribe.dto.js
│  │  │  │  │  │  └─ unsubscribe.dto.js.map
│  │  │  │  │  ├─ newsletter.controller.d.ts
│  │  │  │  │  ├─ newsletter.controller.js
│  │  │  │  │  ├─ newsletter.controller.js.map
│  │  │  │  │  ├─ newsletter.module.d.ts
│  │  │  │  │  ├─ newsletter.module.js
│  │  │  │  │  ├─ newsletter.module.js.map
│  │  │  │  │  ├─ newsletter.service.d.ts
│  │  │  │  │  ├─ newsletter.service.js
│  │  │  │  │  └─ newsletter.service.js.map
│  │  │  │  ├─ notifications
│  │  │  │  │  ├─ notifications.module.d.ts
│  │  │  │  │  ├─ notifications.module.js
│  │  │  │  │  ├─ notifications.module.js.map
│  │  │  │  │  ├─ processors
│  │  │  │  │  │  ├─ email-verification.processor.d.ts
│  │  │  │  │  │  ├─ email-verification.processor.js
│  │  │  │  │  │  ├─ email-verification.processor.js.map
│  │  │  │  │  │  ├─ email.processor.d.ts
│  │  │  │  │  │  ├─ email.processor.js
│  │  │  │  │  │  ├─ email.processor.js.map
│  │  │  │  │  │  ├─ invoice.processor.d.ts
│  │  │  │  │  │  ├─ invoice.processor.js
│  │  │  │  │  │  ├─ invoice.processor.js.map
│  │  │  │  │  │  ├─ newsletter.processor.d.ts
│  │  │  │  │  │  ├─ newsletter.processor.js
│  │  │  │  │  │  ├─ newsletter.processor.js.map
│  │  │  │  │  │  ├─ order-cancelled.processor.d.ts
│  │  │  │  │  │  ├─ order-cancelled.processor.js
│  │  │  │  │  │  ├─ order-cancelled.processor.js.map
│  │  │  │  │  │  ├─ password-reset.processor.d.ts
│  │  │  │  │  │  ├─ password-reset.processor.js
│  │  │  │  │  │  └─ password-reset.processor.js.map
│  │  │  │  │  ├─ queues
│  │  │  │  │  │  ├─ notifications.queue.d.ts
│  │  │  │  │  │  ├─ notifications.queue.js
│  │  │  │  │  │  └─ notifications.queue.js.map
│  │  │  │  │  └─ templates
│  │  │  │  │     ├─ email-verification.template.d.ts
│  │  │  │  │     ├─ email-verification.template.js
│  │  │  │  │     ├─ email-verification.template.js.map
│  │  │  │  │     ├─ newsletter.template.d.ts
│  │  │  │  │     ├─ newsletter.template.js
│  │  │  │  │     ├─ newsletter.template.js.map
│  │  │  │  │     ├─ order-cancelled.template.d.ts
│  │  │  │  │     ├─ order-cancelled.template.js
│  │  │  │  │     ├─ order-cancelled.template.js.map
│  │  │  │  │     ├─ order-confirmation.template.d.ts
│  │  │  │  │     ├─ order-confirmation.template.js
│  │  │  │  │     ├─ order-confirmation.template.js.map
│  │  │  │  │     ├─ password-reset.template.d.ts
│  │  │  │  │     ├─ password-reset.template.js
│  │  │  │  │     └─ password-reset.template.js.map
│  │  │  │  ├─ orders
│  │  │  │  │  ├─ dto
│  │  │  │  │  │  ├─ create-order.dto.d.ts
│  │  │  │  │  │  ├─ create-order.dto.js
│  │  │  │  │  │  ├─ create-order.dto.js.map
│  │  │  │  │  │  ├─ update-order.dto.d.ts
│  │  │  │  │  │  ├─ update-order.dto.js
│  │  │  │  │  │  └─ update-order.dto.js.map
│  │  │  │  │  ├─ entities
│  │  │  │  │  │  ├─ order.entity.d.ts
│  │  │  │  │  │  ├─ order.entity.js
│  │  │  │  │  │  └─ order.entity.js.map
│  │  │  │  │  ├─ order-status.state-machine.d.ts
│  │  │  │  │  ├─ order-status.state-machine.js
│  │  │  │  │  ├─ order-status.state-machine.js.map
│  │  │  │  │  ├─ orders.controller.d.ts
│  │  │  │  │  ├─ orders.controller.js
│  │  │  │  │  ├─ orders.controller.js.map
│  │  │  │  │  ├─ orders.module.d.ts
│  │  │  │  │  ├─ orders.module.js
│  │  │  │  │  ├─ orders.module.js.map
│  │  │  │  │  ├─ orders.service.d.ts
│  │  │  │  │  ├─ orders.service.js
│  │  │  │  │  └─ orders.service.js.map
│  │  │  │  ├─ payment
│  │  │  │  │  ├─ dto
│  │  │  │  │  │  ├─ create-payment.dto.d.ts
│  │  │  │  │  │  ├─ create-payment.dto.js
│  │  │  │  │  │  └─ create-payment.dto.js.map
│  │  │  │  │  ├─ entities
│  │  │  │  │  │  ├─ payment.entity.d.ts
│  │  │  │  │  │  ├─ payment.entity.js
│  │  │  │  │  │  └─ payment.entity.js.map
│  │  │  │  │  ├─ payment.controller.d.ts
│  │  │  │  │  ├─ payment.controller.js
│  │  │  │  │  ├─ payment.controller.js.map
│  │  │  │  │  ├─ payment.module.d.ts
│  │  │  │  │  ├─ payment.module.js
│  │  │  │  │  ├─ payment.module.js.map
│  │  │  │  │  ├─ payment.service.d.ts
│  │  │  │  │  ├─ payment.service.js
│  │  │  │  │  ├─ payment.service.js.map
│  │  │  │  │  └─ webhooks
│  │  │  │  │     ├─ stripe-webhook.controller.d.ts
│  │  │  │  │     ├─ stripe-webhook.controller.js
│  │  │  │  │     └─ stripe-webhook.controller.js.map
│  │  │  │  ├─ products
│  │  │  │  │  ├─ dto
│  │  │  │  │  │  ├─ create-product.dto.d.ts
│  │  │  │  │  │  ├─ create-product.dto.js
│  │  │  │  │  │  ├─ create-product.dto.js.map
│  │  │  │  │  │  ├─ find-products-query.dto.d.ts
│  │  │  │  │  │  ├─ find-products-query.dto.js
│  │  │  │  │  │  ├─ find-products-query.dto.js.map
│  │  │  │  │  │  ├─ update-product.dto.d.ts
│  │  │  │  │  │  ├─ update-product.dto.js
│  │  │  │  │  │  └─ update-product.dto.js.map
│  │  │  │  │  ├─ entities
│  │  │  │  │  │  ├─ product.entity.d.ts
│  │  │  │  │  │  ├─ product.entity.js
│  │  │  │  │  │  └─ product.entity.js.map
│  │  │  │  │  ├─ products.controller.d.ts
│  │  │  │  │  ├─ products.controller.js
│  │  │  │  │  ├─ products.controller.js.map
│  │  │  │  │  ├─ products.module.d.ts
│  │  │  │  │  ├─ products.module.js
│  │  │  │  │  ├─ products.module.js.map
│  │  │  │  │  ├─ products.service.d.ts
│  │  │  │  │  ├─ products.service.js
│  │  │  │  │  └─ products.service.js.map
│  │  │  │  ├─ reviews
│  │  │  │  │  ├─ dto
│  │  │  │  │  │  ├─ create-review.dto.d.ts
│  │  │  │  │  │  ├─ create-review.dto.js
│  │  │  │  │  │  └─ create-review.dto.js.map
│  │  │  │  │  ├─ reviews.controller.d.ts
│  │  │  │  │  ├─ reviews.controller.js
│  │  │  │  │  ├─ reviews.controller.js.map
│  │  │  │  │  ├─ reviews.module.d.ts
│  │  │  │  │  ├─ reviews.module.js
│  │  │  │  │  ├─ reviews.module.js.map
│  │  │  │  │  ├─ reviews.service.d.ts
│  │  │  │  │  ├─ reviews.service.js
│  │  │  │  │  └─ reviews.service.js.map
│  │  │  │  ├─ uploads
│  │  │  │  │  ├─ storage.service.d.ts
│  │  │  │  │  ├─ storage.service.js
│  │  │  │  │  ├─ storage.service.js.map
│  │  │  │  │  ├─ uploads.module.d.ts
│  │  │  │  │  ├─ uploads.module.js
│  │  │  │  │  └─ uploads.module.js.map
│  │  │  │  ├─ users
│  │  │  │  │  ├─ dto
│  │  │  │  │  │  ├─ change-password.dto.d.ts
│  │  │  │  │  │  ├─ change-password.dto.js
│  │  │  │  │  │  ├─ change-password.dto.js.map
│  │  │  │  │  │  ├─ update-user-role.dto.d.ts
│  │  │  │  │  │  ├─ update-user-role.dto.js
│  │  │  │  │  │  ├─ update-user-role.dto.js.map
│  │  │  │  │  │  ├─ update-user.dto.d.ts
│  │  │  │  │  │  ├─ update-user.dto.js
│  │  │  │  │  │  └─ update-user.dto.js.map
│  │  │  │  │  ├─ users.controller.d.ts
│  │  │  │  │  ├─ users.controller.js
│  │  │  │  │  ├─ users.controller.js.map
│  │  │  │  │  ├─ users.module.d.ts
│  │  │  │  │  ├─ users.module.js
│  │  │  │  │  ├─ users.module.js.map
│  │  │  │  │  ├─ users.service.d.ts
│  │  │  │  │  ├─ users.service.js
│  │  │  │  │  └─ users.service.js.map
│  │  │  │  └─ wishlist
│  │  │  │     ├─ dto
│  │  │  │     │  ├─ toggle-wishlist.dto.d.ts
│  │  │  │     │  ├─ toggle-wishlist.dto.js
│  │  │  │     │  └─ toggle-wishlist.dto.js.map
│  │  │  │     ├─ wishlist.controller.d.ts
│  │  │  │     ├─ wishlist.controller.js
│  │  │  │     ├─ wishlist.controller.js.map
│  │  │  │     ├─ wishlist.module.d.ts
│  │  │  │     ├─ wishlist.module.js
│  │  │  │     ├─ wishlist.module.js.map
│  │  │  │     ├─ wishlist.service.d.ts
│  │  │  │     ├─ wishlist.service.js
│  │  │  │     └─ wishlist.service.js.map
│  │  │  ├─ prisma
│  │  │  │  ├─ prisma-exception.filter.d.ts
│  │  │  │  ├─ prisma-exception.filter.js
│  │  │  │  ├─ prisma-exception.filter.js.map
│  │  │  │  ├─ prisma.mock.d.ts
│  │  │  │  ├─ prisma.mock.js
│  │  │  │  ├─ prisma.mock.js.map
│  │  │  │  ├─ prisma.module.d.ts
│  │  │  │  ├─ prisma.module.js
│  │  │  │  ├─ prisma.module.js.map
│  │  │  │  ├─ prisma.service.d.ts
│  │  │  │  ├─ prisma.service.js
│  │  │  │  └─ prisma.service.js.map
│  │  │  ├─ redis
│  │  │  │  ├─ redis.module.d.ts
│  │  │  │  ├─ redis.module.js
│  │  │  │  ├─ redis.module.js.map
│  │  │  │  ├─ redis.service.d.ts
│  │  │  │  ├─ redis.service.js
│  │  │  │  └─ redis.service.js.map
│  │  │  └─ scripts
│  │  │     ├─ migrate-user-addresses.d.ts
│  │  │     ├─ migrate-user-addresses.js
│  │  │     └─ migrate-user-addresses.js.map
│  │  ├─ tsconfig.build.tsbuildinfo
│  │  └─ tsconfig.seed.tsbuildinfo
│  ├─ Dockerfile
│  ├─ eslint.config.mjs
│  ├─ nest-cli.json
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ prisma
│  │  ├─ migrations
│  │  │  ├─ 20260725101615_init
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20260726111453_add_order_status_transitions
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20260727105010_add_processed_webhook_events
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20260728093936_add_product_images
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20260802111342_add_product_marketing_fields
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20260802113102_add_product_rating
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20260808131019_add_user_contact_fields
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20260808141007_add_order_shipping_address
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20260811094201_add_product_specs_colors
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20260811201610_add_email_verified
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20260814100316_add_wishlist_and_coupons
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20260814112126_add_newsletter_subscribers
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20260815122100_add_reviews
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20260815194921_add_addresses
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20260817110327_add_google_auth
│  │  │  │  └─ migration.sql
│  │  │  └─ migration_lock.toml
│  │  ├─ schema.prisma
│  │  └─ seed.ts
│  ├─ prisma.zip
│  ├─ README.md
│  ├─ src
│  │  ├─ app.controller.spec.ts
│  │  ├─ app.controller.ts
│  │  ├─ app.module.ts
│  │  ├─ app.service.ts
│  │  ├─ config
│  │  │  ├─ custom-throttler.guard.ts
│  │  │  ├─ env.validation.ts
│  │  │  └─ rate-limit.module.ts
│  │  ├─ firebase
│  │  │  ├─ firebase-admin.module.ts
│  │  │  └─ firebase-admin.service.ts
│  │  ├─ main.ts
│  │  ├─ modules
│  │  │  ├─ addresses
│  │  │  │  ├─ addresses.controller.ts
│  │  │  │  ├─ Addresses.module.ts
│  │  │  │  ├─ addresses.service.ts
│  │  │  │  └─ dto
│  │  │  │     ├─ create-address.dto.ts
│  │  │  │     └─ update.address.dto.ts
│  │  │  ├─ admin
│  │  │  │  ├─ admin-dashboard.controller.ts
│  │  │  │  ├─ admin-dashboard.service.ts
│  │  │  │  ├─ admin.module.ts
│  │  │  │  └─ dto
│  │  │  │     └─ dashboard-analytics.dto.ts
│  │  │  ├─ auth
│  │  │  │  ├─ auth.controller.ts
│  │  │  │  ├─ auth.module.ts
│  │  │  │  ├─ auth.service.ts
│  │  │  │  ├─ decorators
│  │  │  │  │  ├─ current-user.decorator.ts
│  │  │  │  │  └─ roles.decorator.ts
│  │  │  │  ├─ dto
│  │  │  │  │  ├─ forgot-password.dto.ts
│  │  │  │  │  ├─ google-login.dto.ts
│  │  │  │  │  ├─ login.dto.ts
│  │  │  │  │  ├─ refresh-token.dto.ts
│  │  │  │  │  ├─ register.dto.ts
│  │  │  │  │  ├─ resend-verification.dto.ts
│  │  │  │  │  ├─ reset-password.dto.ts
│  │  │  │  │  └─ verify-email.dto.ts
│  │  │  │  ├─ guards
│  │  │  │  │  ├─ jwt-auth.guard.ts
│  │  │  │  │  └─ roles.guard.ts
│  │  │  │  └─ strategies
│  │  │  │     └─ jwt.strategy.ts
│  │  │  ├─ categories
│  │  │  │  ├─ categories.controller.spec.ts
│  │  │  │  ├─ categories.controller.ts
│  │  │  │  ├─ categories.module.ts
│  │  │  │  ├─ categories.service.spec.ts
│  │  │  │  ├─ categories.service.ts
│  │  │  │  ├─ dto
│  │  │  │  │  ├─ create-category.dto.ts
│  │  │  │  │  └─ update-category.dto.ts
│  │  │  │  └─ entities
│  │  │  │     └─ category.entity.ts
│  │  │  ├─ coupons
│  │  │  │  ├─ coupons.controller.ts
│  │  │  │  ├─ coupons.module.ts
│  │  │  │  ├─ coupons.service.ts
│  │  │  │  └─ dto
│  │  │  │     ├─ create-coupon.dto.ts
│  │  │  │     ├─ update-coupon.dto.ts
│  │  │  │     └─ validate-coupon.dto.ts
│  │  │  ├─ newsletter
│  │  │  │  ├─ dto
│  │  │  │  │  ├─ broadcast-newsletter.dto.ts
│  │  │  │  │  ├─ subscribe.dto.ts
│  │  │  │  │  └─ unsubscribe.dto.ts
│  │  │  │  ├─ newsletter.controller.ts
│  │  │  │  ├─ newsletter.module.ts
│  │  │  │  └─ newsletter.service.ts
│  │  │  ├─ notifications
│  │  │  │  ├─ notifications.module.ts
│  │  │  │  ├─ processors
│  │  │  │  │  ├─ email-verification.processor.ts
│  │  │  │  │  ├─ email.processor.ts
│  │  │  │  │  ├─ invoice.processor.ts
│  │  │  │  │  ├─ newsletter.processor.ts
│  │  │  │  │  ├─ order-cancelled.processor.ts
│  │  │  │  │  └─ password-reset.processor.ts
│  │  │  │  ├─ queues
│  │  │  │  │  └─ notifications.queue.ts
│  │  │  │  └─ templates
│  │  │  │     ├─ email-verification.template.ts
│  │  │  │     ├─ newsletter.template.ts
│  │  │  │     ├─ order-cancelled.template.ts
│  │  │  │     ├─ order-confirmation.template.ts
│  │  │  │     └─ password-reset.template.ts
│  │  │  ├─ orders
│  │  │  │  ├─ dto
│  │  │  │  │  ├─ create-order.dto.ts
│  │  │  │  │  └─ update-order.dto.ts
│  │  │  │  ├─ entities
│  │  │  │  │  └─ order.entity.ts
│  │  │  │  ├─ order-status.state-machine.ts
│  │  │  │  ├─ orders.controller.spec.ts
│  │  │  │  ├─ orders.controller.ts
│  │  │  │  ├─ orders.module.ts
│  │  │  │  ├─ orders.service.spec.ts
│  │  │  │  └─ orders.service.ts
│  │  │  ├─ payment
│  │  │  │  ├─ dto
│  │  │  │  │  └─ create-payment.dto.ts
│  │  │  │  ├─ entities
│  │  │  │  │  └─ payment.entity.ts
│  │  │  │  ├─ payment.controller.ts
│  │  │  │  ├─ payment.module.ts
│  │  │  │  ├─ payment.service.spec.ts
│  │  │  │  ├─ payment.service.ts
│  │  │  │  └─ webhooks
│  │  │  │     └─ stripe-webhook.controller.ts
│  │  │  ├─ products
│  │  │  │  ├─ dto
│  │  │  │  │  ├─ create-product.dto.ts
│  │  │  │  │  ├─ find-products-query.dto.ts
│  │  │  │  │  └─ update-product.dto.ts
│  │  │  │  ├─ entities
│  │  │  │  │  └─ product.entity.ts
│  │  │  │  ├─ products.controller.spec.ts
│  │  │  │  ├─ products.controller.ts
│  │  │  │  ├─ products.module.ts
│  │  │  │  ├─ products.service.spec.ts
│  │  │  │  └─ products.service.ts
│  │  │  ├─ reviews
│  │  │  │  ├─ dto
│  │  │  │  │  └─ create-review.dto.ts
│  │  │  │  ├─ reviews.controller.ts
│  │  │  │  ├─ reviews.module.ts
│  │  │  │  └─ reviews.service.ts
│  │  │  ├─ uploads
│  │  │  │  ├─ storage.service.ts
│  │  │  │  └─ uploads.module.ts
│  │  │  ├─ users
│  │  │  │  ├─ dto
│  │  │  │  │  ├─ change-password.dto.ts
│  │  │  │  │  ├─ update-user-role.dto.ts
│  │  │  │  │  └─ update-user.dto.ts
│  │  │  │  ├─ users.controller.ts
│  │  │  │  ├─ users.module.ts
│  │  │  │  └─ users.service.ts
│  │  │  └─ wishlist
│  │  │     ├─ dto
│  │  │     │  └─ toggle-wishlist.dto.ts
│  │  │     ├─ wishlist.controller.ts
│  │  │     ├─ wishlist.module.ts
│  │  │     └─ wishlist.service.ts
│  │  ├─ prisma
│  │  │  ├─ prisma-exception.filter.ts
│  │  │  ├─ prisma.mock.ts
│  │  │  ├─ prisma.module.ts
│  │  │  └─ prisma.service.ts
│  │  ├─ redis
│  │  │  ├─ redis.module.ts
│  │  │  └─ redis.service.ts
│  │  └─ scripts
│  │     └─ migrate-user-addresses.ts
│  ├─ storage
│  │  └─ invoices
│  │     ├─ 02d4ad3a-07da-450a-98a9-03bdd803ce37.pdf
│  │     ├─ 06573dfa-ca68-4111-a753-fd73ee09a7d7.pdf
│  │     ├─ 0acc0672-2abc-4b18-a8fa-4ff7cc9965e6.pdf
│  │     ├─ 18bf16fb-cb3c-40f3-ab30-dbe765a80c60.pdf
│  │     ├─ 34f78737-64c2-4022-b69c-c5cdf0b742b8.pdf
│  │     ├─ 3b92523e-d135-4578-ae6f-6346d9a7c68d.pdf
│  │     ├─ 3baf2386-b4f1-4ff2-8a34-ac2896183158.pdf
│  │     ├─ 3ee2f1c1-b863-471f-b8a4-a8e665cc6774.pdf
│  │     ├─ 828b8c81-a472-4604-ad86-8b79b3957194.pdf
│  │     ├─ 8b85b315-c176-49b8-a2e7-6a2984d1b363.pdf
│  │     ├─ 9f36b8a8-8961-4793-aaf9-990f83cae1d1.pdf
│  │     ├─ 9f8556aa-a837-4d7d-958c-3af5f6b2c04e.pdf
│  │     ├─ a3a3ecf5-13a0-4092-b661-1c56199eab83.pdf
│  │     ├─ acb2a05c-63dd-403c-99cf-b0a17f1f51a8.pdf
│  │     ├─ b9da5bbc-e479-4cc1-a3f9-6f70df353899.pdf
│  │     ├─ c6710dde-abf2-40e5-b58e-20081b746358.pdf
│  │     ├─ cdb0ac4c-4f46-4ffc-a6da-59319dbbf65a.pdf
│  │     ├─ ce0001f2-617c-4319-ab15-5688a1dcddcb.pdf
│  │     ├─ e09a488f-c5e4-4dcd-a3b2-318456bf4f66.pdf
│  │     ├─ f0342433-475a-4460-826b-d4ee976f36f2.pdf
│  │     └─ f32885d8-bdff-43a6-aaf0-ecde31b2aba0.pdf
│  ├─ test
│  │  ├─ app.e2e-spec.ts
│  │  ├─ auth-flow.e2e-spec.ts
│  │  ├─ jest-e2e.json
│  │  ├─ orders-lifecycle.e2e-spec.ts
│  │  ├─ payment-webhook.e2e-spec.ts
│  │  ├─ products-image-upload.e2e-spec.ts
│  │  └─ utils
│  │     ├─ load-test-env.ts
│  │     ├─ seed.helper.ts
│  │     ├─ supabase.mock.ts
│  │     └─ test-app.setup.ts
│  ├─ tsconfig.build.json
│  ├─ tsconfig.json
│  └─ tsconfig.seed.json
├─ docker-compose.yml
├─ frontend
│  ├─ .dockerignore
│  ├─ .editorconfig
│  ├─ .postcssrc.json
│  ├─ angular.json
│  ├─ dist
│  │  └─ frontend
│  │     ├─ 3rdpartylicenses.txt
│  │     ├─ browser
│  │     │  ├─ assets
│  │     │  │  └─ products
│  │     │  │     ├─ apple-watch-ultra2.jpg
│  │     │  │     ├─ dell-xps15-oled.jpg
│  │     │  │     ├─ echo-show10.jpg
│  │     │  │     ├─ galaxy-buds3-pro.jpg
│  │     │  │     ├─ galaxy-s24-ultra.jpg
│  │     │  │     ├─ ipad-pro-m4.jpg
│  │     │  │     ├─ iphone-15-pro.jpg
│  │     │  │     ├─ lg-ultrawide-34.jpg
│  │     │  │     ├─ logitech-superlight2.jpg
│  │     │  │     ├─ macbook-air-m3.jpg
│  │     │  │     ├─ razer-blackwidow-v4.jpg
│  │     │  │     └─ sony-wh1000xm5.jpg
│  │     │  ├─ cart
│  │     │  │  └─ index.html
│  │     │  ├─ checkout
│  │     │  │  └─ index.html
│  │     │  ├─ chunk-2R26KPD6.js
│  │     │  ├─ chunk-5ETJTXOS.js
│  │     │  ├─ chunk-5TZCY36F.js
│  │     │  ├─ chunk-6IKP5JSR.js
│  │     │  ├─ chunk-BTYVDYBD.js
│  │     │  ├─ chunk-ERNDF2GC.js
│  │     │  ├─ chunk-FUNYN3EU.js
│  │     │  ├─ chunk-HVAW2TSN.js
│  │     │  ├─ chunk-I4SIUU6Y.js
│  │     │  ├─ chunk-J3UG26BZ.js
│  │     │  ├─ chunk-NCZYU4QY.js
│  │     │  ├─ chunk-NDXKPA6V.js
│  │     │  ├─ chunk-VLPOWP4M.js
│  │     │  ├─ chunk-XD2VEMCO.js
│  │     │  ├─ favicon.ico
│  │     │  ├─ forgot-password
│  │     │  │  └─ index.html
│  │     │  ├─ index.csr.html
│  │     │  ├─ index.html
│  │     │  ├─ login
│  │     │  │  └─ index.html
│  │     │  ├─ main-7WUYPRHC.js
│  │     │  ├─ orders
│  │     │  │  └─ index.html
│  │     │  ├─ products
│  │     │  │  └─ index.html
│  │     │  ├─ register
│  │     │  │  └─ index.html
│  │     │  ├─ reset-password
│  │     │  │  └─ index.html
│  │     │  ├─ robots.txt
│  │     │  ├─ styles-ECGKPMGQ.css
│  │     │  └─ verify-email
│  │     │     └─ index.html
│  │     ├─ prerendered-routes.json
│  │     └─ server
│  │        ├─ angular-app-engine-manifest.mjs
│  │        ├─ angular-app-manifest.mjs
│  │        ├─ assets-chunks
│  │        │  ├─ cart_index_html.mjs
│  │        │  ├─ checkout_index_html.mjs
│  │        │  ├─ forgot-password_index_html.mjs
│  │        │  ├─ index_csr_html.mjs
│  │        │  ├─ index_html.mjs
│  │        │  ├─ index_server_html.mjs
│  │        │  ├─ login_index_html.mjs
│  │        │  ├─ orders_index_html.mjs
│  │        │  ├─ products_index_html.mjs
│  │        │  ├─ register_index_html.mjs
│  │        │  ├─ reset-password_index_html.mjs
│  │        │  ├─ styles-ECGKPMGQ_css.mjs
│  │        │  └─ verify-email_index_html.mjs
│  │        ├─ chunk-2E4SYC7I.mjs
│  │        ├─ chunk-5VVPQFJA.mjs
│  │        ├─ chunk-CO3OO7SD.mjs
│  │        ├─ chunk-DHZNLZXZ.mjs
│  │        ├─ chunk-FXK5VO22.mjs
│  │        ├─ chunk-ITOR7NUX.mjs
│  │        ├─ chunk-KUERU4XA.mjs
│  │        ├─ chunk-KYQQYI4M.mjs
│  │        ├─ chunk-L7OGAHRD.mjs
│  │        ├─ chunk-LYHAGGDF.mjs
│  │        ├─ chunk-LYSD24T4.mjs
│  │        ├─ chunk-P7ZYHDB5.mjs
│  │        ├─ chunk-PNNQU4QQ.mjs
│  │        ├─ chunk-RGNG6CVZ.mjs
│  │        ├─ chunk-SRKQV46K.mjs
│  │        ├─ chunk-VPJ5FH5B.mjs
│  │        ├─ chunk-VVFAU37B.mjs
│  │        ├─ chunk-W743XBAT.mjs
│  │        ├─ index.server.html
│  │        ├─ main.server.mjs
│  │        ├─ polyfills.server.mjs
│  │        └─ server.mjs
│  ├─ Dockerfile
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ assets
│  │  │  └─ products
│  │  │     ├─ apple-watch-ultra2.jpg
│  │  │     ├─ dell-xps15-oled.jpg
│  │  │     ├─ echo-show10.jpg
│  │  │     ├─ galaxy-buds3-pro.jpg
│  │  │     ├─ galaxy-s24-ultra.jpg
│  │  │     ├─ ipad-pro-m4.jpg
│  │  │     ├─ iphone-15-pro.jpg
│  │  │     ├─ lg-ultrawide-34.jpg
│  │  │     ├─ logitech-superlight2.jpg
│  │  │     ├─ macbook-air-m3.jpg
│  │  │     ├─ razer-blackwidow-v4.jpg
│  │  │     └─ sony-wh1000xm5.jpg
│  │  ├─ favicon.ico
│  │  └─ robots.txt
│  ├─ README.md
│  ├─ src
│  │  ├─ app
│  │  │  ├─ app.config.server.ts
│  │  │  ├─ app.config.ts
│  │  │  ├─ app.css
│  │  │  ├─ app.html
│  │  │  ├─ app.routes.server.ts
│  │  │  ├─ app.routes.ts
│  │  │  ├─ app.spec.ts
│  │  │  ├─ app.ts
│  │  │  ├─ core
│  │  │  │  ├─ api-base-url.token.ts
│  │  │  │  ├─ guards
│  │  │  │  │  ├─ admin.guard.ts
│  │  │  │  │  └─ auth.guard.ts
│  │  │  │  ├─ interceptors
│  │  │  │  │  ├─ auth.interceptor.ts
│  │  │  │  │  └─ ssr-cookie.interceptor.ts
│  │  │  │  ├─ models
│  │  │  │  │  ├─ address.model.ts
│  │  │  │  │  ├─ cartItem.model.ts
│  │  │  │  │  ├─ category.model.ts
│  │  │  │  │  ├─ checkout.model.ts
│  │  │  │  │  ├─ order.model.ts
│  │  │  │  │  ├─ product.model.ts
│  │  │  │  │  ├─ review.model.ts
│  │  │  │  │  └─ user.model.ts
│  │  │  │  └─ services
│  │  │  │     ├─ address.service.ts
│  │  │  │     ├─ alert.service.ts
│  │  │  │     ├─ auth.service.ts
│  │  │  │     ├─ cart.service.ts
│  │  │  │     ├─ categories.service.ts
│  │  │  │     ├─ checkout.service.ts
│  │  │  │     ├─ coupons.service.ts
│  │  │  │     ├─ newsletter.service.ts
│  │  │  │     ├─ orders.service.ts
│  │  │  │     ├─ payment.service.ts
│  │  │  │     ├─ products.service.ts
│  │  │  │     ├─ reviews.service.ts
│  │  │  │     ├─ showcase.service.ts
│  │  │  │     ├─ stripe.service.ts
│  │  │  │     ├─ users.service.ts
│  │  │  │     └─ wishlist.service.ts
│  │  │  ├─ pages
│  │  │  │  ├─ admin
│  │  │  │  │  ├─ admin-categories
│  │  │  │  │  │  ├─ admin-categories.css
│  │  │  │  │  │  ├─ admin-categories.html
│  │  │  │  │  │  ├─ admin-categories.spec.ts
│  │  │  │  │  │  └─ admin-categories.ts
│  │  │  │  │  ├─ admin-dashboard
│  │  │  │  │  │  ├─ admin-dashboard.css
│  │  │  │  │  │  ├─ admin-dashboard.html
│  │  │  │  │  │  ├─ admin-dashboard.spec.ts
│  │  │  │  │  │  └─ admin-dashboard.ts
│  │  │  │  │  ├─ admin-layout
│  │  │  │  │  │  ├─ admin-layout.css
│  │  │  │  │  │  ├─ admin-layout.html
│  │  │  │  │  │  ├─ admin-layout.spec.ts
│  │  │  │  │  │  └─ admin-layout.ts
│  │  │  │  │  ├─ admin-newsletter
│  │  │  │  │  │  ├─ admin-newsletter.css
│  │  │  │  │  │  ├─ admin-newsletter.html
│  │  │  │  │  │  ├─ admin-newsletter.spec.ts
│  │  │  │  │  │  └─ admin-newsletter.ts
│  │  │  │  │  ├─ admin-orders
│  │  │  │  │  │  ├─ admin-orders.css
│  │  │  │  │  │  ├─ admin-orders.html
│  │  │  │  │  │  ├─ admin-orders.spec.ts
│  │  │  │  │  │  └─ admin-orders.ts
│  │  │  │  │  ├─ admin-product-form
│  │  │  │  │  │  ├─ admin-product-form.css
│  │  │  │  │  │  ├─ admin-product-form.html
│  │  │  │  │  │  ├─ admin-product-form.spec.ts
│  │  │  │  │  │  └─ admin-product-form.ts
│  │  │  │  │  ├─ admin-products
│  │  │  │  │  │  ├─ admin-products.css
│  │  │  │  │  │  ├─ admin-products.html
│  │  │  │  │  │  ├─ admin-products.spec.ts
│  │  │  │  │  │  └─ admin-products.ts
│  │  │  │  │  ├─ admin-reviews
│  │  │  │  │  │  ├─ admin-reviews.css
│  │  │  │  │  │  ├─ admin-reviews.html
│  │  │  │  │  │  ├─ admin-reviews.spec.ts
│  │  │  │  │  │  └─ admin-reviews.ts
│  │  │  │  │  └─ admin-users
│  │  │  │  │     ├─ admin-users.css
│  │  │  │  │     ├─ admin-users.html
│  │  │  │  │     ├─ admin-users.spec.ts
│  │  │  │  │     └─ admin-users.ts
│  │  │  │  ├─ auth
│  │  │  │  │  ├─ auth.css
│  │  │  │  │  ├─ auth.html
│  │  │  │  │  ├─ auth.spec.ts
│  │  │  │  │  └─ auth.ts
│  │  │  │  ├─ cart
│  │  │  │  │  ├─ cart.css
│  │  │  │  │  ├─ cart.html
│  │  │  │  │  ├─ cart.spec.ts
│  │  │  │  │  └─ cart.ts
│  │  │  │  ├─ checkout
│  │  │  │  │  ├─ checkout-footer
│  │  │  │  │  │  ├─ checkout-footer.css
│  │  │  │  │  │  ├─ checkout-footer.html
│  │  │  │  │  │  ├─ checkout-footer.spec.ts
│  │  │  │  │  │  └─ checkout-footer.ts
│  │  │  │  │  ├─ checkout-header
│  │  │  │  │  │  ├─ checkout-header.css
│  │  │  │  │  │  ├─ checkout-header.html
│  │  │  │  │  │  ├─ checkout-header.spec.ts
│  │  │  │  │  │  └─ checkout-header.ts
│  │  │  │  │  ├─ checkout-stepper
│  │  │  │  │  │  ├─ checkout-stepper.css
│  │  │  │  │  │  ├─ checkout-stepper.html
│  │  │  │  │  │  ├─ checkout-stepper.spec.ts
│  │  │  │  │  │  └─ checkout-stepper.ts
│  │  │  │  │  ├─ checkout.css
│  │  │  │  │  ├─ checkout.html
│  │  │  │  │  ├─ checkout.spec.ts
│  │  │  │  │  ├─ checkout.ts
│  │  │  │  │  ├─ order-summary
│  │  │  │  │  │  ├─ order-summary.css
│  │  │  │  │  │  ├─ order-summary.html
│  │  │  │  │  │  ├─ order-summary.spec.ts
│  │  │  │  │  │  └─ order-summary.ts
│  │  │  │  │  ├─ payment-method
│  │  │  │  │  │  ├─ payment-method.css
│  │  │  │  │  │  ├─ payment-method.html
│  │  │  │  │  │  ├─ payment-method.spec.ts
│  │  │  │  │  │  └─ payment-method.ts
│  │  │  │  │  ├─ shipping-address-form
│  │  │  │  │  │  ├─ shipping-address-form.css
│  │  │  │  │  │  ├─ shipping-address-form.html
│  │  │  │  │  │  ├─ shipping-address-form.spec.ts
│  │  │  │  │  │  └─ shipping-address-form.ts
│  │  │  │  │  └─ shipping-method
│  │  │  │  │     ├─ shipping-method.css
│  │  │  │  │     ├─ shipping-method.html
│  │  │  │  │     ├─ shipping-method.spec.ts
│  │  │  │  │     └─ shipping-method.ts
│  │  │  │  ├─ forgot-password
│  │  │  │  │  ├─ forgot-password.css
│  │  │  │  │  ├─ forgot-password.html
│  │  │  │  │  ├─ forgot-password.spec.ts
│  │  │  │  │  └─ forgot-password.ts
│  │  │  │  ├─ home
│  │  │  │  │  ├─ categories
│  │  │  │  │  │  ├─ categories.css
│  │  │  │  │  │  ├─ categories.html
│  │  │  │  │  │  ├─ categories.spec.ts
│  │  │  │  │  │  └─ categories.ts
│  │  │  │  │  ├─ featured-products
│  │  │  │  │  │  ├─ featured-products.css
│  │  │  │  │  │  ├─ featured-products.html
│  │  │  │  │  │  ├─ featured-products.spec.ts
│  │  │  │  │  │  └─ featured-products.ts
│  │  │  │  │  ├─ flash-deals
│  │  │  │  │  │  ├─ flash-deals.css
│  │  │  │  │  │  ├─ flash-deals.html
│  │  │  │  │  │  ├─ flash-deals.spec.ts
│  │  │  │  │  │  └─ flash-deals.ts
│  │  │  │  │  ├─ hero
│  │  │  │  │  │  ├─ hero.css
│  │  │  │  │  │  ├─ hero.html
│  │  │  │  │  │  ├─ hero.spec.ts
│  │  │  │  │  │  └─ hero.ts
│  │  │  │  │  ├─ home.css
│  │  │  │  │  ├─ home.html
│  │  │  │  │  ├─ home.spec.ts
│  │  │  │  │  ├─ home.ts
│  │  │  │  │  └─ trust-section
│  │  │  │  │     ├─ trust-section.css
│  │  │  │  │     ├─ trust-section.html
│  │  │  │  │     ├─ trust-section.spec.ts
│  │  │  │  │     └─ trust-section.ts
│  │  │  │  ├─ not-found
│  │  │  │  │  ├─ not-found.css
│  │  │  │  │  ├─ not-found.html
│  │  │  │  │  ├─ not-found.spec.ts
│  │  │  │  │  └─ not-found.ts
│  │  │  │  ├─ order-confirmation
│  │  │  │  │  ├─ order-confirmation.css
│  │  │  │  │  ├─ order-confirmation.html
│  │  │  │  │  ├─ order-confirmation.spec.ts
│  │  │  │  │  └─ order-confirmation.ts
│  │  │  │  ├─ order-history
│  │  │  │  │  ├─ order-history.css
│  │  │  │  │  ├─ order-history.html
│  │  │  │  │  ├─ order-history.spec.ts
│  │  │  │  │  └─ order-history.ts
│  │  │  │  ├─ product-list
│  │  │  │  │  ├─ earbud-showcase
│  │  │  │  │  │  ├─ earbud-showcase.css
│  │  │  │  │  │  ├─ earbud-showcase.html
│  │  │  │  │  │  ├─ earbud-showcase.spec.ts
│  │  │  │  │  │  └─ earbud-showcase.ts
│  │  │  │  │  ├─ product-list.css
│  │  │  │  │  ├─ product-list.html
│  │  │  │  │  ├─ product-list.spec.ts
│  │  │  │  │  ├─ product-list.ts
│  │  │  │  │  └─ similar-products
│  │  │  │  │     ├─ similar-products.css
│  │  │  │  │     ├─ similar-products.html
│  │  │  │  │     ├─ similar-products.spec.ts
│  │  │  │  │     └─ similar-products.ts
│  │  │  │  ├─ profile
│  │  │  │  │  ├─ profile.css
│  │  │  │  │  ├─ profile.html
│  │  │  │  │  ├─ profile.spec.ts
│  │  │  │  │  └─ profile.ts
│  │  │  │  ├─ reset-password
│  │  │  │  │  ├─ reset-password.css
│  │  │  │  │  ├─ reset-password.html
│  │  │  │  │  ├─ reset-password.spec.ts
│  │  │  │  │  └─ reset-password.ts
│  │  │  │  └─ verify-email
│  │  │  │     ├─ verify-email.css
│  │  │  │     ├─ verify-email.html
│  │  │  │     ├─ verify-email.spec.ts
│  │  │  │     └─ verify-email.ts
│  │  │  └─ shared
│  │  │     ├─ cart-drawer
│  │  │     │  ├─ cart-drawer.css
│  │  │     │  ├─ cart-drawer.html
│  │  │     │  ├─ cart-drawer.spec.ts
│  │  │     │  └─ cart-drawer.ts
│  │  │     ├─ chart-canvas
│  │  │     │  ├─ chart-canvas.css
│  │  │     │  ├─ chart-canvas.html
│  │  │     │  ├─ chart-canvas.spec.ts
│  │  │     │  └─ chart-canvas.ts
│  │  │     ├─ footer
│  │  │     │  ├─ footer.css
│  │  │     │  ├─ footer.html
│  │  │     │  ├─ footer.spec.ts
│  │  │     │  └─ footer.ts
│  │  │     ├─ navbar
│  │  │     │  ├─ navbar.css
│  │  │     │  ├─ navbar.html
│  │  │     │  ├─ navbar.spec.ts
│  │  │     │  └─ navbar.ts
│  │  │     ├─ product-card
│  │  │     │  ├─ product-card.css
│  │  │     │  ├─ product-card.html
│  │  │     │  ├─ product-card.spec.ts
│  │  │     │  └─ product-card.ts
│  │  │     ├─ product-reviews
│  │  │     │  ├─ product-reviews.css
│  │  │     │  ├─ product-reviews.html
│  │  │     │  ├─ product-reviews.spec.ts
│  │  │     │  └─ product-reviews.ts
│  │  │     └─ star-rating
│  │  │        ├─ star-rating.css
│  │  │        ├─ star-rating.html
│  │  │        ├─ star-rating.spec.ts
│  │  │        └─ star-rating.ts
│  │  ├─ environments
│  │  │  ├─ environment.development.ts
│  │  │  └─ environment.ts
│  │  ├─ index.html
│  │  ├─ main.server.ts
│  │  ├─ main.ts
│  │  ├─ server.ts
│  │  ├─ styles.css
│  │  └─ test
│  │     └─ test-providers.ts
│  ├─ tsconfig.app.json
│  ├─ tsconfig.json
│  └─ tsconfig.spec.json
├─ nginx
│  ├─ certs
│  │  ├─ selfsigned.crt
│  │  └─ selfsigned.key
│  └─ nginx.conf
└─ README.md

```