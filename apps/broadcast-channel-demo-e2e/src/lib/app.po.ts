import {Locator, Page} from '@playwright/test';

export class AppPage {
  readonly messageInput: Locator;
  readonly submitButton: Locator;

  constructor(readonly page: Page) {
    this.messageInput = page.locator('#message-input');
    this.submitButton = page.locator('#submit-button');
  }

  async postMessage(message: string) {
    await this.writeMessage(message);
    await this.submitMessage();
  }

  async getAllMessages() {
    return await this.page.$$("#messages p");
  }

  async getEmittedMessages() {
    return await this.page.$$("#messages .from-left > p");
  }

  async getReceivedMessages() {
    return await this.page.$$("#messages .from-right > p");
  }

  private async writeMessage(message: string) {
    await this.messageInput.type(message);
  }

  private async submitMessage() {
    await this.submitButton.click();
  }
}
