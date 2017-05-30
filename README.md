# LINE Bot Boilerplate

Build chatbot with Koa + LINE Message API

## Requirement

Since utilizing the `async/await` of [Koa](http://koajs.com/),
this boilerplate require **node v7.6.0** or higher for ES2015 and async function support.

It is possible to use this project in node version < 7.6, if you introduce the babel transpiler in workflow. To parse and transpile async functions, the minimum one is the [transform-async-to-generator](http://babeljs.io/docs/plugins/transform-async-to-module-method/) or [transform-async-to-module-method](http://babeljs.io/docs/plugins/transform-async-to-generator/) plugins

This boilerplate is supposed to run on any operation system.

## Install

Install the dependency with npm

```bash
npm install
```

Or if you prefer use [yarn](https://yarnpkg.com/lang/en/),

```bash
yarn
```

### Env Setting

This project would load `.env.(dev|prod)` in project root depending on your NODE_ENV environment variable.

Please refer to `.env.example` and setup the corresponding env setting before running the project.

## Development

To develop your LINE Bot, setup the `.env.dev` file under project root first and then run

```bash
npm run dev
```

This will run a [nodemon](https://github.com/remy/nodemon) server in localhost, watching all the source code change and restart the server. NODE_ENV would set to be `development` under this command.

### Coding Style

The coding style used in this project was the one extends from [Google Style](https://github.com/google/eslint-config-google). The detail could be referred in `.eslintrc.json`.

Otherwise, this project was utilize the [Prettier](https://github.com/prettier/prettier) to format the style, run

```bash
npm run prettier
```

to automatically format all js source.

Or if your favorite code editor is vscode, these is a great extension [Prettier-ESLinter](https://marketplace.visualstudio.com/items?itemName=RobinMalfait.prettier-eslint-vscode) that can format the source code every time after you save it!

## Unit Testing

This project use Mocha and Chai.

Place the spec files under `<root>/test/spec`, run

```bash
npm test
```

and mocha would watch for all test files changes.

For coverage report, run

```bash
npm run coverage
```

## Production

Setup your production environment setting `.env.prod` first, and then run

```bash
npm start
```

## License

MIT
