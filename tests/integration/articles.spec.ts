import { prepareRandomArticle } from '@_src/factories/article.factory';
import { ArticlesPage } from '@_src/pages/articles.page';
import { AddArticleView } from '@_src/views/add-article.view';
import { expect, test } from '@playwright/test';

test.describe('Verify articles', () => {
  let articlesPage: ArticlesPage;
  let addArticleView: AddArticleView;

  test.beforeEach(async ({ page }) => {
    articlesPage = new ArticlesPage(page);

    await articlesPage.goto();
    addArticleView = await articlesPage.clickAddArticleButtonLogged();

    await expect.soft(addArticleView.addNewHeader).toBeVisible();
  });
  test(
    'user can access single article',
    { tag: '@GAD-R04-03 @logged' },
    async ({ page }) => {
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
  test('create new article', { tag: '@GAD-R04-01 @logged' }, async () => {
    //Arrange
    const articleData = prepareRandomArticle();

    //Act
    const articlePage = await addArticleView.createArticle(articleData);
    //Assert
    await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
    await expect
      .soft(articlePage.articleBody)
      .toHaveText(articleData.body, { useInnerText: true });
  });
  test(
    'reject creating article without title',
    { tag: '@GAD-R04-01 @logged' },
    async () => {
      //Arrange
      const expectedErrorText = 'Article was not created';

      const articleData = prepareRandomArticle();
      articleData.title = '';

      //Act
      await addArticleView.createArticle(articleData);

      //Assert
      await expect(addArticleView.alertPopup).toHaveText(expectedErrorText);
    },
  );
  test(
    'reject creating article without body',
    { tag: '@GAD-R04-01 @logged' },
    async () => {
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
      async () => {
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
      'create article with title  with 128 signs',
      { tag: '@GAD-R04-02 @logged' },
      async () => {
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
