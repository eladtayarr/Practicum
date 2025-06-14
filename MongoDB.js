const { MongoClient, ObjectId } = require("mongodb");

const uri =
  "mongodb+srv://eladt1010:9wRHk5BLfmqRrQb3@practicumproject.rimn0.mongodb.net/?retryWrites=true&w=majority&appName=PracticumProject";
// Password: 9wRHk5BLfmqRrQb3

const client = new MongoClient(uri, {
  serverApi: {
    version: "1",
  },
});

////////////////////////////////////////////////////////////////////////
//////////////////////        הרצה         /////////////////////////////

////    פונקציית הרצה לחיבור לבסיס נתונים
async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
run();

////////////////////////////////////////////////////////////////////////
//////////////////////        לקוחות       /////////////////////////////

////    התחברות למערכת
const loginUser = async (username, password) => {
  try {
    const database = client.db("Practicum_Project");
    const collection = database.collection("Users");
    const user = await collection.findOne({ UserName: username });
    if (user && user.Password === password) {
      return { message: "Login successful!", user };
    } else {
      throw new Error("Invalid username or password");
    }
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Failed to authenticate user");
  }
};

////    קבלת כל הלקוחות
const getAllCustomers = async () => {
  try {
    const database = client.db("Practicum_Project");
    const collection = database.collection("Customers");
    const Customers = await collection.find().toArray();
    console.log("Customers:", Customers);
    return Customers;
  } catch (error) {
    console.error("Error fetching Customers:", error);
    throw new Error("Failed to fetch Customers");
  }
};

const countCustomers = async () => {
  let client;
  try {
    client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    const database = client.db("Practicum_Project");
    const collection = database.collection("Customers");

    const count = await collection.countDocuments();
    console.log("Total customers:", count);
    return count;
  } catch (error) {
    console.error("Error counting customers:", error);
    throw new Error("Failed to count customers");
  } finally {
    if (client) {
      await client.close();
      console.log("Connection to MongoDB closed");
    }
  }
};

