import { MainMenuComponents } from '../components/main-menu.components';
import { BasePage } from './base.page';
import { Page } from '@playwright/test';

export class ArticlePage extends BasePage {
  url = '/article.html';
  mainMenu = new MainMenuComponents(this.page);
  articleTitle = this.page.getByTestId('article-title');
  articleBody = this.page.getByTestId('article-body');
  deleteIcon = this.page.getByTestId('delete');
  searchInput = this.page.getByTestId('search-input');
  goSearchButton = this.page.getByTestId('search-button');
  noResultText = this.page.getByTestId('no-results');

  constructor(page: Page) {
    super(page);
  }

  async deleteArticle(): Promise<void> {
    this.page.on('dialog', async (dialog) => {
      await dialog.accept();
    });
    this.deleteIcon.click();
  }

  async searchArticle(phrase: string): Promise<void> {
    await this.searchInput.fill(phrase);
    await this.goSearchButton.click();
  }
}
