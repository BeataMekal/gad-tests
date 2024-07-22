import { RegisterUser } from '../src/models/user.models';
import { LoginPage } from '../src/pages/login.page';
import { RegisterPage } from '../src/pages/register.page';
import { WelcomePage } from '../src/pages/welcome.page';
import { faker } from '@faker-js/faker/locale/en';
import { expect, test } from '@playwright/test';

test.describe('Verify login', () => {
  test(
    'register with correct data and login',
    { tag: '@GAD-R03-01 @GAD-R03-02 @GAD-R03-03' },
    async ({ page }) => {
      //Arrange

      const registerUserData: RegisterUser = {
        userFirstName: faker.person.firstName().replace(/[^A-Za-z]/g, ''), //g- takes into account all occurrences
        userLastName: faker.person.lastName().replace(/[^A-Za-z]/g, ''),
        userEmail: '',
        userPassword: faker.internet.password(),
      };

      registerUserData.userEmail = faker.internet.email({
        firstName: registerUserData.userFirstName,
        lastName: registerUserData.userLastName,
      });

      const registerPage = new RegisterPage(page);
      //Act
      await registerPage.goto();
      await registerPage.register(registerUserData);
      const expectedAlertPopupText = 'User created';

      //Assert
      await expect(registerPage.alertPopup).toHaveText(expectedAlertPopupText);
      const loginPage = new LoginPage(page);
      await loginPage.waitForPageToLoadUrl();
      const titleLogin = await loginPage.title();
      expect.soft(titleLogin).toContain('Login');

      //Assert
      await loginPage.goto();
      await loginPage.login({
        userEmail: registerUserData.userEmail,
        userPassword: registerUserData.userPassword,
      });

      const welcomePage = new WelcomePage(page);
      const titleWelcome = await welcomePage.title();
      expect.soft(titleWelcome).toContain('Welcome');
    },
  );
  test(
    'not register with incorrect data - non valid email',
    { tag: '@GAD-R03-04' },
    async ({ page }) => {
      //Arrange

      const registerUserData: RegisterUser = {
        userFirstName: faker.person.firstName().replace(/[^A-Za-z]/g, ''), //g- takes into account all occurrences
        userLastName: faker.person.lastName().replace(/[^A-Za-z]/g, ''),
        userEmail: '#$%',
        userPassword: faker.internet.password(),
      };

      const expectedErrorText = 'Please provide a valid email address';
      const registerPage = new RegisterPage(page);
      //Act
      await registerPage.goto();
      await registerPage.register(registerUserData);

      //Assert
      await expect(registerPage.emailErrorText).toHaveText(expectedErrorText);
    },
  );
  test(
    'not register with incorrect data - email not provided',
    { tag: '@GAD-R03-04' },
    async ({ page }) => {
      //Arrange
      const registerPage = new RegisterPage(page);
      const expectedErrorText = 'This field is required';

      //Act
      await registerPage.goto();
      await registerPage.userFirstNameInput.fill(
        faker.person.firstName().replace(/[^A-Za-z]/g, ''),
      );
      await registerPage.userLastNameInput.fill(
        faker.person.firstName().replace(/[^A-Za-z]/g, ''),
      );
      await registerPage.userPasswordInput.fill(faker.internet.password());
      await registerPage.registerButton.click();

      //Assert
      await expect(registerPage.emailErrorText).toHaveText(expectedErrorText);
    },
  );
});
