<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="140" alt="Nest Logo" /></a>
  <a href="https://www.mongodb.com/pt-br" target="blank"><img src="https://img.shields.io/badge/MongoDB-white?style=for-the-badge&logo=mongodb&logoColor=4EA94B" width="140" alt="MongoDB Logo" /></a>
  <a href="https://www.docker.com/" target="blank"><img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" width="140" alt="Docker Logo" /></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) API RestFULL with [Mongoose](https://mongoosejs.com/) and [Docker](https://www.docker.com/) 

## Live in Heroku

https://connectabil-nestjs-heroku.herokuapp.com/

## Test in Live

https://connectabil-nestjs-heroku.herokuapp.com/companies - FindAll Companies   
https://connectabil-nestjs-heroku.herokuapp.com/jobs - FindAll Jobs   
```   
https://connectabil-nestjs-heroku.herokuapp.com/companies?params=[['active', true]] - Companies Actived   
https://connectabil-nestjs-heroku.herokuapp.com/companies?params=[['job', 'FullStack Sênior']] - Companies by Job   
```   
*For more details of consumes API RestFULL see or download and import Postman collection available in https://drive.google.com/file/d/1vc3hVrgam3d0HMa4ODzcNPuO1bLKitIC/view?usp=sharing   

## Installation and Running the app in Docker

```bash
$ docker-compose up dev
```

## Installation the app outside of Docker

```bash
$ yarn install
```

## Running the app outside of Docker

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```
## Test in local

http://localhost:5000/companies - FinAll Companies   
http://localhost:5000/jobs - FinAll Jobs   

*For more details of consumes API RestFULL see or download and import Postman collection available in https://drive.google.com/file/d/1vc3hVrgam3d0HMa4ODzcNPuO1bLKitIC/view?usp=sharing   

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
