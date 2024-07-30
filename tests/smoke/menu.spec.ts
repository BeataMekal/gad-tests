import { ArticlesPage } from '../../src/pages/articles.page';
import { CommentsPage } from '../../src/pages/comments.page';
import { HomePage } from '../../src/pages/home.page';
import { expect, test } from '@playwright/test';

test.describe('Verify menu main buttons', () => {
  test(
    'comments button navigates to comments page',
    { tag: '@GAD-R01-03' },
    async ({ page }) => {
      //Arrange
      const articlesPage = new ArticlesPage(page);
      const expectedCommentsTitle = 'Comments';

      //Act
      await articlesPage.goto();
      await articlesPage.mainMenu.commentsButton.click();
      const commentsPage = new CommentsPage(page);
      const title = await commentsPage.getTitle();

      //Assert
      expect(title).toContain(expectedCommentsTitle);
    },
  );
  test(
    'articles button navigates to articles page',
    { tag: '@GAD-R01-03' },
    async ({ page }) => {
      //Arrange
      const articlesPage = new ArticlesPage(page);
      const commentsPage = new CommentsPage(page);
      const expectedArticlesTitle = 'Articles';

      //Act
      await commentsPage.goto();
      await commentsPage.mainMenu.articlesButton.click();
      const title = await articlesPage.getTitle();

      //Assert
      expect(title).toContain(expectedArticlesTitle);
    },
  );
  test(
    'home button navigates to home page',
    { tag: '@GAD-R01-03' },
    async ({ page }) => {
      //Arrange
      const articlesPage = new ArticlesPage(page);
      const expectedGADTitle = 'GAD';

      //Act
      await articlesPage.goto();
      await articlesPage.mainMenu.homePage.click();
      const homePage = new HomePage(page);
      const title = await homePage.getTitle();

      //Assert
      expect(title).toContain(expectedGADTitle);
    },
  );
});
