import { MainMenuComponents } from '@_src/components/main-menu.components';
import { BasePage } from '@_src/pages/base.page';
import { Page } from '@playwright/test';

export class ArticlesPage extends BasePage {
  url = '/articles.html';
  mainMenu = new MainMenuComponents(this.page);
  addArticleButtonLogged = this.page.locator('#add-new');

  constructor(page: Page) {
    super(page);
  }
  async gotoArticle(title: string): Promise<void> {
    await this.page.getByText(title).click();
  }
}
