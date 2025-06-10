Feature: User Login
  As a user of the application
  I want to be able to login
  So that I can access my account

  @ui
  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I enter valid username and password
    And I click the login button
    Then I should be redirected to the dashboard
    And I should see a welcome message

  @ui
  Scenario: Failed login with invalid credentials
    Given I am on the login page
    When I enter invalid username and password
    And I click the login button
    Then I should see an error message
    And I should remain on the login page

  @api
  Scenario: Successful API login
    When I send a login request with valid credentials
    Then I should receive a successful response with auth token
    And the token should be valid for authentication

  @api
  Scenario: Failed API login
    When I send a login request with invalid credentials
    Then I should receive an error response
    And the response should indicate authentication failure