@restaurant
Feature: Create Restaurant

Background:
  Given I request to create a "restaurant" with:
    | attribute | type | value |
    | name | string | Sebosao |
  And I save "restaurantId" as "rest" from the attribute "data" of the response

# Happy scenarios

Scenario: Creating a restaurant is fine
  When I request to create a "restaurant" with:
    | attribute | type | value |
    | name | string | First Restaurant |
  Then the request was successful and an item was created
  And the response exists the parameters "restaurantId,name" in the attribute "data"

Scenario: Restaurants' names are required
  When I request to create a "restaurant"
  Then the request failed because it was invalid

Scenario: Reading restaurant
  When I request a "restaurant" "{rest}"
  Then the request is successful
  And the response parameter "name" in the attribute "data" is "Sebosao"

Scenario: Updating restaurant
  When I request to modify the "restaurant" "{rest}" with:
  | attribute | type | value |
  | name | string | updated |
  Then the request is successful
  And the response exists the parameters "restaurantId,name" in the attribute "data"
  And the response parameter "restaurantId" in the attribute "data" is "{rest}"

Scenario: Deleting a restaurant works
  Given I request to delete the "restaurant" "{rest}"
  Then the request is successful
@wip
Scenario: List of restaurants
  When I request a list of "restaurants"
  Then the request is successful
  And the response exists the parameters "data,pagination"
  And the response attribute "data" is a list of 50 items
  And the response exists the parameter "cursor" in the attribute "pagination"




