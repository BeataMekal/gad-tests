import { MainMenuComponents } from '../components/main-menu.components';
import { BasePage } from './base.page';
import { Page } from '@playwright/test';

export class CommentsPage extends BasePage {
  url = '/comments.html';
  mainMenu = new MainMenuComponents(this.page);

  constructor(page: Page) {
    super(page);
  }
}
