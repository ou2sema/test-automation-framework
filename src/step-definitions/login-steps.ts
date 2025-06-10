import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { LoginPage } from '../page-objects/login-page';
import { DashboardPage } from '../page-objects/dashboard-page';
import { AuthService } from '../services/auth-service';
import { expect } from 'chai';

// UI Steps
Given('I am on the login page', async function(this: CustomWorld) {
  const loginPage = new LoginPage(this);
  await loginPage.navigate();
});

When('I enter valid username and password', async function(this: CustomWorld) {
  const loginPage = new LoginPage(this);
  this.currentUser = this.environment.credentials.user;
  await loginPage.typeText( 
    '#username, [name="username"], input[type="email"]', 
    this.currentUser.username
  );
  await loginPage.typeText(
    '#password, [name="password"], input[type="password"]', 
    this.currentUser.password
  );
});

When('I enter invalid username and password', async function(this: CustomWorld) {
  const loginPage = new LoginPage(this);
   this.currentUser = this.environment.credentials.wrong_user;
  await loginPage.typeText( 
    '#username, [name="username"], input[type="email"]', 
    this.currentUser.username
  );
  await loginPage.typeText(
    '#password, [name="password"], input[type="password"]', 
    this.currentUser.password
  );
});

When('I click the login button', async function(this: CustomWorld) {
  const loginPage = new LoginPage(this);
  await loginPage.click('button[data-qa="login-button"]');
});

Then('I should be redirected to the dashboard', async function(this: CustomWorld) {
  const dashboardPage = new DashboardPage(this);
  // Wait for the dashboard page to load
  await this.page!.waitForURL('', {
    timeout: this.environment.timeouts.pageLoad
  });
  //const currentUrl = this.page!.url();
 // expect(currentUrl).to.include('automationexercise');
});

Then('I should see a welcome message', async function(this: CustomWorld) {
  const dashboardPage = new DashboardPage(this);
  const isLoggedIn = await dashboardPage.isLoggedIn();
  expect(isLoggedIn).to.be.true;
  
  const welcomeMessage = await dashboardPage.getWelcomeMessage();
  expect(welcomeMessage).to.not.be.empty;
});

Then('I should see an error message', async function(this: CustomWorld) {
  const loginPage = new LoginPage(this);
  const isErrorDisplayed = await loginPage.isErrorMessageDisplayed();
  expect(isErrorDisplayed).to.be.true;
  
  const errorMessage = await loginPage.getErrorMessage();
  expect(errorMessage).to.include('incorrect');
});

Then('I should remain on the login page', async function(this: CustomWorld) {
  const currentUrl = this.page!.url();
  expect(currentUrl).to.include('/login');
});

// API Steps
When('I send a login request with valid credentials', async function(this: CustomWorld) {
  const authService = new AuthService(this);
  try {
    const credentials = this.environment.credentials.user;
    //this.apiResponse = await authService.login(credentials.username, credentials.password);
  } catch (error: any) {
    //this.apiError = error;
  } 
});

When('I send a login request with invalid credentials', async function(this: CustomWorld) {
  const authService = new AuthService(this);
  try {
   // this.apiResponse = await authService.login('invalid@example.com', 'wrongpassword');
  } catch (error: any) {
    //this.apiError = error;
  }
});

Then('I should receive a successful response with auth token', function(this: CustomWorld) {
  //expect(this.apiResponse).to.not.be.undefined;
  //expect(this.apiResponse.token).to.be.a('string');
  //expect(this.apiResponse.token.length).to.be.greaterThan(10);
});

Then('the token should be valid for authentication', async function(this: CustomWorld) {
  const authService = new AuthService(this);
 // authService.setAuthToken(this.apiResponse.token);
  
  try {
    const userInfo = await authService.getCurrentUser();
    expect(userInfo).to.not.be.undefined;
    //expect(userInfo.id).to.equal(this.apiResponse.user.id);
  } catch (error) {
  //  expect.fail('Token should be valid for authentication');
  }
});

Then('I should receive an error response', function(this: CustomWorld) {
 // expect(this.apiError).to.not.be.undefined;
});

Then('the response should indicate authentication failure', function(this: CustomWorld) {
  //expect(this.apiError.response.status).to.be.oneOf([401, 403]);
 // expect(this.apiError.response.data).to.have.property('message');
  //expect(this.apiError.response.data.message).to.include('Invalid');
});