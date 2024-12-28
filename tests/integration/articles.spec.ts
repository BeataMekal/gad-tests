import { RESPONSE_TIMEOUT } from '@_pw-config';
import { prepareRandomArticle } from '@_src/factories/article.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';

test.describe('Verify articles', () => {
  test(
    'user can access single article',
    { tag: '@GAD-R04-03 @logged' },
    async ({ addArticleView, articlesPage, page }) => {
      //Arrange
      const articleData = prepareRandomArticle();

      const articlePage = await addArticleView.createArticle(articleData);
      await articlesPage.goto();

      //Act
      await page.getByText(articleData.title).click();
      //Assert
      await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
      await expect
        .soft(articlePage.articleBody)
        .toHaveText(articleData.body, { useInnerText: true });
    },
  );
  test(
    'create new article',
    { tag: '@GAD-R04-01 @logged' },
    async ({ addArticleView }) => {
      //Arrange
      const articleData = prepareRandomArticle();

      //Act
      const articlePage = await addArticleView.createArticle(articleData);
      //Assert
      await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
      await expect
        .soft(articlePage.articleBody)
        .toHaveText(articleData.body, { useInnerText: true });
    },
  );
  test(
    'reject creating article without title',
    { tag: '@GAD-R04-01 @logged' },
    async ({ addArticleView, page }) => {
      //Arrange
      const expectedErrorText = 'Article was not created';
      const expectedResponseCode = 422;

      const articleData = prepareRandomArticle();
      articleData.title = '';

      const responsePromise = page.waitForResponse('/api/articles', {
        timeout: RESPONSE_TIMEOUT,
      });

      //Act
      await addArticleView.createArticle(articleData);
      const response = await responsePromise;

      //Assert
      await expect(addArticleView.alertPopup).toHaveText(expectedErrorText);
      expect(response.status()).toBe(expectedResponseCode);
    },
  );
  test(
    'reject creating article without body',
    { tag: '@GAD-R04-01 @logged' },
    async ({ addArticleView }) => {
      //Arrange
      const expectedErrorText = 'Article was not created';

      const articleData = prepareRandomArticle();
      articleData.body = '';

      //Act
      await addArticleView.createArticle(articleData);

      //Assert
      await expect(addArticleView.alertPopup).toHaveText(expectedErrorText);
    },
  );
  test.describe('Title length', () => {
    test(
      'reject creating article with title exceeding 128 signs',
      { tag: '@GAD-R04-02 @logged' },
      async ({ addArticleView }) => {
        //Arrange
        const expectedErrorText = 'Article was not created';
        const articleData = prepareRandomArticle(129);

        //Act
        await addArticleView.createArticle(articleData);

        //Assert
        await expect(addArticleView.alertPopup).toHaveText(expectedErrorText);
      },
    );
    test(
      'create article with title with 128 signs',
      { tag: '@GAD-R04-02 @logged' },
      async ({ addArticleView }) => {
        //Arrange
        const articleData = prepareRandomArticle(128);

        //Act
        const articlePage = await addArticleView.createArticle(articleData);
        //Assert
        await expect
          .soft(articlePage.articleTitle)
          .toHaveText(articleData.title);
      },
    );
  });
});
