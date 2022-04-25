# Contributing Guidelines

We're glad to have you want to contribute to this project! This document will help answer common questions you may have during your first contribution. Following these standards demonstrates that you value the time spent by the developers that manage and maintain this open source project.

#### Before you contribute...

Read this document before you contribute in any form.

## Submitting an Issue
Not all contributions comes in the form of code. Feautures, bug fixes, and documentation are all valid contributions. 

## Creating a Pull Request
In order to create a pull request to contribute, the processes are simple

1. Create a fork of the repository.
2. Clone the fork.
``` bash
git clone https://github.com/username/multichain-crypto-wallet.git
```
3. Create a new branch. This would be the name of the feature/issue you are working on.
4. Install dependencies and start the project locally.
``` javascript
yarn // npm install
yan start // npm run start
```
5. Run tests. Jest tests are setup to run in watch mode.
``` javascript
yarn test // npm run test
```
6. Make your necessary changes and accompany each function with a test.

## Configuration

Code quality is set up for you with `prettier`, `husky`, and `lint-staged`. Adjust the respective fields in `package.json` accordingly.