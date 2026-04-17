# Project Phoenix - AI-Augmented QA Automation Framework

## 🚀 Overview
This framework demonstrates a modern, AI-augmented approach to test automation using Playwright, self-healing selectors, and intelligent test generation.

## 🏗️ Architecture
Project Phoenix/
├── .github/workflows/ # CI/CD pipelines
├── src/
│ ├── pages/ # Page Object Models
│ ├── tests/
│ │ ├── api/ # API layer tests
│ │ └── ui/ # UI tests with self-healing
│ ├── ai/ # AI integration modules
│ ├── utils/ # Helper utilities
│ └── config/ # Framework configuration


## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- (Optional) OpenAI API key for AI self-healing features

## 🔧 Installation

```bash
# Clone repository
git clone https://github.com/jpdalai1988/project-phoenix-qa.git
cd project-phoenix-qa

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your credentials
nano .env

# Install Playwright browsers
npx playwright install

## Setup
npm install
npx playwright install

# Run API tests only (fast feedback)
npm run test:api
# OR
npx playwright test src/tests/api/

# Run UI tests only
npm run test:ui
# OR
npx playwright test src/tests/ui/

# Run all tests
npm run test:all

# Run tests with visible browser (headed mode)
npm run test:headed

# Debug tests
npm run test:debug

# Generate and view HTML report
npm run report
# OR
npx playwright show-report

## CI/CD
GitHub Actions configured to:
1. Run API tests
2. Run UI tests only if API passes
3. Generate reports

## AI Features
- Test generation from Jira
- Self-healing locators
- Failure analysis using AI