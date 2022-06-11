# Users
## `GET`  /api/users  

### Authorization :  
require *Authorization* header with valid token example:-  
`Authorization: 'Bearer ' + jwtToken`
### Description :
retrieve all users data
### Parameter: 
no parameters required
### Response
status: `200`  
body: `ShowUserDto[]`  
### Schema:
```typescript
type ShowUserDto = {
	id: number;
	userName: string;
	firstName: string;
	lastName?: string | undefined;
}
```


## `GET`  /api/users/:id

### Authorization :  
require *Authorization* header with valid token example:-  
`Authorization: 'Bearer ' + jwtToken`
### Description :
retrieve user data by id
### Parameter: 
require  id number in url as route parameter, example `/api/users/3`
### Response
- status: `200`  
  body: `ShowUserDto`  
- status: `404` Not Found in case invalid id parameter or item not exists any more
### Schema:
```typescript
type ShowUserDto = {
	id: number;
	userName: string;
	firstName: string;
	lastName?: string | undefined;
}
```

## `POST`  /api/users/register

### Authorization :  
no *Authorization* required
### Description :
create new user
### Parameter: 
require user data in the request body
### Request
#### headers:  
`Content-type: 'application/json'`  
#### body:  
##### body example
```json
{
	"userName":"myUserName",
	"firstName":"myFirstName",
	"lastName":"optional lastName",
	"password":"myPassword"
}
```
##### body validation schema rules
```javascript
{
  type: 'object',
  properties: {
    userName: { type: 'string', maxLength: 50, minLength: 3 },
    firstName: { type: 'string', maxLength: 50, minLength: 3 },
    lastName: { type: 'string', maxLength: 50, minLength: 3, nullable: true },
    password: { type: 'string', maxLength: 16, minLength: 6 },
  },
  required: ['userName', 'firstName', 'password'],
}
```
#### Response
- status: `200`  
  	body: `SuccessLoginResponse`  
- status: `400` BadRequest  
	body: validation errors
#### Schema:
```typescript
type SuccessLoginResponse = {
  id: number; // userId
  name: string; // firstName + lastName
  token: string; // jwtToken 
};
```

## `POST`  /api/users/login

### Authorization :  
no *Authorization* required
### Description :
login to get new token
### Parameter: 
require user credentials in the request body
### Request
#### headers:  
`Content-type: 'application/json'`  
#### body:  
##### body example
```json
{
	"userName":"myUserName",
	"password":"myPassword"
}
```
##### body validation schema rules
```javascript
{
  type: 'object',
  properties: {
    userName: { type: 'string', maxLength: 50, minLength: 3 },
    password: { type: 'string', maxLength: 16, minLength: 6 },
  },
  required: ['userName',  'password'],
}
```
#### Response
- status: `200`  
  	body: `SuccessLoginResponse`  
- status: `400` BadRequest  
	body: validation errors
#### Schema:
```typescript
type SuccessLoginResponse = {
  id: number; // userId
  name: string; // firstName + lastName
  token: string; // jwtToken 
};
```

---
---
---


# Products
### `GET`  /api/products  

#### Authorization :  
no *Authorization* required
#### Description :
retrieve all products data
#### Parameter: 
no parameters required
#### Response
status: `200`  
body: `Product[]`  
#### Schema:
```typescript
type Product = {
  id: number;
  name: string;
  price: number;
}
```


### `GET`  /api/products/:id

#### Authorization :  
no *Authorization* required
#### Description :
retrieve product data by id
#### Parameter: 
require  id number in url as route parameter, example `/api/products/5`
#### Response
- status: `200`  
  body: `Product`  
- status: `404` Not Found in case invalid id parameter or item not exists any more
#### Schema:
```typescript
type Product = {
  id: number;
  name: string;
  price: number;
}
```

## `POST`  /api/products

### Authorization :  
require *Authorization* header with valid token example:-  
`Authorization: 'Bearer ' + jwtToken`
### Description :
create new product
### Parameter: 
require product data in the request body
### Request
#### headers:  
`Content-type: 'application/json'`  
#### body:  
##### body example
```json
{
	"name":"product name",
	"price":"25.25"
}
```
##### body validation schema rules
```javascript
{
  type: 'object',
  properties: {
    name: { type: 'string', maxLength: 50 },
    price: { type: 'number', minimum: 0 },
  },
  required: ['name', 'price'],
}
```
#### Response
- status: `200`  
  	body: `Product` 
- status: `400` BadRequest  
	body: validation errors
#### Schema:
```typescript
type Product = {
  id: number;
  name: string;
  price: number;
}
```

## `PUT`  /api/products/:id

