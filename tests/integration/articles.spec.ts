import { RESPONSE_TIMEOUT } from '@_pw-config';
import { prepareRandomArticle } from '@_src/factories/article.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { waitForResponse } from '@_src/utils/wait.util';

test.describe('Verify articles', () => {
  test(
    'user can access single article',
    { tag: '@GAD-R04-03 @GAD-R07-03 @logged' },
    async ({ addArticleView, articlesPage, page }) => {
      //Arrange
      const articleData = prepareRandomArticle();
      const expectedResponseCode = 201;

      const articlePage = await addArticleView.createArticle(articleData);
      await articlesPage.goto();
      const responsePromise = waitForResponse(page, '/api/articles');

      //Act
      await page.getByText(articleData.title).click();
      const response = await responsePromise;

      //Assert
      await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
      await expect
        .soft(articlePage.articleBody)
        .toHaveText(articleData.body, { useInnerText: true });
      expect(response.status()).toBe(expectedResponseCode);
    },
  );
  test(
    'create new article',
    { tag: '@GAD-R04-01 @GAD-R07-03 @logged' },
    async ({ addArticleView, page }) => {
      //Arrange
      const articleData = prepareRandomArticle();
      const expectedResponseCode = 201;

      const responsePromise = waitForResponse(page, '/api/articles');

      //Act
      const articlePage = await addArticleView.createArticle(articleData);
      const response = await responsePromise;

      //Assert
      await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
      await expect
        .soft(articlePage.articleBody)
        .toHaveText(articleData.body, { useInnerText: true });
      expect(response.status()).toBe(expectedResponseCode);
    },
  );
  test(
    'reject creating article without title',
    { tag: '@GAD-R04-01 @GAD-R07-03 @logged' },
    async ({ addArticleView, page }) => {
      //Arrange
      const expectedErrorText = 'Article was not created';
      const expectedResponseCode = 422;

      const articleData = prepareRandomArticle();
      articleData.title = '';

      const responsePromise = waitForResponse(page, '/api/articles');

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
    { tag: '@GAD-R04-01 @GAD-R07-03 @logged' },
    async ({ addArticleView, page }) => {
      //Arrange
      const expectedErrorText = 'Article was not created';
      const expectedResponseCode = 422;

      const articleData = prepareRandomArticle();
      articleData.body = '';

      const responsePromise = waitForResponse(page, '/api/articles');

      //Act
      await addArticleView.createArticle(articleData);
      const response = await responsePromise;

      //Assert
      await expect(addArticleView.alertPopup).toHaveText(expectedErrorText);
      expect(response.status()).toBe(expectedResponseCode);
    },
  );
  test.describe('Title length', () => {
    test(
      'reject creating article with title exceeding 128 signs',
      { tag: '@GAD-R04-02 @GAD-R07-03 @logged' },
      async ({ addArticleView, page }) => {
        //Arrange
        const expectedErrorText = 'Article was not created';
        const articleData = prepareRandomArticle(129);
        const expectedResponseCode = 422;

        const responsePromise = waitForResponse(page, '/api/articles');

        //Act
        await addArticleView.createArticle(articleData);
        const response = await responsePromise;

        //Assert
        await expect(addArticleView.alertPopup).toHaveText(expectedErrorText);
        expect(response.status()).toBe(expectedResponseCode);
      },
    );
    test(
      'create article with title with 128 signs',
      { tag: '@GAD-R04-02 @GAD-R07-03 @logged' },
      async ({ addArticleView, page }) => {
        //Arrange
        const articleData = prepareRandomArticle(128);
        const expectedResponseCode = 201;

        const responsePromise = waitForResponse(page, '/api/articles');

        //Act
        const articlePage = await addArticleView.createArticle(articleData);
        const response = await responsePromise;

        //Assert
        await expect
          .soft(articlePage.articleTitle)
          .toHaveText(articleData.title);
        expect(response.status()).toBe(expectedResponseCode);
      },
    );
  });
  test(
    'should return created article from API',
    { tag: '@GAD-R07-04 @logged' },
    async ({ addArticleView, page }) => {
      //Arrange
      const articleData = prepareRandomArticle(128);

      const responsePromise = page.waitForResponse(
        (response) => {
          // eslint-disable-next-line no-console
          console.log(
            response.url(),
            response.status(),
            response.request().method(),
          );
          return (
            response.url().includes('/api/articles') &&
            response.request().method() == 'GET'
          );
        },
        { timeout: RESPONSE_TIMEOUT },
      );

      //Act
      const articlePage = await addArticleView.createArticle(articleData);
      const response = await responsePromise;

      //Assert
      await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
      expect(response.ok()).toBeTruthy();
    },
  );
});
