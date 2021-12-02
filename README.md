
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
Code Structure
```
├──environments
├──src
    │   app.controller.spec.ts
    │   app.controller.ts
    │   app.module.ts
    │   app.service.ts
    │   main.ts
    ├──common
    │   │   constant.ts
    │   └──repository
    │       │   repository.ts
    │       └──interface
    │               IRepository.ts
    ├──config
    │       configuration.ts
    ├──interceptor
    │       logging.interceptor.ts
    │       tranform.interceptor.ts
    └──modules
        ├──auth
        │   │   auth.guard.ts
        │   │   auth.module.ts
        │   ├──controller
        │   │       auth.controller.ts
        │   ├──domain
        │   │   ├──entities
        │   │   │       permission.entity.ts
        │   │   │       role.entity.ts
        │   │   └──interface
        │   │           IPermission.interface.ts
        │   │           IRole.interface.ts
        │   ├──infrastructure
        │   │   └──repository
        │   └──service
        │           auth.service.ts
        ├──event
        │   │   event.module.ts
        │   ├──controller
        │   │       event.controller.ts
        │   ├──domain
        │   │   ├──entities
        │   │   │       event.entities.ts
        │   │   └──interface
        │   │           IEvent.interface.ts
        │   ├──dto
        │   │       event.dto.ts
        │   ├──infrastructure
        │   │       event.repository.ts
        │   └──service
        │           event.service.ts
        ├──payment
        │   │   payment.module.ts
        │   ├──controller
        │   │       payment.controller.ts
        │   ├──domain
        │   │   ├──entities
        │   │   │       bank.entity.ts
        │   │   │       order.entity.ts
        │   │   └──interface
        │   │           IOrder.interface.ts
        │   ├──dto
        │   │       payment.dto.ts
        │   ├──infrastructure
        │   │       payment.repository.ts
        │   └──service
        │           payment.service.ts
        ├──ticket
        │   │   ticket.module.ts
        │   ├──controller
        │   │       ticket.controller.ts
        │   ├──domain
        │   │   ├──entities
        │   │   │       ticket.entities.ts
        │   │   └──interface
        │   │           ITicket.interface.ts
        │   ├──dto
        │   │       ticket.dto.ts
        │   ├──infrastructure
        │   │       ticket.repository.ts
        │   └──service
        │           ticket.service.ts
        └──user
            │   user.module.ts
            ├──controller
            │       user.controller.ts
            ├──domain
            │   ├──entities
            │   │       user.entity.ts
            │   └──interface
            │           IUser.interface.ts
            ├──dto
            │       user.dto.ts
            ├──infrastructure
            │       user.repository.ts
            └──service
                    user.service.ts
```
## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
