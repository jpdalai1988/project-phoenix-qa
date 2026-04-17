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
- (Optional) OpenAI API key for AI features

## 🔧 Installation

```bash
# Clone repository
git clone <your-repo-url>
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

## Run Tests
# API
npx playwright test tests/api

# UI
npx playwright test tests/ui

## CI/CD
GitHub Actions configured to:
1. Run API tests
2. Run UI tests only if API passes
3. Generate reports

## AI Features
- Test generation from Jira
- Self-healing locators
- Failure analysis using AI