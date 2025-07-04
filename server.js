const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const fs = require('fs');
const path = require('path');

const uri =
  "mongodb+srv://eladt1010:9wRHk5BLfmqRrQb3@practicumproject.rimn0.mongodb.net/?retryWrites=true&w=majority&appName=PracticumProject";

const app = express();
const port = 4000;

const {
  loginUser,
  getFeedback,
  getAllProducts,
  addNewProduct,
  addFeedback,
  addMeeting,
  updateProperty,
  getAllUsers,
  deleteUserById,
  addUser,
  addPartner,
  updateProduct,
  getAllPartners,
  getCollectionCounts,
  addCustomer,
  createDeal,
  checkCustomerExists,
  getAllMeetings,
  deleteMeetingById,
  checkMeetingExists,
  getAllCustomers,
  getMeetingsByUsername,
  getAllDeals,
  getCustomerByID,
  getAvailableAssets,
  addInstallationMeeting,
  updateProductUnits,
  getTodoItems,
  addTodoItem,
  deleteTodoItem,
  getAllTenders,
  addTender,
  updateTender,
  deleteTender,
  updateCustomers,
  deletecustomerById,
  getAllFeedback,
  getCustomerByUserName,
} = require("./MongoDB");

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "eladt1010@gmail.com",
    pass: "lllw opsd rpsn ezqb"
  }
});

// שליחת מייל אישור
app.post("/api/send-approval-email", async (req, res) => {
  const { email, orderId } = req.body;
  if (!email) return res.status(400).json({ error: "חסר מייל לקוח" });
  try {
    await transporter.sendMail({
      from: '"תריסי סיני" <eladt1010@gmail.com>',
      to: email,
      subject: "הזמנתך אושרה",
      html: `<h3>שלום,</h3><p>ההזמנה שביצעת (מספר הזמנה: ${orderId}) אושרה!</p>`
    });
    res.json({ message: "המייל נשלח בהצלחה" });
  } catch (error) {
    console.error("שגיאה בשליחת מייל אישור:", error);
    res.status(500).json({ error: "שגיאה בשליחת המייל" });
  }
});

// שליחת מייל דחייה
app.post("/api/send-reject-email", async (req, res) => {
  const { email, orderId } = req.body;
  if (!email) return res.status(400).json({ error: "חסר מייל לקוח" });
  try {
    await transporter.sendMail({
      from: '"תריסי סיני" <eladt1010@gmail.com>',
      to: email,
      subject: "הזמנתך נדחתה",
      html: `<h3>שלום,</h3><p>ההזמנה שביצעת (מספר הזמנה: ${orderId}) נדחתה.</p>`
    });
    res.json({ message: "המייל נשלח בהצלחה" });
  } catch (error) {
    console.error("שגיאה בשליחת מייל דחייה:", error);
    res.status(500).json({ error: "שגיאה בשליחת המייל" });
  }
});

///////////////////          דף הבית           //////////////////////////
app.get("/", (req, res) => {
  res.send("Hello from the root URL!");
});
////////////////////////////////////////////////////////////////////////

/////////////////        התחברות למערכת       //////////////////////////
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const loginResult = await loginUser(username, password);
    res.json(loginResult);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

////////////////////////////////////////////////////////////////////////
//////////////////////        לקוחות       /////////////////////////////


////    מוצרים
app.get("/Customers", async (req, res) => {
  try {
    const Customers = await getAllCustomers();
    res.json(Customers);
  } catch (error) {
    res.status(500).json({ error: "בעיה בהצגת כל הלקוחות" });
  }
});

