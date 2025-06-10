Feature: User Profile Management
  As a logged in user
  I want to manage my profile
  So that I can update my personal information

  Background:
    Given I am logged in as a regular user

  @ui
  Scenario: View user profile
    When I navigate to the profile page
    Then I should see my personal information
    And I should see options to update my profile
  @api
  Scenario: Retrieve user profile via API
    When I send a request to get my user profile
    Then I should receive a successful response
    And the response should contain my profile data

