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

## Widows - Public folder:

### Login:

![alt text](Public/src/images/ReadmeImages/Signin.png "SignIn Page")

### Manager:

1. Products
2. Installations
3. Customers
4. Economic
5. Archive

### Installers:

### Customers:

##

##

##

##

##

##
