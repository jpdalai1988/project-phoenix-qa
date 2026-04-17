import OpenAI from 'openai';
import axios from 'axios';

interface JiraTicket {
  key: string;
  summary: string;
  description: string;
  acceptanceCriteria: string[];
}

interface TestCase {
  name: string;
  steps: string[];
  assertions: string[];
  testData: Record<string, any>;
}

export class JiraTestGenerator {
  private openai: OpenAI;
  private jiraConfig: any;

  constructor(openaiApiKey: string, jiraConfig?: any) {
    this.openai = new OpenAI({ apiKey: openaiApiKey });
    this.jiraConfig = jiraConfig;
  }

  async fetchJiraTicket(ticketId: string): Promise<JiraTicket> {
    // Simulate fetching from Jira
    // In production, use Jira REST API
    return {
      key: ticketId,
      summary: "User should be able to login and upload KYC documents",
      description: "As a merchant, I want to login securely and upload my KYC documents",
      acceptanceCriteria: [
        "User can login with valid credentials",
        "User sees error for invalid credentials",
        "User can upload PDF and image files",
        "Uploaded files appear in the document list"
      ]
    };
  }

  async generateTestCases(jiraTicket: JiraTicket): Promise<TestCase[]> {
    const prompt = `
      Generate Playwright test cases from this Jira ticket:
      
      Ticket: ${jiraTicket.key}
      Summary: ${jiraTicket.summary}
      Description: ${jiraTicket.description}
      Acceptance Criteria: ${jiraTicket.acceptanceCriteria.join(', ')}
      
      Generate 3-5 test cases with:
      1. Test case name
      2. Step-by-step actions
      3. Assertions to validate
      4. Required test data
      
      Return as JSON array.
    `;

    const completion = await this.openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content || '{"tests": []}');
    return result.tests || [];
  }

  async generateTestCode(testCase: TestCase): Promise<string> {
    const prompt = `
      Convert this test case into executable Playwright TypeScript code:
      
      Test: ${testCase.name}
      Steps: ${testCase.steps.join('\n')}
      Assertions: ${testCase.assertions.join('\n')}
      Test Data: ${JSON.stringify(testCase.testData)}
      
      Use Page Object Model pattern.
      Include proper error handling and logging.
    `;

    const completion = await this.openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    return completion.choices[0].message.content || '// Code generation failed';
  }
}