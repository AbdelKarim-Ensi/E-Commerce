
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