### Authorization :  
require *Authorization* header with valid token example:-  
`Authorization: 'Bearer ' + jwtToken`
### Description :
update existing product by id
### Parameter: 
- require  id number in url as route parameter, example `/api/products/5`
- require product data in the request body
### Request
#### headers:  
`Content-type: 'application/json'`  
#### body:  
##### body example
```json
{
	"name":"new name",
	"price":"53.35"
}
```
##### body validation schema rules
```javascript
{
  type: 'object',
  properties: {
    name: { type: 'string', maxLength: 50 },
    price: { type: 'number', minimum: 0 },
  },
  required: ['name', 'price'],
}
```
#### Response
- status: `200`  
  	body: no body content
- status: `400` BadRequest  
	body: validation errors
- status: `404` Not Found in case invalid id parameter or item not exists any more


## `DELETE`  /api/products/:id

### Authorization :  
require *Authorization* header with valid token example:-  
`Authorization: 'Bearer ' + jwtToken`
### Description :
delete product by id
### Parameter: 
require  id number in url as route parameter, example `/api/products/5`
#### Response
- status: `200`  
  	body: no body content
- status: `400` in case this product referenced by order
- status: `404` Not Found in case invalid id parameter or item not exists any more

---
---
---


# Orders
## `GET`  /api/orders  

### Authorization :  
require *Authorization* header with valid token example:-  
`Authorization: 'Bearer ' + jwtToken`
### Description :
retrieve all orders data
### Parameter: 
no parameters required
### Response
status: `200`  
body: `Order[]`  
### Schema:
```typescript
type Order = {
  id: number;
  userId: number;
  status: 'active' | 'complete';
}
```


### `GET`  /api/orders/:id

### Authorization :  
require *Authorization* header with valid token example:-  
`Authorization: 'Bearer ' + jwtToken`
### Description :
retrieve order data by id
### Parameter: 
require  id number in url as route parameter, example `/api/orders/5`
### Response
- status: `200`  
  body: `OrderDto`  
- status: `404` Not Found in case invalid id parameter or item not exists any more
### Schema:
```typescript
type OrderDto = {
  id: number;
  userId: number;
  status: 'active' | 'complete';
  products: OrderProductDto[];
}

type OrderProductDto = {
    productId: number;
    quantity: number;
}
```

## `POST`  /api/orders

### Authorization :  
require *Authorization* header with valid token example:-  
`Authorization: 'Bearer ' + jwtToken`
### Description :
create new order
### Parameter: 
require order data in the request body
> Note that userId will be taken from the token
### Request
#### headers:  
`Content-type: 'application/json'`  
#### body:  
> Note that userId will be taken from the token
##### body example
```json
{
      "status": "active",
      "products":[
		  { "productId":1, "quantity":5 },
		  { "productId":32, "quantity":1 },
		  { "productId":4, "quantity":12 }
	  ]
}
```
##### body validation schema rules
```javascript
{
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['active', 'complete'] },
    products: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          productId: { type: 'integer', minimum: 1 },
          quantity: { type: 'integer', minimum: 1 },
        },
        required: ['productId', 'quantity']
      },
    },
  },
  required: ['status', 'products']
}
```
### Response
- status: `200`  
  body: `OrderDto`  
- status: `400` BadRequest  
	body: validation errors or if any productId not exists
### Schema:
```typescript
type OrderDto = {
  id: number;
  userId: number;
  status: 'active' | 'complete';
  products: OrderProductDto[];
}

type OrderProductDto = {
    productId: number;
    quantity: number;
}
```

## `PUT`  /api/orders/:id

### Authorization :  
require *Authorization* header with valid token example:-  
`Authorization: 'Bearer ' + jwtToken`
### Description :
update existing order
> Note all previous products will be removed and new products will be added based on supplied data
### Parameter: 
require order data in the request body
> Note that userId will be taken from the token
> Note all previous products will be removed and new proders will be added based on supplied data
### Request
#### headers:  
`Content-type: 'application/json'`  
#### body:  
##### body example
```json
{
      "status": "complete",
      "products":[
		  { "productId":1, "quantity":5 },
		  { "productId":32, "quantity":1 },
		  { "productId":4, "quantity":12 }
	  ]
}
```
##### body validation schema rules
```javascript
{
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['active', 'complete'] },
    products: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          productId: { type: 'integer', minimum: 1 },
          quantity: { type: 'integer', minimum: 1 },
        },
        required: ['productId', 'quantity']
      },
    },
  },
  required: ['status', 'products']
}
```
### Response
- status: `200`  
  	body: no body content
- status: `400` BadRequest  
	body: validation errors validation errors or if any productId not exists
- status: `404` Not Found in case invalid id parameter or item not exists any more


## `DELETE`  /api/orders/:id

### Authorization :  
require *Authorization* header with valid token example:-  
`Authorization: 'Bearer ' + jwtToken`
### Description :
delete order by id
### Parameter: 
require  id number in url as route parameter, example `/api/orders/5`
### Response
- status: `200`  
  	body: no body content
- status: `404` Not Found in case invalid id parameters

