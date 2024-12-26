const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb+srv://eladt1010:9wRHk5BLfmqRrQb3@practicumproject.rimn0.mongodb.net/?retryWrites=true&w=majority&appName=PracticumProject";
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
      "Pinged your deployment. You successfully connected to MongoDB!"
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

////    הוספת חוות דעת בבסיס הנתונים
const addFeedback = async (Username, feedbackData) => {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const database = client.db("Practicum_Project");
    const customersCollection = database.collection("Customers");
    const dealsCollection = database.collection("Deals");

    // Find the customer by Username
    const customer = await customersCollection.findOne({ UserName: Username });
    if (!customer) {
      throw new Error(
        "Customer not found. Please register as a customer to add feedback."
      );
    }

    // Find the customer ID from the found customer
    const customerId = customer.CustomerID;

    // Check if the customer has made any deals
    const dealsCount = await dealsCollection.countDocuments({
      customerId: customerId,
    });
    if (dealsCount === 0) {
      throw new Error(
        "You still haven't made a deal. A feedback hasn't been added."
      );
    }

    // Add the feedback to the Feedback collection
    const feedbackCollection = database.collection("Feedback");
    const result = await feedbackCollection.insertOne(feedbackData);
    console.log("Feedback added successfully!");
    console.log("Received feedback data:", feedbackData);
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

    if (result && result.insertedCount === 1) {
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



////    הוספת מוצר חדש לבסיס נתונים
async function addNewProduct(ProductType, ProductPrice, ProductionDate, ProductDescription, ProductImage) {
  const client = new MongoClient(uri);

  try {
      await client.connect();
      const db = client.db("Practicum_Project");
      const collection = db.collection("Products");

      // Add logic to generate a new ProductID
      const maxProductIdDoc = await collection.find({}).sort({ ProductID: -1 }).limit(1).toArray();
      const newProductID = maxProductIdDoc.length > 0 ? maxProductIdDoc[0].ProductID + 1 : 1;

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
  ProductCity
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
      const minPrice = ProductPriceMin ? parseInt(ProductPriceMin, 10) : undefined;
      const maxPrice = ProductPriceMax ? parseInt(ProductPriceMax, 10) : undefined;

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
      const minPrice = ProductPriceMin ? parseInt(ProductPriceMin, 10) : undefined;
      const maxPrice = ProductPriceMax ? parseInt(ProductPriceMax, 10) : undefined;

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
  ProductImage
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
const addInstallationMeeting = async (customerID, installerID, date, time, location, meetingType) => {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

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
  productSelect
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
  UserName
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
  partnerUserName
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
        "Invalid product type. Product type must be 'rent' or 'sale'."
      );
    }

    const highestDeal = await dealsCollection.findOne(
      {},
      { sort: { transactionNumber: -1 } }
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
      { $set: { ProductStatus: "Unavailable" } }
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
};
