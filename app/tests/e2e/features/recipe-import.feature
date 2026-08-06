Feature: Recipe import
  As a home cook
  I want to import a recipe from text or a photo
  So that I can save it in my private library

  Scenario: Switch between import modes
    Given I am on the recipe import page
    When I choose the "Texte libre" import mode
    Then I should see the text recipe form
    When I choose the "URL" import mode
    Then I should see the URL recipe form

  Scenario: Reject a non-image upload
    Given I am on the recipe import page
    When I upload a non-image file
    Then I should see an image format error

  Scenario: Show the review empty state without an extraction
    Given I am on the recipe review page without a draft
    Then I should see that there is no extraction to review
