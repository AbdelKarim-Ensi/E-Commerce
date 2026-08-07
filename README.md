
```
frontend
├─ .angular
├─ .editorconfig
├─ .postcssrc.json
├─ angular.json
├─ package-lock.json
├─ package.json
├─ public
│  ├─ assets
│  │  └─ products
│  │     ├─ apple-watch-ultra2.jpg
│  │     ├─ dell-xps15-oled.jpg
│  │     ├─ echo-show10.jpg
│  │     ├─ galaxy-buds3-pro.jpg
│  │     ├─ galaxy-s24-ultra.jpg
│  │     ├─ ipad-pro-m4.jpg
│  │     ├─ iphone-15-pro.jpg
│  │     ├─ lg-ultrawide-34.jpg
│  │     ├─ logitech-superlight2.jpg
│  │     ├─ macbook-air-m3.jpg
│  │     ├─ razer-blackwidow-v4.jpg
│  │     └─ sony-wh1000xm5.jpg
│  └─ favicon.ico
├─ README.md
├─ src
│  ├─ app
│  │  ├─ app.config.server.ts
│  │  ├─ app.config.ts
│  │  ├─ app.css
│  │  ├─ app.html
│  │  ├─ app.routes.server.ts
│  │  ├─ app.routes.ts
│  │  ├─ app.spec.ts
│  │  ├─ app.ts
│  │  ├─ core
│  │  │  ├─ guards
│  │  │  │  └─ auth.guard.ts
│  │  │  ├─ interceptors
│  │  │  │  └─ auth.interceptor.ts
│  │  │  ├─ models
│  │  │  │  ├─ cartItem.model.ts
│  │  │  │  ├─ category.model.ts
│  │  │  │  ├─ order.model.ts
│  │  │  │  ├─ product.model.ts
│  │  │  │  └─ user.model.ts
│  │  │  └─ services
│  │  │     ├─ auth.service.ts
│  │  │     ├─ cart.service.ts
│  │  │     ├─ categories.service.ts
│  │  │     ├─ orders.service.ts
│  │  │     ├─ payment.service.ts
│  │  │     ├─ products.service.ts
│  │  │     └─ showcase.service.ts
│  │  ├─ pages
│  │  │  ├─ cart
│  │  │  │  ├─ cart.css
│  │  │  │  ├─ cart.html
│  │  │  │  ├─ cart.spec.ts
│  │  │  │  └─ cart.ts
│  │  │  ├─ checkout
│  │  │  │  ├─ checkout.css
│  │  │  │  ├─ checkout.html
│  │  │  │  ├─ checkout.spec.ts
│  │  │  │  └─ checkout.ts
│  │  │  ├─ home
│  │  │  │  ├─ categories
│  │  │  │  │  ├─ categories.css
│  │  │  │  │  ├─ categories.html
│  │  │  │  │  ├─ categories.spec.ts
│  │  │  │  │  └─ categories.ts
│  │  │  │  ├─ featured-products
│  │  │  │  │  ├─ featured-products.css
│  │  │  │  │  ├─ featured-products.html
│  │  │  │  │  ├─ featured-products.spec.ts
│  │  │  │  │  └─ featured-products.ts
│  │  │  │  ├─ flash-deals
│  │  │  │  │  ├─ flash-deals.css
│  │  │  │  │  ├─ flash-deals.html
│  │  │  │  │  ├─ flash-deals.spec.ts
│  │  │  │  │  └─ flash-deals.ts
│  │  │  │  ├─ hero
│  │  │  │  │  ├─ hero.css
│  │  │  │  │  ├─ hero.html
│  │  │  │  │  ├─ hero.spec.ts
│  │  │  │  │  └─ hero.ts
│  │  │  │  ├─ home.css
│  │  │  │  ├─ home.html
│  │  │  │  ├─ home.spec.ts
│  │  │  │  ├─ home.ts
│  │  │  │  └─ trust-section
│  │  │  │     ├─ trust-section.css
│  │  │  │     ├─ trust-section.html
│  │  │  │     ├─ trust-section.spec.ts
│  │  │  │     └─ trust-section.ts
│  │  │  ├─ login
│  │  │  │  ├─ login.css
│  │  │  │  ├─ login.html
│  │  │  │  ├─ login.spec.ts
│  │  │  │  └─ login.ts
│  │  │  ├─ order-history
│  │  │  │  ├─ order-history.css
│  │  │  │  ├─ order-history.html
│  │  │  │  ├─ order-history.spec.ts
│  │  │  │  └─ order-history.ts
│  │  │  ├─ product-detail
│  │  │  │  ├─ product-detail.css
│  │  │  │  ├─ product-detail.html
│  │  │  │  ├─ product-detail.spec.ts
│  │  │  │  └─ product-detail.ts
│  │  │  ├─ product-list
│  │  │  │  ├─ earbud-showcase
│  │  │  │  │  ├─ earbud-showcase.css
│  │  │  │  │  ├─ earbud-showcase.html
│  │  │  │  │  ├─ earbud-showcase.spec.ts
│  │  │  │  │  └─ earbud-showcase.ts
│  │  │  │  ├─ product-list.css
│  │  │  │  ├─ product-list.html
│  │  │  │  ├─ product-list.spec.ts
│  │  │  │  └─ product-list.ts
│  │  │  └─ register
│  │  │     ├─ register.css
│  │  │     ├─ register.html
│  │  │     ├─ register.spec.ts
│  │  │     └─ register.ts
│  │  └─ shared
│  │     ├─ cart-drawer
│  │     │  ├─ cart-drawer.css
│  │     │  ├─ cart-drawer.html
│  │     │  ├─ cart-drawer.spec.ts
│  │     │  └─ cart-drawer.ts
│  │     ├─ categories
│  │     ├─ footer
│  │     │  ├─ footer.css
│  │     │  ├─ footer.html
│  │     │  ├─ footer.spec.ts
│  │     │  └─ footer.ts
│  │     ├─ navbar
│  │     │  ├─ navbar.css
│  │     │  ├─ navbar.html
│  │     │  ├─ navbar.spec.ts
│  │     │  └─ navbar.ts
│  │     ├─ product-card
│  │     │  ├─ product-card.css
│  │     │  ├─ product-card.html
│  │     │  ├─ product-card.spec.ts
│  │     │  └─ product-card.ts
│  │     └─ star-rating
│  │        ├─ star-rating.css
│  │        ├─ star-rating.html
│  │        ├─ star-rating.spec.ts
│  │        └─ star-rating.ts
│  ├─ environments
│  │  ├─ environment.development.ts
│  │  └─ environment.ts
│  ├─ index.html
│  ├─ main.server.ts
│  ├─ main.ts
│  ├─ server.ts
│  └─ styles.css
├─ tsconfig.app.json
├─ tsconfig.json
└─ tsconfig.spec.json

```
```
frontend
├─ .angular
├─ .editorconfig
├─ .postcssrc.json
├─ angular.json
├─ package-lock.json
├─ package.json
├─ public
│  ├─ assets
│  │  └─ products
│  │     ├─ apple-watch-ultra2.jpg
│  │     ├─ dell-xps15-oled.jpg
│  │     ├─ echo-show10.jpg
│  │     ├─ galaxy-buds3-pro.jpg
│  │     ├─ galaxy-s24-ultra.jpg
│  │     ├─ ipad-pro-m4.jpg
│  │     ├─ iphone-15-pro.jpg
│  │     ├─ lg-ultrawide-34.jpg
│  │     ├─ logitech-superlight2.jpg
│  │     ├─ macbook-air-m3.jpg
│  │     ├─ razer-blackwidow-v4.jpg
│  │     └─ sony-wh1000xm5.jpg
│  └─ favicon.ico
├─ README.md
├─ src
│  ├─ app
│  │  ├─ app.config.server.ts
│  │  ├─ app.config.ts
│  │  ├─ app.css
│  │  ├─ app.html
│  │  ├─ app.routes.server.ts
│  │  ├─ app.routes.ts
│  │  ├─ app.spec.ts
│  │  ├─ app.ts
│  │  ├─ core
│  │  │  ├─ guards
│  │  │  │  └─ auth.guard.ts
│  │  │  ├─ interceptors
│  │  │  │  └─ auth.interceptor.ts
│  │  │  ├─ models
│  │  │  │  ├─ cartItem.model.ts
│  │  │  │  ├─ category.model.ts
│  │  │  │  ├─ checkout.model.ts
│  │  │  │  ├─ order.model.ts
│  │  │  │  ├─ product.model.ts
│  │  │  │  └─ user.model.ts
│  │  │  └─ services
│  │  │     ├─ auth.service.ts
│  │  │     ├─ cart.service.ts
│  │  │     ├─ categories.service.ts
│  │  │     ├─ checkout.service.ts
│  │  │     ├─ orders.service.ts
│  │  │     ├─ payment.service.ts
│  │  │     ├─ products.service.ts
│  │  │     └─ showcase.service.ts
│  │  ├─ pages
│  │  │  ├─ cart
│  │  │  │  ├─ cart.css
│  │  │  │  ├─ cart.html
│  │  │  │  ├─ cart.spec.ts
│  │  │  │  └─ cart.ts
│  │  │  ├─ checkout
│  │  │  │  ├─ checkout.css
│  │  │  │  ├─ checkout.html
│  │  │  │  ├─ checkout.spec.ts
│  │  │  │  └─ checkout.ts
│  │  │  ├─ home
│  │  │  │  ├─ categories
│  │  │  │  │  ├─ categories.css
│  │  │  │  │  ├─ categories.html
│  │  │  │  │  ├─ categories.spec.ts
│  │  │  │  │  └─ categories.ts
│  │  │  │  ├─ featured-products
│  │  │  │  │  ├─ featured-products.css
│  │  │  │  │  ├─ featured-products.html
│  │  │  │  │  ├─ featured-products.spec.ts
│  │  │  │  │  └─ featured-products.ts
│  │  │  │  ├─ flash-deals
│  │  │  │  │  ├─ flash-deals.css
│  │  │  │  │  ├─ flash-deals.html
│  │  │  │  │  ├─ flash-deals.spec.ts
│  │  │  │  │  └─ flash-deals.ts
│  │  │  │  ├─ hero
│  │  │  │  │  ├─ hero.css
│  │  │  │  │  ├─ hero.html
│  │  │  │  │  ├─ hero.spec.ts
│  │  │  │  │  └─ hero.ts
│  │  │  │  ├─ home.css
│  │  │  │  ├─ home.html
│  │  │  │  ├─ home.spec.ts
│  │  │  │  ├─ home.ts
│  │  │  │  └─ trust-section
│  │  │  │     ├─ trust-section.css
│  │  │  │     ├─ trust-section.html
│  │  │  │     ├─ trust-section.spec.ts
│  │  │  │     └─ trust-section.ts
│  │  │  ├─ login
│  │  │  │  ├─ login.css
│  │  │  │  ├─ login.html
│  │  │  │  ├─ login.spec.ts
│  │  │  │  └─ login.ts
│  │  │  ├─ order-history
│  │  │  │  ├─ order-history.css
│  │  │  │  ├─ order-history.html
│  │  │  │  ├─ order-history.spec.ts
│  │  │  │  └─ order-history.ts
│  │  │  ├─ product-detail
│  │  │  │  ├─ product-detail.css
│  │  │  │  ├─ product-detail.html
│  │  │  │  ├─ product-detail.spec.ts
│  │  │  │  └─ product-detail.ts
│  │  │  ├─ product-list
│  │  │  │  ├─ earbud-showcase
│  │  │  │  │  ├─ earbud-showcase.css
│  │  │  │  │  ├─ earbud-showcase.html
│  │  │  │  │  ├─ earbud-showcase.spec.ts
│  │  │  │  │  └─ earbud-showcase.ts
│  │  │  │  ├─ product-list.css
│  │  │  │  ├─ product-list.html
│  │  │  │  ├─ product-list.spec.ts
│  │  │  │  └─ product-list.ts
│  │  │  └─ register
│  │  │     ├─ register.css
│  │  │     ├─ register.html
│  │  │     ├─ register.spec.ts
│  │  │     └─ register.ts
│  │  └─ shared
│  │     ├─ cart-drawer
│  │     │  ├─ cart-drawer.css
│  │     │  ├─ cart-drawer.html
│  │     │  ├─ cart-drawer.spec.ts
│  │     │  └─ cart-drawer.ts
│  │     ├─ categories
│  │     ├─ footer
│  │     │  ├─ footer.css
│  │     │  ├─ footer.html
│  │     │  ├─ footer.spec.ts
│  │     │  └─ footer.ts
│  │     ├─ navbar
│  │     │  ├─ navbar.css
│  │     │  ├─ navbar.html
│  │     │  ├─ navbar.spec.ts
│  │     │  └─ navbar.ts
│  │     ├─ product-card
│  │     │  ├─ product-card.css
│  │     │  ├─ product-card.html
│  │     │  ├─ product-card.spec.ts
│  │     │  └─ product-card.ts
│  │     └─ star-rating
│  │        ├─ star-rating.css
│  │        ├─ star-rating.html
│  │        ├─ star-rating.spec.ts
│  │        └─ star-rating.ts
│  ├─ environments
│  │  ├─ environment.development.ts
│  │  └─ environment.ts
│  ├─ index.html
│  ├─ main.server.ts
│  ├─ main.ts
│  ├─ server.ts
│  └─ styles.css
├─ tsconfig.app.json
├─ tsconfig.json
└─ tsconfig.spec.json

```
```
frontend
├─ .angular
├─ .editorconfig
├─ .postcssrc.json
├─ angular.json
├─ package-lock.json
├─ package.json
├─ public
│  ├─ assets
│  │  └─ products
│  │     ├─ apple-watch-ultra2.jpg
│  │     ├─ dell-xps15-oled.jpg
│  │     ├─ echo-show10.jpg
│  │     ├─ galaxy-buds3-pro.jpg
│  │     ├─ galaxy-s24-ultra.jpg
│  │     ├─ ipad-pro-m4.jpg
│  │     ├─ iphone-15-pro.jpg
│  │     ├─ lg-ultrawide-34.jpg
│  │     ├─ logitech-superlight2.jpg
│  │     ├─ macbook-air-m3.jpg
│  │     ├─ razer-blackwidow-v4.jpg
│  │     └─ sony-wh1000xm5.jpg
│  └─ favicon.ico
├─ README.md
├─ src
│  ├─ app
│  │  ├─ app.config.server.ts
│  │  ├─ app.config.ts
│  │  ├─ app.css
│  │  ├─ app.html
│  │  ├─ app.routes.server.ts
│  │  ├─ app.routes.ts
│  │  ├─ app.spec.ts
│  │  ├─ app.ts
│  │  ├─ core
│  │  │  ├─ guards
│  │  │  │  └─ auth.guard.ts
│  │  │  ├─ interceptors
│  │  │  │  └─ auth.interceptor.ts
│  │  │  ├─ models
│  │  │  │  ├─ cartItem.model.ts
│  │  │  │  ├─ category.model.ts
│  │  │  │  ├─ checkout.model.ts
│  │  │  │  ├─ order.model.ts
│  │  │  │  ├─ product.model.ts
│  │  │  │  └─ user.model.ts
│  │  │  └─ services
│  │  │     ├─ auth.service.ts
│  │  │     ├─ cart.service.ts
│  │  │     ├─ categories.service.ts
│  │  │     ├─ checkout.service.ts
│  │  │     ├─ orders.service.ts
│  │  │     ├─ payment.service.ts
│  │  │     ├─ products.service.ts
│  │  │     └─ showcase.service.ts
│  │  ├─ pages
│  │  │  ├─ cart
│  │  │  │  ├─ cart.css
│  │  │  │  ├─ cart.html
│  │  │  │  ├─ cart.spec.ts
│  │  │  │  └─ cart.ts
│  │  │  ├─ checkout
│  │  │  │  ├─ checkout.css
│  │  │  │  ├─ checkout.html
│  │  │  │  ├─ checkout.spec.ts
│  │  │  │  └─ checkout.ts
│  │  │  ├─ home
│  │  │  │  ├─ categories
│  │  │  │  │  ├─ categories.css
│  │  │  │  │  ├─ categories.html
│  │  │  │  │  ├─ categories.spec.ts
│  │  │  │  │  └─ categories.ts
│  │  │  │  ├─ featured-products
│  │  │  │  │  ├─ featured-products.css
│  │  │  │  │  ├─ featured-products.html
│  │  │  │  │  ├─ featured-products.spec.ts
│  │  │  │  │  └─ featured-products.ts
│  │  │  │  ├─ flash-deals
│  │  │  │  │  ├─ flash-deals.css
│  │  │  │  │  ├─ flash-deals.html
│  │  │  │  │  ├─ flash-deals.spec.ts
│  │  │  │  │  └─ flash-deals.ts
│  │  │  │  ├─ hero
│  │  │  │  │  ├─ hero.css
│  │  │  │  │  ├─ hero.html
│  │  │  │  │  ├─ hero.spec.ts
│  │  │  │  │  └─ hero.ts
│  │  │  │  ├─ home.css
│  │  │  │  ├─ home.html
│  │  │  │  ├─ home.spec.ts
│  │  │  │  ├─ home.ts
│  │  │  │  └─ trust-section
│  │  │  │     ├─ trust-section.css
│  │  │  │     ├─ trust-section.html
│  │  │  │     ├─ trust-section.spec.ts
│  │  │  │     └─ trust-section.ts
│  │  │  ├─ login
│  │  │  │  ├─ login.css
│  │  │  │  ├─ login.html
│  │  │  │  ├─ login.spec.ts
│  │  │  │  └─ login.ts
│  │  │  ├─ order-history
│  │  │  │  ├─ order-history.css
│  │  │  │  ├─ order-history.html
│  │  │  │  ├─ order-history.spec.ts
│  │  │  │  └─ order-history.ts
│  │  │  ├─ product-detail
│  │  │  │  ├─ product-detail.css
│  │  │  │  ├─ product-detail.html
│  │  │  │  ├─ product-detail.spec.ts
│  │  │  │  └─ product-detail.ts
│  │  │  ├─ product-list
│  │  │  │  ├─ earbud-showcase
│  │  │  │  │  ├─ earbud-showcase.css
│  │  │  │  │  ├─ earbud-showcase.html
│  │  │  │  │  ├─ earbud-showcase.spec.ts
│  │  │  │  │  └─ earbud-showcase.ts
│  │  │  │  ├─ product-list.css
│  │  │  │  ├─ product-list.html
│  │  │  │  ├─ product-list.spec.ts
│  │  │  │  └─ product-list.ts
│  │  │  └─ register
│  │  │     ├─ register.css
│  │  │     ├─ register.html
│  │  │     ├─ register.spec.ts
│  │  │     └─ register.ts
│  │  └─ shared
│  │     ├─ cart-drawer
│  │     │  ├─ cart-drawer.css
│  │     │  ├─ cart-drawer.html
│  │     │  ├─ cart-drawer.spec.ts
│  │     │  └─ cart-drawer.ts
│  │     ├─ categories
│  │     ├─ footer
│  │     │  ├─ footer.css
│  │     │  ├─ footer.html
│  │     │  ├─ footer.spec.ts
│  │     │  └─ footer.ts
│  │     ├─ navbar
│  │     │  ├─ navbar.css
│  │     │  ├─ navbar.html
│  │     │  ├─ navbar.spec.ts
│  │     │  └─ navbar.ts
│  │     ├─ product-card
│  │     │  ├─ product-card.css
│  │     │  ├─ product-card.html
│  │     │  ├─ product-card.spec.ts
│  │     │  └─ product-card.ts
│  │     └─ star-rating
│  │        ├─ star-rating.css
│  │        ├─ star-rating.html
│  │        ├─ star-rating.spec.ts
│  │        └─ star-rating.ts
│  ├─ environments
│  │  ├─ environment.development.ts
│  │  └─ environment.ts
│  ├─ index.html
│  ├─ main.server.ts
│  ├─ main.ts
│  ├─ server.ts
│  └─ styles.css
├─ tsconfig.app.json
├─ tsconfig.json
└─ tsconfig.spec.json

```