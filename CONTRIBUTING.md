# Contributing to TrackMe Edu

First off, thank you for considering contributing to **TrackMe Edu**
We welcome contributions of all kinds — bug fixes, features, documentation improvements, and tests — as long as they follow the guidelines below.

If you are a first time contributor and looking for your first issue, look out for the `good first issue` tag - these are smaller issues aimed at getting you into the groove.

These rules exist to keep the codebase clean, stable, and easy to maintain.

## General Contribution Rules

Before starting any work, please ensure that:

- You **only work on a sub-branch of `dev`**
- Any changes you make **relate to an existing open issue**
  - If no issue exists, **create one first** and get agreement before starting work
- All pull requests **must target the `dev` branch**
- Contributions should be **small, focused, and easy to review**

## Commits

When contibuting:
- Commit little and often
- Use present tense when referring to changes ("add" not "added")
- Keep the summary line under **72 characters**
- Be descriptive but concise
- Do not use vague statements, e.g:
  - Fixed it
  - Changes
  - Updated
- Ensure commits start with one of the below keywords:
  - `feat: `     - A new feature being introduced
  - `fix: `      - A bug/error being resolved
  - `docs: `     - Update to documentation
  - `style: `    - Update to product styling
  - `refactor: ` - Code changes that neither introduce a new feature nor fix anything
  - `test: `     - Adding tests
  - `chore: `    - Routine tasks (e.g. updating dependencies as part of a vulnerability remediation)

## Branching Strategy

- The `master` branch is **protected** and represents production-ready code
- The `test` branch is **protected** and represents code ready for QA
- The `dev` branch is used for **active development**
- Create feature or fix branches **from `dev`**, for example:
  ```bash
  git checkout dev
  git checkout -b feature/attendance-tracking
  ```
  OR
  ```bash
  git checkout dev
  git checkout -b bug/attendance-tracking
  ```
- Never commit directly to `dev`, `test` or `master`

## Pull Requests

All pull requests must:

- Be opened against the `dev` branch
- Reference a relevant issue using keywords like:
  ```
  Closes #42
  Fixes #17
  ```
- Include a clear description of:
  - What was changed
  - Why it was changed
  - Any trade-offs or limitations introduced
- Be limited in scope - 1 PR = 1 change
Pull requests may be rejected or changes requested if they do not meet these standards.

## Code Quality

All code must adhere to the following:

**KISS Principal**
- Follow KISS (Keep It Simple Stupid)
- Prefer clarity over compression
- Avoid over-engineering or unnecessary abstraction

**Readability**
- Code should be easy to read and understand
- Use clear, descriptive naming for:
  - Variables
  - Functions
  - Classes
- Keep functions small and focussed on a single task

**Comments**
- All code, including Swagger docs and tests, should be commented
- Comments should explain why something exists not what it does
- Comments should be up-to-date and accurate

## Testing
- **Test coverage must only ever be maintained or improved**
- New features and bug fixes must include tests

- Where feasible, tests should be commented with:
  - Sample expected inputs
  - Sample expected outputs
- Tests should be simple to understand and maintain

## Breaking Changes
- Breaking changes should be avoided wherever possible
- If unavoidable:
  - Clearly document the change made
  - Explain migration steps if applicable
  - Highlight the change by checking 'Introduces a breaking change' in the pull request
Pull requests with breaking changes should never be merged, these act as an opportunity of others to aid in remediation

## Security
- Never commit:
  - Secrets
  - API Keys
  - Credentials
  - Personal or sensitive data
- Report breaches of this rule by [emailing an admin](mailto://dataprotection@track-me.app)

## Final Checklist
Before opening a PR, confirm that:
- [ ] My branch was created from `dev`
- [ ] My changes relate to an existing issue (or a new issue was created)
- [ ] My PR targets the `dev` branch
- [ ] Code follows the KISS principle
- [ ] Code is readable and well-commented
- [ ] Tests are up-to-date and well documented
- [ ] All existing tests pass OR check 'Introduces a breaking change' in the PR description
