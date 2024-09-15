import { prepareRandomUser } from '@_src/factories/user.factory';
import { RegisterUserModel } from '@_src/models/user.model';
import { RegisterPage } from '@_src/pages/register.page';
import { expect, test } from '@playwright/test';

test.describe('Verify register', () => {
  let registerPage: RegisterPage;
  let registerUserData: RegisterUserModel;
  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    registerUserData = prepareRandomUser();
    await registerPage.goto();
  });
  test(
    'register with correct data and login',
    { tag: '@GAD-R03-01 @GAD-R03-02 @GAD-R03-03' },
    async ({}) => {
      //Arrange
      const expectedAlertPopupText = 'User created';
      const expectedLoginTitle = 'Login';
      const expectedWelcomeTitle = 'Welcome';
      //Act
      const loginPage = await registerPage.register(registerUserData);

      //Assert
      await expect(registerPage.alertPopup).toHaveText(expectedAlertPopupText);

      await loginPage.waitForPageToLoadUrl();
      const titleLogin = await loginPage.getTitle();
      expect.soft(titleLogin).toContain(expectedLoginTitle);

      //Assert
      const welcomePage = await loginPage.login({
        userEmail: registerUserData.userEmail,
        userPassword: registerUserData.userPassword,
      });

      const titleWelcome = await welcomePage.getTitle();
      expect.soft(titleWelcome).toContain(expectedWelcomeTitle);
    },
  );
  test(
    'not register with incorrect data - non valid email',
    { tag: '@GAD-R03-04' },
    async () => {
      //Arrange
      const expectedErrorText = 'Please provide a valid email address';
      registerUserData.userEmail = '@#$';

      //Act
      await registerPage.register(registerUserData);

      //Assert
      await expect(registerPage.emailErrorText).toHaveText(expectedErrorText);
    },
  );
  test(
    'not register with incorrect data - email not provided',
    { tag: '@GAD-R03-04' },
    async () => {
      //Arrange
      const expectedErrorText = 'This field is required';

      //Act
      await registerPage.userFirstNameInput.fill(
        registerUserData.userFirstName,
      );
      await registerPage.userLastNameInput.fill(registerUserData.userLastName);
      await registerPage.userPasswordInput.fill(registerUserData.userPassword);
      await registerPage.registerButton.click();

      //Assert
      await expect(registerPage.emailErrorText).toHaveText(expectedErrorText);
    },
  );
});