app.put("/Customers/:id", async (req, res) => {
  try {
    const {
      customerID,
      CustomerName,
      CustomerPhone,
      CustomerEmail,
      CustomerJoinDate,
      CustomerType,
      CustomerUserName
    } = req.body;
    const updatedCount = await updateCustomers(
      req.params.id,
      CustomerName,
      CustomerPhone,
      CustomerEmail,
      CustomerJoinDate,
      CustomerType,
      CustomerUserName
    );

    if (updatedCount > 0) {
      res.status(200).send({ message: "הלקוח עודכן בהצלחה!" });
    } else {
      res
        .status(404)
        .send({ message: "ישנה בעיה בעדכון פרטי הלקוח." });
    }
  } catch (error) {
    console.error("Error in PUT /Customers/:id:", error.message);
    res.status(500).send({ error: error.message });
  }
});


////    הוספת לקוח חדש
app.post("/addCustomer", async (req, res) => {
  const {
    customerID,
    fullName,
    phone,
    email,
    joinDate,
    customerType,
    UserName,
    Password, // קבל גם את הסיסמה
  } = req.body;

  try {
    // הוספה לטבלת לקוחות
    await addCustomer(
      customerID,
      fullName,
      phone,
      email,
      joinDate,
      customerType,
      UserName
    );

    // הוספה לטבלת משתמשים
    await addUser({
      username: UserName,
      password: Password,
      fullName: fullName,
      email: email,
      phone: phone,
      role: "customer"
    });

    res.status(201).json({ message: "הלקוח התווסף למערכת בהצלחה" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

////    בדיקה האם הלקוח קיים בבסיס הנתונים
app.get("/checkCustomerExists", async (req, res) => {
  const { customerID } = req.query;

  try {
    const exists = await checkCustomerExists(customerID);
    res.status(200).json({ exists }); // Return a JSON response
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/Customers/:customerID", async (req, res) => {
  const customerID = req.params.id;
  try {
    await deleteUserById(customerID);
    res.sendStatus(204); // Send success status code
    } catch (error) {
      console.error("בעיה במחיקת הלקוח:", error);
      res.sendStatus(500); // Send internal server error status code
    }
  }
);

app.post("/addInstaller", async (req, res) => {
  const { installerID, UserName, fullName, phone, email, joinDate } = req.body;
  try {
    // בדוק אם קיים מתקין עם אותו קוד
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("Practicum_Project");
    const installers = db.collection("Installers");
    const exists = await installers.findOne({ InstallerID: installerID });
    if (exists) {
      await client.close();
      return res.status(400).json({ error: "קוד מתקין כבר קיים" });
    }
    // הוסף מתקין
    await installers.insertOne({
      InstallerID: installerID,
      UserName,
      FullName: fullName,
      Phone: phone,
      Email: email,
      JoinDate: joinDate,
    });
    await client.close();
    res.status(201).json({ message: "המתקין התווסף בהצלחה" });
  } catch (error) {
    res.status(500).json({ error: "שגיאה בהוספת מתקין" });
  }
});

////    חוות דעת לקוחות
app.get("/feedback", async (req, res) => {
  const feedback = await getFeedback();
  res.json(feedback);
});

app.get("/getAllFeedback", async (req, res) => {
  try {
    const feedbacks = await getAllFeedback();
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: "בעיה בשליפת חוות הדעת" });
  }
});


////    הוספת חוות דעת
app.post("/addFeedback", async (req, res) => {
  const { Username, Name, Phone, Date, FeedbackDesc, rating } = req.body;
  console.log("BODY:", req.body); // הוסף שורה זו
  try {
    // שלח את כל השדות לפונקציה שמוסיפה למסד הנתונים
    const feedbackData = {
      Username,
      Name,
      Phone,
      Date,
      FeedbackDesc,
      rating: Number(rating)
    };
    const result = await addFeedback(Username, feedbackData);
    res.status(201).json({ message: "התגובה שלך התקבלה בהצלחה!" });
  } catch (error) {
    res.status(500).json({ error: "בעיה בהוספת חוות הדעת" });
  }
});

////    פנייה לחברה ע״י האתר
app.post("/submitMessage", async (req, res) => {
  const { Name, Email, Phone, Message } = req.body;
  try {
    await transporter.sendMail({
      from: `"${Name}" <${Email}>`,
      to: "eladt1010@gmail.com", // כתובת היעד שלך
      subject: "פנייה חדשה מהאתר",
      html: `
        <h3>פנייה חדשה מהאתר</h3>
        <b>שם:</b> ${Name}<br>
        <b>אימייל:</b> ${Email}<br>
        <b>טלפון:</b> ${Phone}<br>
        <b>הודעה:</b><br>${Message}
      `
    });
    res.json({ message: "המייל נשלח בהצלחה!" });
  } catch (error) {
    console.error(error);
    res.json({ error: "בעיה בשליחת האימייל." });
  }
});


////    קבלת לקוחות מבסיס הנתונים
app.get("/getCustomers", async (req, res) => {
  try {
    const Customers = await getAllCustomers(); // Implement this function to fetch all users
    res.json(Customers); // Send the users as a JSON response
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "בעיה פנימית בשרת" });
  }
});

////    קבלת מספרי לקוח מבסיס הנתונים
app.get("/getCustomerID", async (req, res) => {
  const { customerID } = req.query;

  try {
    const customer = await getCustomerByID(customerID);
    if (customer) {
      res.status(200).json(customer); // Return the customer data if found
    } else {
      res.status(404).json({ error: "לקוח לא נמצא" }); // Return a 404 error if customer not found
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

////    יצירת התקנה לפי לקוחות
app.get("/meetings-customer", async (req, res) => {
  try {
    const username = req.query.username;
    if (!username) {
      return res.status(400).json({ error: "שם משתמש לא סופק" });
    }
    const meetings = await getMeetingsByUsername(username);
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ error: "בעיה פנימית בשרת" });
  }
});

////////////////////////////////////////////////////////////////////////
//////////////////////        מוצרים       /////////////////////////////

////    הוספת מוצר חדש
app.post("/addNewProduct", async (req, res) => {
  const {
    ProductType,
    ProductPrice,
    ProductionDate,
    ProductDescription,
    ProductImage,
  } = req.body;

  try {
    const productId = await addNewProduct(
      ProductType,
      ProductPrice,
      ProductionDate,
      ProductDescription,
      ProductImage,
    );
    res.status(201).json({ message: "המוצר נוסף בהצלחה", productId });
  } catch (error) {
    console.error("בעיה בהוספת מוצר:", error);
    res.status(500).json({ error: error.message });
  }
});

////    הוספת מבצע חדש
app.post("/addDeal", async (req, res) => {
  const { AssetID, Customer1ID, Customer2ID, SignatureDate, PartnerUserName } =
    req.body;

  try {
    const deal = await createDeal(
      AssetID,
      Customer1ID,
      Customer2ID,
      SignatureDate,
      PartnerUserName,
    );
    res.status(201).json({ message: "", deal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

////    משהו
app.post("/updateProperty", async (req, res) => {
  const {
    assetID,
    assetType,
    assetPrice,
    assetStreet,
    assetStreetNumber,
    roomNum,
    assetImage,
  } = req.body;
  console.log("Request Body:", req.body);

  try {
    const propertyId = await updateProperty(
      assetID,
      assetType,
      assetPrice,
      assetStreet,
      assetStreetNumber,
      roomNum,
      assetImage,
    );
    res
      .status(201)
      .json({ message: "הנכס עודכן בהצלחה", propertyId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

////    מוצרים
app.get("/Products", async (req, res) => {
  try {
    const Products = await getAllProducts();
    res.json(Products);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "בעיה בהצגת כל המוצרים" });
  }
});

app.put("/Products/:id", async (req, res) => {
  console.log("Received PUT request to update product");
  console.log("Params ID:", req.params.id);
  console.log("Request body:", req.body);

  try {
    const {
      ProductID,
      ProductType,
      ProductPrice,
      ProductionDate,
      ProductDescription,
      ProductImage,
    } = req.body;
    const updatedCount = await updateProduct(
      req.params.id,
      ProductType,
      ProductPrice,
      ProductionDate,
      ProductDescription,
      ProductImage,
    );

    console.log("Updated count:", updatedCount);

    if (updatedCount > 0) {
      res.status(200).send({ message: "מוצר עודכן בהצלחה!" });
    } else {
      res
        .status(404)
        .send({ message: "המוצר לא נמצא או שלא בוצעו עדכונים." });
    }
  } catch (error) {
    console.error("Error in PUT /Products/:id:", error.message);
    res.status(500).send({ error: error.message });
  }
});

////    מבצעים
app.get("/deals", async (req, res) => {
  try {
    const deals = await getAllDeals();
    res.json(deals);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "בעיה בהצגת כל המבצעים" });
  }
});

////////////////////////////////////////////////////////////////////////
//////////////////////        מתקינים       ////////////////////////////

app.get("/installations", async (req, res) => {
  let client; // Declare client outside the try block
  try {
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    const database = client.db("Practicum_Project");
    const installationsCollection = database.collection("InstallationMeetings");

    // Fetch all installations
    const installations = await installationsCollection.find({}).toArray();
    console.log("Installations fetched successfully:", installations);
    res.status(200).json(installations); // Send data as JSON
  } catch (error) {
    console.error("Error fetching installations:", error.message);
    res.status(500).json({ error: "בעיה בהצגת כל ההתקנות." });
  } finally {
    if (client) await client.close(); // Safely close the client
  }
});

app.put("/installations/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    const database = client.db("Practicum_Project");
    const installationsCollection = database.collection("InstallationMeetings");

    const result = await installationsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Installation not found." });
    }

    res.status(200).json({ message: "ההתקנה עודכנה בהצלחה." });
  } catch (error) {
    console.error("Error updating installation:", error.message);
    res.status(500).json({ error: "בעיה בעדכון ההתקנה." });
  }
});

////    הוספת התקנה חדשה
app.post("/addMeeting", async (req, res) => {
  const {
    customerID,
    date,
    time,
    location,
    partner,
    meetingType,
    assetSelect,
  } = req.body;

  try {
    const customerExists = await checkCustomerExists(customerID);
    if (!customerExists) {
      return res.status(400).json({ error: "הלקוח לא קיים" });
    }

    const meetingId = await addMeeting(
      customerID,
      date,
      time,
      location,
      partner,
      meetingType,
      assetSelect,
    );
    res.status(201).json({ message: "הפגישה נוספה בהצלחה", meetingId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use(express.json());

app.post("/addCustomerMeeting", async (req, res) => {
  console.log("BODY:", req.body);
  const { UserName, Date, Time, MeetingType } = req.body;
  if ( !Date || !Time || !MeetingType) {
    return res.status(400).json({ success: false, error: "חסר שדה חובה" });
  }
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("Practicum_Project");
    await db.collection("CustomerMeetings").insertOne({
      UserName,
      Date,
      Time,
      MeetingType,
      CreatedAt: new Date() // שים לב ל-new
    });
    await client.close();
    res.status(201).json({ success: true, message: "הפגישה נוספה בהצלחה" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: "שגיאה בהוספת הפגישה" });
  }
});

////    הוספת פגישה חדשה
app.post("/addMeeting", express.json(), async (req, res) => {
  const { UserName, Date, Time, MeetingType } = req.body;
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("Practicum_Project");
    await db.collection("Meetings").insertOne({
      UserName,
      Date,
      Time,
      MeetingType
    });
    res.status(201).json({ message: "הפגישה נוספה בהצלחה" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to add meeting" });
  }
});

////    שליפת מספר התקנה
app.delete("/meeting/:id", async (req, res) => {
  const meetingId = req.params.id;
  try {
    await deleteMeetingById(meetingId);
    res.sendStatus(204); // Send success status code
  } catch (error) {
    console.error("Error deleting meeting:", error);
    res.sendStatus(500); // Send internal server error status code
  }
});

////    בדיקה האם קיימת התקנה במערכת
app.get("/checkMeetingExists", async (req, res) => {
  const { date, time, partner } = req.query;

  try {
    const exists = await checkMeetingExists(date, time, partner);
    res.status(200).json({ exists }); // Return a JSON response
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/addInstallationMeeting", async (req, res) => {
  console.log("Request Body:", req.body); // Log incoming data for debugging

  const { customerID, installerID, date, time, location, meetingType } =
    req.body;

  try {
    const installationID = await addInstallationMeeting(
      customerID,
      installerID,
      date,
      time,
      location,
      meetingType,
    );
    res
      .status(201)
      .json({ message: "ההתקנה הוספה בהצלחה", installationID });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(400).json({ error: error.message });
  }
});

////    מחיקת התקנות שבוצעו
app.delete("/installations/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    const database = client.db("Practicum_Project");
    const installationsCollection = database.collection("InstallationMeetings");

    const result = await installationsCollection.deleteOne({
      _id: new ObjectId(id),
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Installation not found." });
    }

    res.status(200).json({ message: "ההתקנה נמחקה בהצלחה." });
  } catch (error) {
    console.error("Error deleting installation:", error.message);
    res.status(500).json({ error: "שגיאה במחיקת ההתקנה." });
  }
});

////////////////////////////////////////////////////////////////////////
//////////////////////        מכרזים       ////////////////////////////

// קבלת כל המכרזים
app.get("/Tenders", async (req, res) => {
  try {
    const tenders = await getAllTenders();
    res.json(tenders);
  } catch (error) {
    console.error("Error fetching tenders:", error);
    res.status(500).json({ error: "Failed to fetch tenders" });
  }
});

// הוספת מכרז חדש
app.post("/addTender", async (req, res) => {
  const {
    tenderID,
    customerID,
    customerName,
    tenderDate,
    productCategory,
    productID,
    productPrice,
    discription,
  } = req.body;

  try {
    const tenderId = await addTender(
      tenderID,
      customerID,
      customerName,
      tenderDate,
      productCategory,
      productID,
      productPrice,
      discription,
    );
    res.status(201).json({ message: "Tender added successfully", tenderId });
  } catch (error) {
    console.error("Error adding tender:", error);
    res.status(500).json({ error: error.message });
  }
});

// עדכון מכרז
app.put("/Tenders/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedCount = await updateTender(id, updatedData);
    if (updatedCount > 0) {
      res.status(200).json({ message: "Tender updated successfully" });
    } else {
      res.status(404).json({ error: "Tender not found" });
    }
  } catch (error) {
    console.error("Error updating tender:", error);
    res.status(500).json({ error: error.message });
  }
});

// מחיקת מכרז
app.delete("/Tenders/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await deleteTender(id);
    res.status(200).json({ message: "Tender deleted successfully" });
  } catch (error) {
    console.error("Error deleting tender:", error);
    res.status(500).json({ error: error.message });
  }
});

////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////
//////////////////////        משתמשים       ////////////////////////////

////    כל המשתמשים במערכת
app.get("/Users", async (req, res) => {
  try {
    const Users = await getAllUsers(); // Implement this function to fetch all users
    res.json(Users); // Send the users as a JSON response
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

////    שליפת משתץמשים על ידי מספר מזהה
app.delete("/Users/:id", async (req, res) => {
  const UserId = req.params.id;
  await deleteUserById(UserId);
  res.sendStatus(204); // Send success status code
});

////    הסופת משתמשים למערכת
app.post("/add-user", async (req, res) => {
  try {
    const newUser = await addUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Failed to add user" });
  }
});

////    משהו
app.post("/add-partner", async (req, res) => {
  try {
    const newPartner = await addPartner(req.body);
    res.status(201).json(newPartner);
  } catch (error) {
    console.error("Error adding Partner:", error);
    res.status(500).json({ error: "Failed to add Partner" });
  }
});

////    משהו
app.get("/Partners", async (req, res) => {
  try {
    const Partners = await getAllPartners(); // Implement this function to fetch all users
    res.json(Partners); // Send the users as a JSON response
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch Partners" });
  }
});

app.get("/installers", async (req, res) => {
  try {
    const installers = await getInstallers(); // קריאה לפונקציה שמחזירה את נתוני המתקינים
    res.status(200).json(installers); // החזרת הנתונים כ-JSON
  } catch (error) {
    console.error("Error fetching installers data:", error);
    res.status(500).json({ error: "Failed to fetch installers data" });
  }
});

app.get("/getInstallers", async (req, res) => {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("Practicum_Project");
    const installers = await db.collection("Installers").find({}).toArray();
    res.json(installers);
    await client.close();
  } catch (error) {
    res.status(500).json({ error: "בעיה בשליפת מתקינים" });
  }
});

const {
  countCustomers,
  countProducts,
  countMeetings,
} = require("./MongoDB.js");

// נתיב שמחזיר את כמות הלקוחות
app.get("/dashboard-data/customers", async (req, res) => {
  try {
    const customersCount = await countCustomers();
    res.status(200).json({ customersCount });
  } catch (error) {
    console.error("Error fetching customer data:", error);
    res.status(500).json({ error: "Failed to fetch customer data" });
  }
});

// נתיב שמחזיר את כמות המוצרים
app.get("/dashboard-data/products", async (req, res) => {
  try {
    const productsCount = await countProducts();
    res.status(200).json({ productsCount });
  } catch (error) {
    console.error("Error fetching product data:", error);
    res.status(500).json({ error: "Failed to fetch product data" });
  }
});

// נתיב שמחזיר את כמות המתקינים
app.get("/dashboard-data/installers", async (req, res) => {
  try {
    const installersCount = await countInstallers();
    res.status(200).json({ installersCount });
  } catch (error) {
    console.error("Error fetching installers data:", error);
    res.status(500).json({ error: "Failed to fetch installers data" });
  }
});

// נתיב שמחזיר את כמות ההתקנות
app.get("/dashboard-data/Meetings", async (req, res) => {
  try {
    const meetingCount = await countMeetings();
    res.status(200).json({ meetingCount });
  } catch (error) {
    console.error("Error fetching meetings data:", error);
    res.status(500).json({ error: "Failed to fetch meetings data" });
  }
});

// נתיב שמחזיר את כמות המתקינים
app.get("/dashboard-data/products", async (req, res) => {
  try {
    const productsCount = await countProducts();
    res.status(200).json({ productsCount });
  } catch (error) {
    console.error("Error fetching installers data:", error);
    res.status(500).json({ error: "Failed to fetch installers data" });
  }
});

app.get("/dashboard-data/collections", async (req, res) => {
  try {
    const counts = await getCollectionCounts(); // קריאה לפונקציה שמחזירה את הנתונים
    res.status(200).json(counts); // החזרת הנתונים כ-JSON
  } catch (error) {
    console.error("Error fetching collection counts:", error);
    res.status(500).json({ error: "Failed to fetch collection counts" });
  }
});

app.put("/Products/:id/units", async (req, res) => {
  try {
    const productId = req.params.id;
    const { units } = req.body;

    if (typeof units !== "number" || units < 0) {
      return res.status(400).json({ error: "Invalid units value" });
    }

    const success = await updateProductUnits(productId, units);
    if (success) {
      res.status(200).json({ message: "יחידות המוצר עודכנו בהצלחה" });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.error("Error updating product units:", error);
    res.status(500).json({ error: "Failed to update product units" });
  }
});

//// To Do List
// Route to add a new TODO item
app.post("/api/todos", async (req, res) => {
  try {
    const todoItem = req.body;
    const id = await addTodoItem(todoItem);
    res.status(201).json({ id, message: "פריט TODO נוסף בהצלחה!" });
  } catch (error) {
    console.error("Error adding TODO item:", error);
    res.status(500).json({ error: "שגיאה בהוספת פריט TODO" });
  }
});

// Route to get all TODO items
app.get("/api/todos", async (req, res) => {
  try {
    const todoItems = await getTodoItems();
    res.status(200).json(todoItems);
  } catch (error) {
    console.error("Error fetching TODO items:", error);
    res.status(500).json({ error: "Failed to fetch TODO items" });
  }
});

app.delete("/api/todos/:id", async (req, res) => {
  try {
    const todoId = req.params.id; // Extract the ID from the URL
    const success = await deleteTodoItem(todoId); // Call the delete function

    if (success) {
      res.status(200).json({ message: "פריט TODO נמחק בהצלחה!" });
    } else {
      res.status(404).json({ error: "פריט TODO לא נמצא" });
    }
  } catch (error) {
    console.error("Error deleting TODO item:", error);
    res.status(500).json({ error: "Failed to delete TODO item" });
  }
});

// הכנסות ממכירות
app.get("/api/profit-loss/income", async (req, res) => {
  // כאן תוכל לשלוף מה-DB או להחזיר ערך קבוע לדוגמה
  res.json({ income: 250000 });
});

// הוצאות
app.get("/api/profit-loss/expenses", async (req, res) => {
  // כאן תוכל לשלוף מה-DB או להחזיר ערך קבוע לדוגמה
  res.json({ expenses: 120000 });
});

app.post("/api/orders", async (req, res) => {
  try {
      const client = await MongoClient.connect(uri);
      const db = client.db("Practicum_Project");
      const collection = db.collection("OrderRequest");
      await collection.insertOne({
          products: req.body.products,
          date: new Date(),
          status: "חדש"
      });
      client.close();
      res.status(200).json({ message: "הוזמן בהצלחה" });
  } catch (err) {
      res.status(500).json({ error: "שגיאה בשמירת ההזמנה" });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("Practicum_Project");
    const orders = await db.collection("OrderRequest").find({}).toArray();
    await client.close();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "שגיאה בשליפת ההזמנות" });
  }
});

app.get('/api/documents', async (req, res) => {
    const username = req.query.username;
    if (!username) return res.status(400).json({ error: 'Missing username' });

    try {
        const client = await MongoClient.connect(uri);
        const db = client.db('Practicum_Project');
        const docs = await db.collection('Documents').find({ username }).toArray();
        client.close();
        res.json(docs);
    } catch (err) {
        res.status(500).json({ error: 'DB error' });
    }
});

app.get('/api/forms/manager', (req, res) => {
  const formsDir = path.join(__dirname, 'Public', 'src', 'forms', 'Manager');
  fs.readdir(formsDir, (err, files) => {
    if (err) return res.status(500).json({ error: 'Cannot read forms directory' });
    // סנן רק קבצי PDF
    const pdfFiles = files.filter(f => f.toLowerCase().endsWith('.pdf'));
    res.json(pdfFiles);
  });
});

app.get("/getCurtainsProducts", async (req, res) => {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("Practicum_Project");
    const products = await db.collection("Products").find({ Category: "וילונות" }).toArray();
    res.json(products);
    await client.close();
  } catch (error) {
    res.status(500).json({ error: "בעיה בשליפת מוצרים" });
  }
});


app.get("/getCustomerByUserName", async (req, res) => {
  const { username } = req.query;
  try {
    const customer = await getCustomerByUserName(username);
    if (customer) {
      res.json(customer);
    } else {
      res.status(404).json({ error: "לקוח לא נמצא" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



////////////////////////////////////////////////////////////////////////
//////////////////////        הרצת אתר        //////////////////////////

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



