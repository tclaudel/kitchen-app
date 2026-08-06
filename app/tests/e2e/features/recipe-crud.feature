Feature: Recipe CRUD
  As a home cook
  I want to manage recipes in my private library
  So that my recipes stay accurate and useful

  Scenario: Create, read, update, and delete a recipe
    Given I have opened the recipe review form with an extracted draft
    When I save the recipe
    Then I should see the saved recipe details
    When I update the recipe title and ingredients
    Then I should see the updated recipe details
    And the recipe history should contain the previous version
    When I confirm deleting the recipe
    Then I should return to the recipe library
    And I should not see the deleted recipe
