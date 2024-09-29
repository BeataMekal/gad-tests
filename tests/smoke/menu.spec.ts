import { ArticlesPage } from '@_src/pages/articles.page';
import { CommentsPage } from '@_src/pages/comments.page';
import { test as baseTest, expect } from '@playwright/test';

interface Pages {
  articlesPage: ArticlesPage;
  commentsPage: CommentsPage;
}
const test = baseTest.extend<Pages>({
  articlesPage: async ({ page }, use) => {
    const articlesPage = new ArticlesPage(page);
    await articlesPage.goto();
    await use(articlesPage);
  },
  commentsPage: async ({ page }, use) => {
    const commentsPage = new CommentsPage(page);
    await commentsPage.goto();
    await use(commentsPage);
  },
});

test.describe('Verify menu main buttons', () => {
  test(
    'comments button navigates to comments page',
    { tag: '@GAD-R01-03' },
    async ({ articlesPage }) => {
      //Arrange
      const expectedCommentsTitle = 'Comments';

      //Act
      const commentsPage = await articlesPage.mainMenu.ClickCommentsButton();
      const title = await commentsPage.getTitle();

      //Assert
      expect(title).toContain(expectedCommentsTitle);
    },
  );
  test(
    'articles button navigates to articles page',
    { tag: '@GAD-R01-03' },
    async ({ commentsPage }) => {
      //Arrange
      const expectedArticlesTitle = 'Articles';

      //Act
      const articlesPage = await commentsPage.mainMenu.ClickArticlesButton();
      const title = await articlesPage.getTitle();

      //Assert
      expect(title).toContain(expectedArticlesTitle);
    },
  );
  test(
    'home button navigates to home page',
    { tag: '@GAD-R01-03' },
    async ({ articlesPage }) => {
      //Arrange
      const expectedGADTitle = 'GAD';

      //Act
      const homePage = await articlesPage.mainMenu.ClickHomePageLink();
      const title = await homePage.getTitle();

      //Assert
      expect(title).toContain(expectedGADTitle);
    },
  );
});
