import { Page, Locator, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

export class UploadPage {
  readonly page: Page;
  readonly fileInput: Locator;
  readonly uploadButton: Locator;
  readonly uploadedFiles: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    // Use getByRole for more reliable selectors
    this.fileInput = page.locator('#file-upload');  // Direct ID selector
    this.uploadButton = page.getByRole('button', { name: 'Upload' });
    this.uploadedFiles = page.locator('#uploaded-files');
    this.successMessage = page.locator('h3');
  }

  async goto() {
    await this.page.goto('/upload');
  }

  private getFilePath(fileName: string): string {
    const projectRoot = process.cwd();
    const filePath = path.join(projectRoot, 'src', 'test-data', fileName);
    
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, `Sample file: ${fileName}`);
    }
    
    return filePath;
  }

  async uploadFile(fileName: string) {
    const filePath = this.getFilePath(fileName);
    
    // Method 1: Using file input
    await this.fileInput.waitFor({ state: 'attached' });
    await this.fileInput.setInputFiles(filePath);
    
    // Method 2: Using keyboard interaction (more realistic)
    // await this.page.keyboard.press('Tab');
    // await this.page.keyboard.press('Enter');
    
    await this.uploadButton.click();
    await this.page.waitForTimeout(1000); // Wait for upload to complete
  }

  async getUploadedFileName(): Promise<string> {
    await this.uploadedFiles.waitFor({ state: 'visible' });
    return (await this.uploadedFiles.textContent()) || '';
  }

  async isUploadSuccessful(): Promise<boolean> {
    const message = await this.successMessage.textContent();
    return message?.includes('File Uploaded!') || false;
  }
}