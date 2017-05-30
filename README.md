# Livelihood Chatbot

[![Build Status][travis-badge]][travis-link]
[![Coverage Status][coveralls-badge]][coveralls-link]

Chatbot interface for pushing government livelihood notification

Currently only support LINE service.

## Install

*node version **v7.6.0** or higher is required for this project, detail could be referred in [here](https://github.com/EasonChiang7178/LINE-Bot-Boilerplate#requirement)*

Install the dependency with npm

```bash
npm install
```

Or if you prefer use [yarn](https://yarnpkg.com/lang/en/),

```bash
yarn
```

#### Env Setting

This project would load `.env.(dev|prod)` in project root depending on your NODE_ENV environment variable.

Please refer to `.env.example` and setup the corresponding env setting before running the project.

## Development

To develop the LINE Bot, setup the `.env.dev` file under project root first and then run

```bash
npm run dev
```

This will run a [nodemon](https://github.com/remy/nodemon) server in localhost, watching all the source code change and restart the server. NODE_ENV would set to be `development` under this command.

#### Coding Style

The coding style used in this project was the one extends from [Google Style](https://github.com/google/eslint-config-google). The detail could be referred in `.eslintrc.json`.

Otherwise, this project was utilize the [Prettier](https://github.com/prettier/prettier) to format the style, run

```bash
npm run prettier
```

to automatically format all js source.

Or if your favorite code editor is vscode, these is a great extension [Prettier-ESLinter](https://marketplace.visualstudio.com/items?itemName=RobinMalfait.prettier-eslint-vscode) that can format the source code every time after you save it!

## Testing

Place the spec files under `<root>/test/spec`, run

```bash
npm test
```

and mocha would watch for all test files changes.

For coverage report, run

```bash
npm run coverage
```

## License

MIT

[travis-badge]: https://travis-ci.org/StudyNightClub/livelihood-chatbot.svg?branch=master
[travis-link]: https://travis-ci.org/StudyNightClub/livelihood-chatbot
[coveralls-badge]: https://codecov.io/github/StudyNightClub/livelihood-chatbot/coverage.svg?branch=master
[coveralls-link]: https://codecov.io/github/StudyNightClub/livelihood-chatbot?branch=master
