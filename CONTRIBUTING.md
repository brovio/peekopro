# Contributing to Monkey Mind Task Manager

We love your input! We want to make contributing to Monkey Mind Task Manager as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process
We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Pull Request Process
1. Update the README.md with details of changes to the interface, if applicable.
2. Update the CHANGELOG.md with notes on your changes.
3. The PR will be merged once you have the sign-off of two other developers.

## Coding Standards

### TypeScript
- Use TypeScript for all new code
- Follow the existing type definitions
- Add appropriate interfaces for new features

### React
- Use functional components with hooks
- Follow the component structure in the project
- Use shadcn/ui components when possible

### Styling
- Use Tailwind CSS for styling
- Follow the existing color scheme and design patterns
- Ensure responsive design

### Testing
- Write unit tests for new features
- Ensure existing tests pass
- Follow the existing testing patterns

## Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/monkey-mind-task-manager.git
   ```

2. Install dependencies:
   ```bash
   cd monkey-mind-task-manager
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in the required values in `.env`

4. Start the development server:
   ```bash
   npm run dev
   ```

## Reporting Bugs
We use GitHub issues to track public bugs. Report a bug by opening a new issue.

## License
By contributing, you agree that your contributions will be licensed under its MIT License.

## References
This document was adapted from the open-source contribution guidelines for [Facebook's Draft](https://github.com/facebook/draft-js/blob/master/CONTRIBUTING.md).