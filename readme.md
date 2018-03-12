API PLANING

e.g. GET /v1/restaurants/{restaurantId}/menus/{menuId}/items/{itemId} would fetch a single item.

- Transformer
- Logger
- Inject DbClient

Restaurants
ok - Create - POST /restaurants 
- Read GET /restaurants/x
- Update PUT /restaurants/x
- Delete DELETE /restaurans/x
- List GET /restaurants/

Menus
- Create POST /restaurant/x/menus
- Read GET /restaurant/x/menus/y
- Update PUT /restaurant/x/menus/y
- Delete DELETE /restaurant/x/menus/y
- List GET /restaurant/x/menus/

Menu Items
- Create POST /restaurant/x/menus/items
- Read GET /restaurant/x/menus/items/z
- Update PUT /restaurant/x/menus/items/z
- Delete DELETE /restaurant/x/menus/items/z
- List GET /restaurant/x/menus/items