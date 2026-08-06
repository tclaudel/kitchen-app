Feature: Recipe library
  As a home cook
  I want to browse and search my recipes
  So that I can quickly find something to prepare

  Scenario: Open the recipe library from the home page
    Given I am on the home page
    When I choose "Voir mes recettes"
    Then I should see the recipe library heading

  Scenario: Search the recipe library
    Given I am on the recipe library page
    When I search for "unlikely-recipe-name"
    Then I should see that no recipe was found
