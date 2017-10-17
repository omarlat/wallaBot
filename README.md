# WallaBot

### Installation

WallaBot requires [Node.js](https://nodejs.org/) v6+ to run.


Install the dependencies and devDependencies and start the server.

```sh
$ cd wallaBot
$ npm install
$ node app.js
```

### Database

Use env.DB_VENDOR to choose between MYSQL and FIREBASE

```sh
export DB_VENDOR=FIREBASE
```

When using Firebase, service-account.json is needed inside db folder. Follow the instructions: https://firebase.google.com/docs/admin/setup