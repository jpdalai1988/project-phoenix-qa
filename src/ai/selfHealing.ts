import { Page, Locator } from '@playwright/test';
import OpenAI from 'openai';

interface SelectorCandidate {
  selector: string;
  confidence: number;
  reason: string;
}

export class SelfHealingAI {
  private openai: OpenAI;
  private page: Page;
  private healingHistory: Map<string, string> = new Map();

  constructor(page: Page, apiKey: string) {
    this.page = page;
    this.openai = new OpenAI({ apiKey });
  }

  async healSelector(originalSelector: string, elementDescription: string): Promise<string> {
    // Check cache first
    if (this.healingHistory.has(originalSelector)) {
      console.log(`Using cached healed selector: ${this.healingHistory.get(originalSelector)}`);
      return this.healingHistory.get(originalSelector)!;
    }

    try {
      // Get page HTML context
      const pageHTML = await this.page.content();
      const pageTitle = await this.page.title();

      // Use AI to find alternative selector
      const prompt = `
        Find an alternative CSS selector for element: "${elementDescription}"
        Original selector that broke: "${originalSelector}"
        Page Title: "${pageTitle}"
        
        Page HTML snippet (first 3000 chars):
        ${pageHTML.substring(0, 3000)}
        
        Provide alternative selector with confidence score.
        Return JSON format: {"selector": "css_selector", "confidence": 0.95, "reason": "explanation"}
      `;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');
      
      if (result.selector && result.confidence > 0.7) {
        // Validate the selector
        const isValid = await this.validateSelector(result.selector);
        if (isValid) {
          this.healingHistory.set(originalSelector, result.selector);
          console.log(`AI healed selector: ${originalSelector} -> ${result.selector} (confidence: ${result.confidence})`);
          return result.selector;
        }
      }
      
      return originalSelector;
    } catch (error) {
      console.error('AI healing failed:', error);
      return originalSelector;
    }
  }

  private async validateSelector(selector: string): Promise<boolean> {
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ timeout: 3000 });
      return await element.isVisible();
    } catch {
      return false;
    }
  }

  async createResilientLocator(elementDescription: string, fallbackSelectors: string[]): Promise<Locator> {
    for (const selector of fallbackSelectors) {
      try {
        const locator = this.page.locator(selector);
        await locator.waitFor({ timeout: 2000 });
        return locator;
      } catch (error) {
        console.log(`Selector ${selector} failed, trying next...`);
      }
    }

    // If all fail, use AI to find new selector
    const healedSelector = await this.healSelector(fallbackSelectors[0], elementDescription);
    return this.page.locator(healedSelector);
  }
}