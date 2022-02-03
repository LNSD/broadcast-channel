import * as faker from 'faker';
import {expect, Page, test} from '@playwright/test';
import {AppPage} from './lib/app.po';


test.describe('broadcast-channel-demo', () => {
  let page1: Page;
  let page2: Page;


  test.beforeEach(async ({context}) => {
    page1 = await context.newPage();
    page2 = await context.newPage();
    await page1.goto('http://localhost:4200/');
    await page2.goto('http://localhost:4200/');
  });

  test.afterEach(async ({context}) => {
    await context.close();
  });

  test('tab #1 should emit one message', async () => {
    /* Given */
    const app = new AppPage(page1);

    /* When */
    const message = faker.random.words(8);
    await app.postMessage(message);

    /* Then */
    const all = await app.getAllMessages();
    const emitted = await app.getEmittedMessages();
    const received = await app.getReceivedMessages();

    expect(all).toHaveLength(1);
    expect(emitted).toHaveLength(1);
    expect(received).toHaveLength(0);
  });

  test('tab #2 should receive one message', async () => {
    /* Given */
    const app1 = new AppPage(page1);
    const app2 = new AppPage(page2);

    /* When */
    const message = faker.random.words(8);
    await app1.postMessage(message);

    /* Then */
    const all = await app2.getAllMessages();
    const emitted = await app2.getEmittedMessages();
    const received = await app2.getReceivedMessages();

    expect(all).toHaveLength(1);
    expect(emitted).toHaveLength(0);
    expect(received).toHaveLength(1);
  });
});