////    עדכון הלקוחות במערכת
function updateCustomers() {
    // Get updated values from the form
    const updatedData = {
        CustomerID: parseInt(document.getElementById("updateCustomerID").value), // Parse as integer
        CustomerName: document.getElementById("updateCustomerName").value,
        CustomerPhone: parseInt(document.getElementById("updateCustomerPhone").value), // Ensure it's an integer
        CustomerEmail: document.getElementById("updateCustomerEmail").value,
        CustomerJoinDate: document.getElementById("updateCustomerJoinDate").value,
        CustomerType: document.getElementById("updateCustomerType").value,
        CustomerUserName: document.getElementById("updateCustomerUserName").value // Add missing comma
    };

    // Send PUT request to update the customer
    const customerID = updatedData.CustomerID; // Use the correct ID
    console.log("Updating customer with ID:", customerID);
    console.log("Payload being sent:", updatedData);

    fetch(`/Customers/${customerID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
    })
        .then((response) => {
            console.log("Response status:", response.status);
            if (!response.ok) {
                return response.text().then((text) => {
                    throw new Error(text || "שגיאה בעדכון הלקוח");
                });
            }
            console.log("Customer updated successfully!");
            alert("הלקוח עודכן בהצלחה!");
            location.reload(); // Reload the page to fetch updated data
        })
        .catch((error) => {
            console.error("Error updating customer:", error.message);
            alert("שגיאה בעדכון הלקוח. אנא נסה שוב מאוחר יותר.");
        });
}

////    מחיקת משתמשים
async function deletecustomerById(customerID) {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const db = client.db("Practicum_Project");
    const customersCollection = db.collection("Customers");
    const customerObjectId = new ObjectId(customerID);
    const result = await customersCollection.deleteOne({ _id: customerObjectId });
    if (result.deletedCount === 1) {
      console.log("User deleted successfully");
    } else {
      console.log("User not found or deletion failed");
    }
    const Customers = await customersCollection.find().toArray();
    console.log("Customers:", Customers);
    return Customers;
  } catch (err) {
    console.error("Error deleting user:", err);
    throw err;
  } finally {
    await client.close();
  }
}


////    שליפת כל חוות הדעת
const getFeedback = async () => {
  let client; // Define the client variable

  try {
    // Connect to MongoDB
    client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
    const database = client.db("Practicum_Project");
    const collection = database.collection("Feedback");
    const feedbacks = await collection.find().toArray();
    console.log("Feedbacks:", feedbacks);
    return feedbacks;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Failed to fetch feedback data");
  } finally {
    if (client) {
      await client.close();
      console.log("Connection to MongoDB closed");
    }
  }
};

async function getAllFeedback() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("Practicum_Project");
    const collection = db.collection("Feedback");
    return await collection.find({}).toArray();
  } finally {
    await client.close();
  }
}
module.exports.getAllFeedback = getAllFeedback;

////    הוספת חוות דעת בבסיס הנתונים
const addFeedback = async (Username, feedbackData) => {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const database = client.db("Practicum_Project");
    const feedbackCollection = database.collection("Feedback");

    // ודא שכל השדות קיימים
    const feedback = {
      Username: feedbackData.Username,
      Name: feedbackData.Name,
      Phone: feedbackData.Phone,
      Date: feedbackData.Date,
      FeedbackDesc: feedbackData.FeedbackDesc,
      rating: Number(feedbackData.rating)
    };

    const result = await feedbackCollection.insertOne(feedback);
    console.log("Feedback added successfully!");
    return result;
  } catch (error) {
    console.error("Error adding feedback:", error);
    throw new Error("Failed to add feedback");
  } finally {
    await client.close();
  }
};

////    בדיקה האם לקוח קיים
const checkCustomerExists = async (customerID) => {
  let client;

  try {
    client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    const database = client.db("Practicum_Project");
    const collection = database.collection("Customers");

    // בדיקה אם הלקוח קיים במסד הנתונים על ידי ID
    const customer = await collection.findOne({ CustomerID: customerID });

    if (customer) {
      return true; // הלקוח קיים
    } else {
      return false; // הלקוח לא קיים
    }
  } catch (error) {
    console.error("Error checking customer:", error);
    throw new Error("Failed to check customer");
  } finally {
    if (client) {
      await client.close();
      console.log("Connection to MongoDB closed");
    }
  }
};

////    שליפת לקוח על ידי קוד לקוח
const getCustomerByID = async (customerID) => {
  let client;

  try {
    client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    const database = client.db("Practicum_Project");
    const collection = database.collection("Customers");

    // בדיקה אם הלקוח קיים במסד הנתונים על ידי ID
    const customer = await collection.findOne({ CustomerID: customerID });

    return customer; // Return the customer object (which may be null if not found)
  } catch (error) {
    console.error("Error fetching customer:", error);
    throw new Error("Failed to fetch customer");
  } finally {
    if (client) {
      await client.close();
      console.log("Connection to MongoDB closed");
    }
  }
};

////////////////////////////////////////////////////////////////////////
/////////////////////        משתמשים       /////////////////////////////

////    שליפת כל המשתמשים מהמערכת
const getAllUsers = async () => {
  try {
    const database = client.db("Practicum_Project");
    const collection = database.collection("Users");
    const Users = await collection.find().toArray();
    console.log("Users:", Users);
    return Users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
};

////    מחיקת משתמשים
async function deleteUserById(UserId) {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const db = client.db("Practicum_Project");
    const usersCollection = db.collection("Users");
    const userObjectId = new ObjectId(UserId);
    const result = await usersCollection.deleteOne({ _id: userObjectId });
    if (result.deletedCount === 1) {
      console.log("User deleted successfully");
    } else {
      console.log("User not found or deletion failed");
    }
    const Users = await usersCollection.find().toArray();
    console.log("Users:", Users);
    return Users;
  } catch (err) {
    console.error("Error deleting user:", err);
    throw err;
  } finally {
    await client.close();
  }
}

////    הוספת משתמשים
async function addUser(userData) {
  try {
    const db = client.db("Practicum_Project");
    const usersCollection = db.collection("Users");

    // Check if the username already exists
    const existingUser = await usersCollection.findOne({
      UserName: userData.UserName,
    });
    if (existingUser) {
      throw new Error("Username is already existing. Please try again.");
    }

    // If the username is not taken, proceed to insert the user data
    const result = await usersCollection.insertOne(userData);
    console.log("Insert result:", result);

    if (result && result.insertedId === 1) {
      console.log("User added:", userData);
      return userData;
    } else {
      console.error("Error adding user: No inserted document found");
      return null;
    }
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
}

////////////////////////////////////////////////////////////////////////
//////////////////////        מוצרים       /////////////////////////////

////    שליפת כל המוצרים
async function getAllProducts() {
  const client = new MongoClient(uri);

  try {
    console.log("Connecting to the database...");
    await client.connect();
    console.log("Connected to the database.");
    const database = client.db("Practicum_Project");
    const collection = database.collection("Products");
    const projection = { _id: 0 };
    const products = await collection.find({}, { projection }).toArray();
    console.log(products);
    return products;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch all products.");
  } finally {
    await client.close();
  }
}

const countProducts = async () => {
  let client;
  try {
    client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    const database = client.db("Practicum_Project");
    const collection = database.collection("Products"); // שם הקולקציה של המוצרים

    const count = await collection.countDocuments();
    console.log("Total products:", count);
    return count;
  } catch (error) {
    console.error("Error counting products:", error);
    throw new Error("Failed to count products");
  } finally {
    if (client) {
      await client.close();
      console.log("Connection to MongoDB closed");
    }
  }
};

////// סופר את כמות המתקינים
const countInstallers = async () => {
  let client;
  try {
    client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    const database = client.db("Practicum_Project");
    const collection = database.collection("Installers"); // שם הקולקציה של המוצרים

    const count = await collection.countDocuments();
    console.log("Total Installers:", count);
    return count;
  } catch (error) {
    console.error("Error counting Installers:", error);
    throw new Error("Failed to count Installers");
  } finally {
    if (client) {
      await client.close();
      console.log("Connection to MongoDB closed");
    }
  }
};

////// סופר את כמות ההתקנות
const countMeetings = async () => {
  let client;
  try {
    client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    const database = client.db("Practicum_Project");
    const collection = database.collection("InstallationMeetings"); // שם הקולקציה של המוצרים

    const count = await collection.countDocuments();
    console.log("Total Meetings:", count);
    return count;
  } catch (error) {
    console.error("Error counting Meetings:", error);
    throw new Error("Failed to count Meetings");
  } finally {
    if (client) {
      await client.close();
      console.log("Connection to MongoDB closed");
    }
  }
};

////    הוספת מוצר חדש לבסיס נתונים
async function addNewProduct(
  ProductType,
  ProductPrice,
  ProductionDate,
  ProductDescription,
  ProductImage,
) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("Practicum_Project");
    const collection = db.collection("Products");

    // Add logic to generate a new ProductID
    const maxProductIdDoc = await collection
      .find({})
      .sort({ ProductID: -1 })
      .limit(1)
      .toArray();
    const newProductID =
      maxProductIdDoc.length > 0 ? maxProductIdDoc[0].ProductID + 1 : 1;

    const product = {
      ProductID: newProductID,
      ProductType,
      ProductPrice: parseInt(ProductPrice, 10),
      ProductionDate,
      ProductDescription,
      ProductImage,
      ProductStatus: "Available",
    };

    const result = await collection.insertOne(product);
    console.log("Product added successfully:", result.insertedId);
    return result.insertedId;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  } finally {
    await client.close();
  }
}

////    סינון מוצרים
const filterProducts = async (
  ProductType,
  ProductPriceMin,
  ProductPriceMax,
  ProductStreet,
  ProductStreetNumber,
  RoomNum,
  ProductCity,
) => {
  const client = new MongoClient(uri);

  try {
    console.log("Connecting to the database...");
    await client.connect();
    console.log("Connected to the database.");
    const database = client.db("Practicum_Project");
    const collection = database.collection("Products");
    const filter = { ProductStatus: "Available" }; // Add condition for ProductStatus
    if (ProductType) filter.ProductType = ProductType;
    if (ProductPriceMin || ProductPriceMax) {
      // Convert string inputs to numeric values
      const minPrice = ProductPriceMin
        ? parseInt(ProductPriceMin, 10)
        : undefined;
      const maxPrice = ProductPriceMax
        ? parseInt(ProductPriceMax, 10)
        : undefined;

      filter.ProductPrice = {};
      if (minPrice !== undefined) filter.ProductPrice.$gte = minPrice;
      if (maxPrice !== undefined) filter.ProductPrice.$lte = maxPrice;
    }

    console.log("Filter:", filter);
    const projection = { ProductID: 0 }; // Exclude ProductID and ProductImage fields
    const result = await collection.find(filter, { projection }).toArray();
    console.log("Filtered Products:", result);
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch filtered products.");
  } finally {
    await client.close();
    console.log("Database connection closed.");
  }
};

////    סינון מוצרים למנהלים
const filterProductsForManager = async (
  ProductType,
  ProductPriceMin,
  ProductPriceMax,
) => {
  const client = new MongoClient(uri);

  try {
    console.log("Connecting to the database...");
    await client.connect();
    console.log("Connected to the database.");
    const database = client.db("Practicum_Project");
    const collection = database.collection("Products");
    const filter = {};
    if (ProductType) filter.ProductType = ProductType;
    if (ProductPriceMin || ProductPriceMax) {
      // Convert string inputs to numeric values
      const minPrice = ProductPriceMin
        ? parseInt(ProductPriceMin, 10)
        : undefined;
      const maxPrice = ProductPriceMax
        ? parseInt(ProductPriceMax, 10)
        : undefined;

      // Construct a price range filter
      filter.ProductPrice = {};
      if (minPrice !== undefined) filter.ProductPrice.$gte = minPrice;
      if (maxPrice !== undefined) filter.ProductPrice.$lte = maxPrice;
    }

    console.log("Filter:", filter);
    const projection = { ProductID: 0 }; // Exclude ProductID and ProductImage fields
    const result = await collection.find(filter, { projection }).toArray();
    console.log("Filtered Products:", result);
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch filtered products.");
  } finally {
    await client.close();
    console.log("Database connection closed.");
  }
};

////    עדכון מוצרים במערכת
const updateProduct = async (
  ProductID,
  ProductType,
  ProductPrice,
  ProductionDate,
  ProductDescription,
  ProductImage,
  ProductStatus,
) => {
  let client;

  try {
    client = await MongoClient.connect(uri);
    console.log("Connected to MongoDB");

    const database = client.db("Practicum_Project");
    const collection = database.collection("Products");

    const query = { ProductID: parseInt(ProductID) };
    console.log("Query to find product:", query);

    const updateQuery = {};
    if (ProductType) updateQuery.ProductType = ProductType;
    if (ProductPrice) updateQuery.ProductPrice = parseInt(ProductPrice);
    if (ProductionDate) updateQuery.ProductionDate = ProductionDate;
    if (ProductDescription) updateQuery.ProductDescription = ProductDescription;
    if (ProductImage) updateQuery.ProductImage = ProductImage;
    if (ProductStatus) updateQuery.ProductStatus = ProductStatus;
    console.log("Update fields:", updateQuery);

    if (Object.keys(updateQuery).length > 0) {
      const result = await collection.updateOne(query, { $set: updateQuery });
      console.log("Update operation result:", result);

      return result.modifiedCount;
    } else {
      console.log("No fields to update.");
      return 0;
    }
  } catch (error) {
    console.error("Error in updateProduct:", error.message);
    throw new Error(error.message);
  } finally {
    if (client) {
      await client.close();
      console.log("Connection to MongoDB closed.");
    }
  }
};

////////////////////////////////////////////////////////////////////////
/////////////////////         מתקינים      /////////////////////////////

// Add Installation Meeting
const addInstallationMeeting = async (
  customerID,
  installerID,
  date,
  time,
  location,
  meetingType,
) => {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const database = client.db("Practicum_Project");
    const installationsCollection = database.collection("InstallationMeetings");

    // Validate Date
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      throw new Error("Invalid date format. Ensure the format is YYYY-MM-DD.");
    }

    // Insert the installation meeting
    const result = await installationsCollection.insertOne({
      CustomerID: customerID,
      InstallerID: installerID,
      Date: parsedDate.toISOString().split("T")[0], // Store date in ISO format
      Time: time,
      Location: location,
      MeetingType: meetingType,
      CreatedAt: new Date(),
    });

    console.log("Installation meeting added successfully:", result.insertedId);
    return result.insertedId;
  } catch (error) {
    console.error("Error adding installation meeting:", error.message);
    throw new Error(error.message);
  } finally {
    await client.close();
  }
};

////    הוספת התקנה
const addMeeting = async (
  customerID,
  date,
  time,
  location,
  partner,
  meetingType,
  productSelect,
) => {
  let client; // Define client variable

  try {
    // Connect to MongoDB database
    client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Access the MongoDB database
    const database = client.db("Practicum_Project");
    const meetingsCollection = database.collection("InstallationMeetings");
    const customersCollection = database.collection("Customers");
    const installersCollection = database.collection("Installers");

    // Check if the provided date has already passed
    const meetingDate = new Date(date);
    const currentDate = new Date();
    if (meetingDate < currentDate) {
      throw new Error("Date has passed. Please pick a date that is relevant.");
    }

    // Check if the CustomerID exists in the Customers collection
    // const customer = await customersCollection.findOne({
    // CustomerID: customerID,
    // });
    // if (!customer) {
    //  throw new Error("You are not yet a customer. Please sign up as one.");
    // }

    // Add meeting document to Meetings collection with appropriate details
    const meetingData = {
      CustomerID: customerID,
      Date: date,
      Time: time,
      Location: location,
      Partner: partner,
      MeetingType: meetingType,
    };

    // Check if ProductSelect is provided before adding it to the document
    if (productSelect && productSelect.length > 0) {
      meetingData.ProductSelect = productSelect;
    }

    const result = await meetingsCollection.insertOne(meetingData);

    console.log("Meeting added successfully");
    return result.insertedId;
  } catch (error) {
    console.error("Error adding meeting:", error.message);
    throw new Error(error.message);
  } finally {
    // Close connection to MongoDB database
    if (client) {
      await client.close();
      console.log("Connection to MongoDB closed");
    }
  }
};

////    שליפת התקנות  מהמערכת
const getAllMeetings = async () => {
  try {
    const database = client.db("Practicum_Project");
    const collection = database.collection("Meetings");
    const meetings = await collection.find().toArray();
    console.log("Meetings:", meetings);
    return meetings;
  } catch (error) {
    console.error("Error fetching meetings:", error);
    throw new Error("Failed to fetch meetings");
  }
};

////    מחיקת התקנה
async function deleteMeetingById(meetingId) {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log("Connected to MongoDB"); // לוג לקשר הוצאה
    const db = client.db("Practicum_Project");
    const MeetingsCollection = db.collection("Meetings");
    const userObjectId = new ObjectId(meetingId);
    const result = await MeetingsCollection.deleteOne({ _id: userObjectId });
    if (result.deletedCount === 1) {
      console.log("Meeting deleted successfully");
    } else {
      console.log("Meetings not found or deletion failed");
    }
  } catch (err) {
    console.error("Error deleting Meeting:", err);
    throw err;
  } finally {
    await client.close();
    console.log("MongoDB connection closed"); // לוג לסגירת קשר
  }
}

////    בדיקה האם התקנה קיימת במערכת
const checkMeetingExists = async (date, time, partner) => {
  let client;

  try {
    client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    const database = client.db("Practicum_Project");
    const collection = database.collection("Meetings");
    const dateTime = new Date(`${date}T${time}`);

    // בדיקה אם הלקוח קיים במסד הנתונים על ידי ID
    const meeting = await collection.findOne({
      DateTime: dateTime,
      Partner: partner,
    });

    if (meeting) {
      return true; // הלקוח קיים
    } else {
      return false; // הלקוח לא קיים
    }
  } catch (error) {
    console.error("Error checking meeting:", error);
    throw new Error("Failed to check meeting");
  } finally {
    if (client) {
      await client.close();
      console.log("Connection to MongoDB closed");
    }
  }
};

////    הצגת מוצרים במלאי בלבד
async function getAvailableProducts() {
  const client = new MongoClient(uri);

  try {
    console.log("Connecting to the database...");
    await client.connect();
    console.log("Connected to the database.");
    const database = client.db("Practicum_Project");
    const collection = database.collection("Products");
    const projection = { _id: 0 };
    const filter = { ProductStatus: "Available" };
    const products = await collection.find(filter, { projection }).toArray();
    console.log(products);
    return products;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch available products.");
  } finally {
    await client.close();
  }
}

////////////////////////////////////////////////////////////////////////
/////////////////////         שותפים       /////////////////////////////

////    הוספת שותף
async function addPartner(partnerData) {
  try {
    const db = client.db("Practicum_Project");
    const partnerCollection = db.collection("Partner");
    const result = await partnerCollection.insertOne(partnerData);
    console.log("Insert result:", result);
    if (result && result.insertedCount === 1) {
      console.log("partner added:", partnerData);
      return partnerData;
    } else {
      console.error("Error adding partner: No inserted document found");
      return null;
    }
  } catch (error) {
    console.error("Error adding partner:", error);
    throw error;
  }
}

////    קבלת כל השותפים
async function getAllPartners() {
  const client = new MongoClient(uri);

  try {
    console.log("Connecting to the database...");
    await client.connect();
    console.log("Connected to the database.");
    const database = client.db("Practicum_Project");
    const collection = database.collection("Partner");
    const projection = { _id: 0 };
    const partners = await collection.find({}, { projection }).toArray();
    console.log(partners);
    return partners;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch all Partners.");
  } finally {
    await client.close();
  }
}

////    הוספת לקוח חדש
const addCustomer = async (
  customerID,
  fullName,
  phone,
  email,
  joinDate,
  customerType,
  UserName,
) => {
  let client;

  try {
    client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    const database = client.db("Practicum_Project");
    const collection = database.collection("Customers");

    const existingCustomer = await collection.findOne({
      CustomerID: customerID,
    });
    if (existingCustomer) {
      throw new Error("The ID you entered already exists");
    }

    const result = await collection.insertOne({
      CustomerID: customerID,
      FullName: fullName,
      Phone: phone,
      Email: email,
      joinDate: joinDate,
      CustomerType: customerType,
      UserName: UserName,
    });

    console.log("Customer added successfully");
    return result.insertedId;
  } catch (error) {
    console.error("Error adding Customer:", error);
    throw new Error("Failed to add Customer: " + error.message);
  } finally {
    if (client) {
      await client.close();
      console.log("Connection to MongoDB closed");
    }
  }
};

////////////////////////////////////////////////////////////////////////
/////////////////////         מבצעים       /////////////////////////////
////    יצירת מבצע
async function createDeal(
  ProductID,
  customer1Id,
  customer2Id,
  SignatureDate,
  partnerUserName,
) {
  try {
    ProductID = parseInt(ProductID);

    if (customer1Id === customer2Id) {
      throw new Error("Customer IDs cannot be the same.");
    }

    const db = client.db("Practicum");
    const dealsCollection = db.collection("Deals");
    const customersCollection = db.collection("Customers");
    const productsCollection = db.collection("Products");

    const customer1 = await customersCollection.findOne({
      CustomerID: customer1Id,
    });
    const customer2 = await customersCollection.findOne({
      CustomerID: customer2Id,
    });

    if (!customer1 || !customer2) {
      throw new Error("Customer 1 or Customer 2 not found.");
    }

    const product = await productsCollection.findOne({ ProductID: ProductID });

    if (!product) {
      throw new Error("Product not found.");
    }

    if (product.ProductStatus === "Unavailable") {
      throw new Error("Product is unavailable.");
    }

    let dealType, customer1Role, customer2Role, dealCommission;
    if (product.ProductType.toLowerCase() === "rent") {
      dealType = "Renting";
      customer1Role = "Rented";
      customer2Role = "Rentee";
      dealCommission = product.ProductPrice;
    } else if (product.ProductType.toLowerCase() === "sale") {
      dealType = "Buying";
      customer1Role = "Seller";
      customer2Role = "Buyer";
      dealCommission = product.ProductPrice * 0.01;
    } else {
      throw new Error(
        "Invalid product type. Product type must be 'rent' or 'sale'.",
      );
    }

    const highestDeal = await dealsCollection.findOne(
      {},
      { sort: { transactionNumber: -1 } },
    );
    const transactionNumber = highestDeal
      ? highestDeal.transactionNumber + 1
      : 1;

    const currentDate = new Date();
    const hour = currentDate.getHours();

    const deal1 = {
      transactionNumber,
      customerId: customer1Id,
      ProductID,
      dealType,
      role: customer1Role,
      dealCommission,
      createdAtHour: hour,
      createdAtDate: SignatureDate,
      PartnerUserName: partnerUserName,
    };

    const transactionNumberForSecondDeal = transactionNumber + 1;

    const deal2 = {
      transactionNumber: transactionNumberForSecondDeal,
      customerId: customer2Id,
      ProductID,
      dealType: dealType === "Renting" ? "Rented" : "Selling",
      role: customer2Role,
      dealCommission,
      createdAtHour: hour,
      createdAtDate: SignatureDate,
      PartnerUserName: partnerUserName,
    };

    await productsCollection.updateOne(
      { ProductID: ProductID },
      { $set: { ProductStatus: "Unavailable" } },
    );

    await dealsCollection.insertOne(deal1);
    await dealsCollection.insertOne(deal2);

    return { deal1, deal2 };
  } catch (error) {
    throw new Error(error.message);
  }
}

////    שליפת כל המבצעים
const getAllDeals = async () => {
  try {
    const database = client.db("Practicum_Project");
    const collection = database.collection("Deals");
    const deals = await collection.find().toArray();
    console.log("deals:", deals);
    return deals;
  } catch (error) {
    console.error("Error fetching deals:", error);
    throw new Error("Failed to fetch Deals");
  }
};

////    שליפת התקנות לפי שם משתמש
async function getMeetingsByUsername(username) {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const db = client.db("Practicum_Project");
    console.log(username);

    // Step 1: Find the customer document based on the username
    const customer = await db
      .collection("Customers")
      .findOne({ UserName: username });
    if (!customer) {
      console.log("Customer not found");
      return [];
    }

    // Step 2: Find all meetings that match the CustomerID
    const meetings = await db
      .collection("Meetings")
      .find({ CustomerID: customer.CustomerID })
      .toArray();
    console.log("Meetings:", meetings);
    return meetings;
  } catch (error) {
    console.error("Error fetching meetings:", error);
    throw error;
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
}

////    קבלת כל השותפים
const getInstallers = async () => {
  let client;
  try {
    client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    const database = client.db("Practicum_Project");
    const collection = database.collection("Installers"); // שם הקולקציה של המתקינים

    const installers = await collection.find().toArray(); // שליפת כל המתקינים
    console.log("Installers:", installers);
    return installers;
  } catch (error) {
    console.error("Error fetching installers:", error);
    throw new Error("Failed to fetch installers");
  } finally {
    if (client) {
      await client.close();
      console.log("Connection to MongoDB closed");
    }
  }
};

const getCollectionCounts = async () => {
  let client;
  try {
    client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    const database = client.db("Practicum_Project");

    // שליפת כמות המסמכים מכל קולקציה
    const customersCount = await database
      .collection("Customers")
      .countDocuments();
    const installersCount = await database
      .collection("Installers")
      .countDocuments();
    const productsCount = await database
      .collection("Products")
      .countDocuments();

    return {
      customersCount,
      installersCount,
      productsCount,
    };
  } catch (error) {
    console.error("Error fetching collection counts:", error);
    throw new Error("Failed to fetch collection counts");
  } finally {
    if (client) {
      await client.close();
      console.log("Connection to MongoDB closed");
    }
  }
};

const updateProductUnits = async (productId, units) => {
  let client;
  try {
    client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const database = client.db("Practicum_Project");
    const collection = database.collection("Products");

    // עדכון כמות היחידות למוצר לפי ה-ID
    const result = await collection.updateOne(
      { _id: new MongoClient.ObjectId(productId) },
      { $set: { totalUnits: units } },
    );

    return result.modifiedCount > 0;
  } catch (error) {
    console.error("Error updating product units:", error);
    throw new Error("Failed to update product units");
  } finally {
    if (client) {
      await client.close();
    }
  }
};

////// TO Do List
const addTodoItem = async (todoItem) => {
  let client;
  try {
    client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const database = client.db("TodoApp");
    const collection = database.collection("Todos");

    const result = await collection.insertOne(todoItem);
    return result.insertedId; // Return the ID of the inserted item
  } catch (error) {
    console.error("Error adding TODO item:", error);
    throw new Error("Failed to add TODO item");
  } finally {
    if (client) {
      await client.close();
    }
  }
};

const getTodoItems = async () => {
  let client;
  try {
    client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const database = client.db("TodoApp");
    const collection = database.collection("Todos");

    return await collection.find().toArray();
  } catch (error) {
    console.error("Error fetching TODO items:", error);
    throw new Error("Failed to fetch TODO items");
  } finally {
    if (client) {
      await client.close();
    }
  }
};

const deleteTodoItem = async (id) => {
  let client;
  try {
    client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const database = client.db("TodoApp"); // Replace with your database name
    const collection = database.collection("Todos"); // Replace with your collection name

    // Delete the TODO item by its ID
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0; // Return true if an item was deleted
  } catch (error) {
    console.error("Error deleting TODO item:", error);
    throw new Error("Failed to delete TODO item");
  } finally {
    if (client) {
      await client.close();
    }
  }
};

////////////////////////////////////////////////////////////////////////
/////////////////////      מכרזים     //////////////////////////////////

// קבלת כל המכרזים
const getAllTenders = async () => {
  try {
    const database = client.db("Practicum_Project");
    const collection = database.collection("Tenders");
    const tenders = await collection.find().toArray();
    console.log("Tenders:", tenders);
    return tenders;
  } catch (error) {
    console.error("Error fetching tenders:", error);
    throw new Error("כישלון בשליפת מכרזים");
  }
};

// הוספת מכרז חדש
const addTender = async (
  tenderID,
  customerID,
  customerName,
  tenderDate,
  productCategory,
  productID,
  productPrice,
  discription,
) => {
  try {
    const database = client.db("Practicum_Project");
    const collection = database.collection("Tenders");

    const tender = {
      tenderID,
      customerID,
      customerName,
      tenderDate,
      productCategory,
      productID,
      productPrice,
      discription,
    };

    const result = await collection.insertOne(tender);
    console.log("Tender added successfully:", result.insertedId);
    return result.insertedId;
  } catch (error) {
    console.error("Error adding tender:", error);
    throw new Error("כישלון בהוספת מכרז");
  }
};

// עדכון מכרז
const updateTender = async (id, updatedData) => {
  try {
    const database = client.db("Practicum_Project");
    const collection = database.collection("Tenders");

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData },
    );

    if (result.matchedCount === 0) {
      throw new Error("מכרז לא נמצא");
    }

    console.log("Tender updated successfully");
    return result.modifiedCount;
  } catch (error) {
    console.error("Error updating tender:", error);
    throw new Error("כישלון בעדכון המכרז");
  }
};

// מחיקת מכרז
const deleteTender = async (id) => {
  try {
    const database = client.db("Practicum_Project");
    const collection = database.collection("Tenders");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      throw new Error("מכרז לא נמצא");
    }

    console.log("Tender deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting tender:", error);
    throw new Error("כישלון במחיקת המכרז");
  }
};



////////////////////////////////////////////////////////////////////////

module.exports = {
  run,
  loginUser,
  getAllProducts,
  filterProducts,
  getFeedback,
  addNewProduct,
  addFeedback,
  addMeeting,
  updateProduct,
  getAllUsers,
  getInstallers,
  deleteUserById,
  addUser,
  addPartner,
  getAllPartners,
  addCustomer,
  filterProductsForManager,
  createDeal,
  checkCustomerExists,
  getAllMeetings,
  deleteMeetingById,
  checkMeetingExists,
  getAllCustomers,
  getMeetingsByUsername,
  getAllDeals,
  getCustomerByID,
  getAvailableProducts,
  addInstallationMeeting,
  countCustomers,
  countProducts,
  countInstallers,
  countMeetings,
  getCollectionCounts,
  updateProductUnits,
  addTodoItem,
  getTodoItems,
  deleteTodoItem,
  getAllTenders,
  addTender,
  updateTender,
  deleteTender,
  updateCustomers,
  deletecustomerById,
  getAllFeedback,
};
