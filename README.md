# Practicum - Trisi Sinai Ltd.

![alt text](http://url/to/img.jpg "Title")

## Running the website on a private server

#### For running the app:

```bash
npm run
```

#### For starting the app:

```bash
npm start
```

## Explanation of the main files and folders:

### The MongoDB.js file:

- This file contains functions that interact with a MongoDB database. It includes methods for connecting to the database, adding, retrieving, updating, and deleting data regarding users, customers, products, feedback, and installation meetings.
- The code is organized to support asynchronous operations and utilizes MongoDB's client and object ID utilities for database interactions.

#### Key operations:

| Category            | Function                 | Description                                         |
| ------------------- | ------------------------ | --------------------------------------------------- |
| Connection          | `run`                    | Connects to the database and checks the connection. |
| User Management     | `loginUser`              | Authenticates a user using username and password.   |
|                     | `getAllUsers`            | Retrieves all users.                                |
|                     | `deleteUserById`         | Deletes a user by ID.                               |
|                     | `addUser`                | Adds a new user.                                    |
| Customer Management | `getAllCustomers`        | Retrieves all customers.                            |
|                     | `countCustomers`         | Counts the number of customers.                     |
|                     | `checkCustomerExists`    | Checks if a customer exists by ID.                  |
|                     | `getCustomerByID`        | Fetches specific customer details.                  |
| Feedback Management | `getFeedback`            | Retrieves all feedback.                             |
|                     | `addFeedback`            | Adds feedback to the database.                      |
| Product Management  | `getAllProducts`         | Retrieves all products.                             |
|                     | `addNewProduct`          | Adds a new product.                                 |
|                     | `updateProduct`          | Updates a product by ID.                            |
|                     | `countProducts`          | Counts all products.                                |
| Meetings Management | `addInstallationMeeting` | Adds an installation meeting.                       |
|                     | `getAllMeetings`         | Retrieves all meetings and installations.           |
|                     | `addMeeting`             | Adds a new meeting.                                 |
|                     | `checkMeetingExists`     | Checks if a meeting exists.                         |
|                     | `deleteMeetingById`      | Deletes a meeting by ID.                            |

### The Server.js file:

- This file sets up a Node.js server using Express and integrates with the MongoDB.js for database operations.
- It defines endpoints for the web server that allow various operations such as logging in users, adding customers, managing products, submitting feedback, scheduling installation meetings, and more.
- The server uses middleware like express.json() for body parsing and nodemailer for sending emails, indicating features for communication with users through the application.

#### Key operations:

| Category                 | Endpoint                  | Description                                          |
| ------------------------ | ------------------------- | ---------------------------------------------------- |
| User & Customer Mgmt     | `/login`                  | Endpoint for user login.                             |
|                          | `/addCustomer`            | Adds customers.                                      |
|                          | `/checkCustomerExists`    | Checks if a customer exists.                         |
|                          | `/Users`                  | Retrieves all users.                                 |
|                          | `/add-user`               | Adds new users.                                      |
| Product & Feedback       | `/Products`               | Manages products.                                    |
|                          | `/addNewProduct`          | Adds new products.                                   |
|                          | `/updateProduct`          | Updates a product.                                   |
|                          | `/feedback`               | Manages feedback.                                    |
|                          | `/addFeedback`            | Adds feedback.                                       |
| Meetings & Installations | `/meetings`               | Manages meetings.                                    |
|                          | `/addMeeting`             | Adds a new meeting.                                  |
|                          | `/checkMeetingExists`     | Checks if a meeting exists.                          |
|                          | `/meeting/:id`            | Deletes a meeting by ID.                             |
|                          | `/installations`          | Manages installations.                               |
|                          | `/addInstallationMeeting` | Adds an installation meeting.                        |
| Additional Actions       | `/submitMessage`          | Sends messages through the interface.                |
|                          | `/dashboard-data`         | Displays dashboard data (customers, products, etc.). |


## Endpoints
### Tenders Management:
/Tenders (GET): Retrieves all tenders.
/addTender (POST): Adds a new tender.
/Tenders/:id (PUT): Updates a tender by ID.
/Tenders/:id (DELETE): Deletes a tender by ID.
To-Do List:

/api/todos (POST): Adds a new to-do item.
/api/todos (GET): Retrieves all to-do items.
/api/todos/:id (DELETE): Deletes a to-do item by ID.

Dashboard Data:

/dashboard-data/customers (GET): Retrieves the total number of customers.
/dashboard-data/products (GET): Retrieves the total number of products.
/dashboard-data/installers (GET): Retrieves the total number of installers.
/dashboard-data/Meetings (GET): Retrieves the total number of meetings.
/dashboard-data/collections (GET): Retrieves collection counts.
Feedback Management:

/feedback (GET): Retrieves all feedback.
/addFeedback (POST): Adds feedback to the database.

Installations:

/installations (GET): Retrieves all installations.
/addInstallationMeeting (POST): Adds an installation meeting.


Features
Tenders Management:

Manage tenders with endpoints for adding, retrieving, updating, and deleting tenders.
To-Do List:

Add, retrieve, and delete to-do items for task management.
Dashboard Data:

View key metrics such as the number of customers, products, installers, and meetings.
Feedback Management:

Retrieve and add customer feedback.
Installations:

Manage installation meetings and retrieve installation data.


Technologies
Nodemailer: Used for sending emails.
JWT (JSON Web Tokens): Used for authentication.

## Widows - Public folder:



### Login:

![alt text](Public/src/images/ReadmeImages/Signin.png "SignIn Page")

### Manager:
* Products
* Installations
Customers
Economic
Archive

Installers:
View Installations
Add Installations
Manage Installations

Customers:
View Products
Add Feedback
Schedule Meetings

##

##

##

## Technologies Used:
* <b>Backend</b>: Node.js, Express.js
* <b>Database</b>: MongoDB
* <b>Frontend</b>: HTML, CSS, JavaScript
* <b>Email Service</b>: Nodemailer
* <b>Authentication</b>: JWT (JSON Web Tokens)


## How to Contribute
- Clone the repository:
```bash
git clone https://github.com/eladtayar/Practicum.git
```
- Install dependencies:
```bash
npm install
```
- Start the server:
```bash
npm start
```
<b> Make your changes and submit a pull request. </b>



---
## Security

- **Authentication**: The system uses JSON Web Tokens (JWT) for secure authentication.
- **Data Protection**: Sensitive data such as passwords and tokens are securely stored and transmitted.
- **Environment Variables**: Ensure sensitive credentials (e.g., database URI, email credentials) are stored in environment variables and not hardcoded in the source code.
- **HTTPS**: It is recommended to deploy the application over HTTPS to ensure secure communication.

### License
This project is licensed under the MIT License.



##
