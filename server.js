const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const uri = "mongodb+srv://eladt1010:9wRHk5BLfmqRrQb3@practicumproject.rimn0.mongodb.net/?retryWrites=true&w=majority&appName=PracticumProject";
const app = express();
const port = 4000;
const {
  loginUser,
  filterAssets,
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
  addCustomer,
  filterAssetsForManager,
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
} = require("./MongoDB");

app.use(express.static("public"));
app.use(express.json());
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "eladt1010@gmail.com",
    pass: "password"
    //user: "nofar.shamir7@gmail.com",
    //pass: "shebnouqreidnctk",
  },
});

///////////////////          דף הבית           //////////////////////////
app.get("/", (req, res) => {
  //res.send("Hello from the root URL!");
  res.sendFile(path.join(__dirname, 'index.html'));
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
  } = req.body;

  try {
    const customerId = await addCustomer(
      customerID,
      fullName,
      phone,
      email,
      joinDate,
      customerType,
      UserName
    );
    res
      .status(201)
      .json({ message: "Customer added successfully", customerId });
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

////    משהו
app.get("/CustomerAssets", async (req, res) => {
  const {
    assetType,
    assetPriceMin,
    assetPriceMax,
    roomNumber,
    assetStreetNumber,
    assetStreet,
  } = req.query;

  try {
    const filteredAssets = await filterAssets(
      assetType,
      assetPriceMin,
      assetPriceMax,
      assetStreet,
      assetStreetNumber,
      roomNumber
    );
    res.json(filteredAssets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

////    משהו
app.get("/CustomerAssetsForManager", async (req, res) => {
  const {
    assetType,
    assetCity,
    assetPriceMin,
    assetPriceMax,
    roomNumber,
    assetStreetNumber,
    assetStreet,
  } = req.query;

  try {
    const filteredAssets = await filterAssetsForManager(
      assetType,
      assetCity,
      assetPriceMin,
      assetPriceMax,
      assetStreet,
      assetStreetNumber,
      roomNumber
    );
    res.json(filteredAssets); // Return filtered assets as JSON response
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle any errors
  }
});

////    חוות דעת לקוחות
app.get("/feedback", async (req, res) => {
  const feedback = await getFeedback();
  res.json(feedback);
});

////    הוספת חוות דעת
app.post("/addFeedback", async (req, res) => {
  const feedbackData = req.body; // Data sent from the form on the client side

  try {
    const username = feedbackData.Username;
    const result = await addFeedback(username, feedbackData);
    res.status(201).json({ message: "Feedback added successfully!" });
  } catch (error) {
    if (error.message.includes("Customer not found")) {
      res
        .status(404)
        .json({
          error:
            "Your Customer ID is not found. Please register as a customer to add a feedback.",
        });
    } else if (error.message.includes("haven't made a deal")) {
      res
        .status(404)
        .json({
          error: "You still haven't made a deal. A feedback hasn't been added.",
        });
    } else {
      console.error("Error adding feedback to database:", error);
      res.status(500).json({ error: "Failed to add feedback to the database" });
    }
  }
});

////    פנייה לחברה ע״י האתר
app.post("/submitMessage", async (req, res) => {
  const formData = req.body;

  try {
    const emailContent = `
          Name: ${formData.Name}
          Email: ${formData.Email}
          Phone:${formData.Phone}
          Message: ${formData.Message}
      `;

    const mailOptions = {
      from: "eladt1010@@gmail.com",
      to: "eladt1010@gmail.com",
      subject: "New Message Received",
      text: emailContent,
    };

    await transporter.sendMail(mailOptions);

    console.log("message email sent successfully");

    res.json({ message: "message submitted successfully!" });
  } catch (error) {
    console.error("Error sending message email:", error);
    res.status(500).json({ error: "Failed to send message email" });
  }
});

////    משהו
app.get("/AssetsForCustomer", async (req, res) => {
  try {
    const assets = await getAvailableAssets(); // Implement this function to fetch all users
    res.json(assets); // Send the users as a JSON response
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

////    קבלת לקוחות מבסיס הנתונים
app.get("/getCustomers", async (req, res) => {
  try {
    const Customers = await getAllCustomers(); // Implement this function to fetch all users
    res.json(Customers); // Send the users as a JSON response
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch Customers" });
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
      res.status(404).json({ error: "Customer not found" }); // Return a 404 error if customer not found
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
      return res.status(400).json({ error: "Username not provided" });
    }

    const meetings = await getMeetingsByUsername(username);
    res.json(meetings);
  } catch (error) {
    console.error("Error fetching meetings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


////////////////////////////////////////////////////////////////////////
//////////////////////        מוצרים       /////////////////////////////

////    הוספת מוצר חדש
app.post("/addNewProduct", async (req, res) => {
  const { ProductType, ProductPrice, ProductionDate, ProductDescription, ProductImage } = req.body;

  try {
      const productId = await addNewProduct(
          ProductType,
          ProductPrice,
          ProductionDate,
          ProductDescription,
          ProductImage
      );
      res.status(201).json({ message: "Product added successfully", productId });
  } catch (error) {
      console.error("Error adding product:", error);
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
      PartnerUserName
    );
    res.status(201).json({ message: "Deals added successfully", deal });
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
      assetImage
    );
    res
      .status(201)
      .json({ message: "Property updated successfully", propertyId });
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
      res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.put("/Products/:id", async (req, res) => {
  console.log("Received PUT request to update product");
  console.log("Params ID:", req.params.id);
  console.log("Request body:", req.body);

  try {
    const { ProductID, ProductType, ProductPrice, ProductionDate, ProductDescription, ProductImage } = req.body;
    const updatedCount = await updateProduct(
      req.params.id,
      ProductID,
      ProductType,
      ProductPrice,
      ProductionDate,
      ProductDescription,
      ProductImage
    );

    console.log("Updated count:", updatedCount);

    if (updatedCount > 0) {
      res.status(200).send({ message: "Product updated successfully!" });
    } else {
      res.status(404).send({ message: "Product not found or no updates were made." });
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
    res.status(500).json({ error: "Failed to fetch deals" });
  }
});

////////////////////////////////////////////////////////////////////////
//////////////////////        מתקינים       ////////////////////////////

app.get("/installations", async (req, res) => {
  let client; // Declare client outside the try block
  try {
      client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      await client.connect();

      const database = client.db("Practicum_Project");
      const installationsCollection = database.collection("InstallationMeetings");

      // Fetch all installations
      const installations = await installationsCollection.find({}).toArray();
      console.log("Installations fetched successfully:", installations);
      res.status(200).json(installations); // Send data as JSON
  } catch (error) {
      console.error("Error fetching installations:", error.message);
      res.status(500).json({ error: "Failed to fetch installations." });
  } finally {
      if (client) await client.close(); // Safely close the client
  }
});

app.put("/installations/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
      const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      await client.connect();

      const database = client.db("Practicum_Project");
      const installationsCollection = database.collection("InstallationMeetings");

      const result = await installationsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedData }
      );

      if (result.matchedCount === 0) {
          return res.status(404).json({ error: "Installation not found." });
      }

      res.status(200).json({ message: "Installation updated successfully." });
  } catch (error) {
      console.error("Error updating installation:", error.message);
      res.status(500).json({ error: "Failed to update installation." });
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
      return res.status(400).json({ error: "Customer does not exist" });
    }

    const meetingId = await addMeeting(
      customerID,
      date,
      time,
      location,
      partner,
      meetingType,
      assetSelect
    );
    res.status(201).json({ message: "Meeting added successfully", meetingId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

////    התקנות במערכת
app.get("/meetings", async (req, res) => {
  try {
    const meetings = await getAllMeetings();
    res.json(meetings);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch meetings" });
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

  const { customerID, installerID, date, time, location, meetingType } = req.body;

  try {
      const installationID = await addInstallationMeeting(
          customerID,
          installerID,
          date,
          time,
          location,
          meetingType
      );
      res.status(201).json({ message: "Installation added successfully", installationID });
  } catch (error) {
      console.error("Error:", error.message);
      res.status(400).json({ error: error.message });
  }
});

////    מחיקת התקנות שבוצעו
app.delete("/installations/:id", async (req, res) => {
  const { id } = req.params;

  try {
      const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      await client.connect();

      const database = client.db("Practicum_Project");
      const installationsCollection = database.collection("InstallationMeetings");

      const result = await installationsCollection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
          return res.status(404).json({ error: "Installation not found." });
      }

      res.status(200).json({ message: "Installation deleted successfully." });
  } catch (error) {
      console.error("Error deleting installation:", error.message);
      res.status(500).json({ error: "Failed to delete installation." });
  }
});








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

////////////////////////////////////////////////////////////////////////
//////////////////////        הרצת אתר        //////////////////////////

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
