import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { LoginPage } from '../page-objects/login-page';
import { DashboardPage } from '../page-objects/dashboard-page';
import { AuthService } from '../services/auth-service';
import { expect } from 'chai';

// Common UI Steps
Given('I am logged in as a regular user',  { timeout: 60 * 1000 }, async function(this: CustomWorld) {
  // Get user credentials from environment config
  this.currentUser = this.environment.credentials.user;
  
  // Get a browser page
  const page = await this.getPage();
  
  // Use the login page to log in
  const loginPage = new LoginPage(this);
  await loginPage.navigate();
  await loginPage.login(this.currentUser.username, this.currentUser.password);
  
  // Verify we're on the dashboard
  const dashboardPage = new DashboardPage(this);
  const isLoggedIn = await dashboardPage.isLoggedIn();
  if (!isLoggedIn) {
    throw new Error('Failed to log in as regular user');
  }
});
 

When('I navigate to the {string} page', async function(this: CustomWorld, pageName: string) {
  const dashboardPage = new DashboardPage(this);
  await dashboardPage.navigateToMenuItem(pageName);
});

Then('I should see {string} in the page title', async function(this: CustomWorld, titleText: string) {
  await this.page!.waitForLoadState('networkidle');
  const pageTitle = await this.page!.title();
  expect(pageTitle).to.include(titleText);
});

// Common API Steps
Given('I have a valid authentication token', async function(this: CustomWorld) {
  const authService = new AuthService(this);
  const credentials = this.environment.credentials.user;
  
  // Log in and get token
  const response = await authService.login(credentials.username, credentials.password);
  

});