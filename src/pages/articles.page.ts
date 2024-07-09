import { MainMenuComponents } from '../components/main-menu.components';
import { BasePage } from './base.page';
import { Page } from '@playwright/test';

export class ArticlesPage extends BasePage {
  url = '/articles.html';
  mainMenu = new MainMenuComponents(this.page);

  constructor(page: Page) {
    super(page);
  }
}
