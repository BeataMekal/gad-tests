import { expect, test } from '@_src/fixtures/merge.fixture';

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
