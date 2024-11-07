const mongoose = require("mongoose");

const mongoURI = 'mongodb+srv://gofood:Muneeb%409283@cluster0.hyxva.mongodb.net/gofoodmern?retryWrites=true&w=majority&appName=Cluster0';

const mongoDB = async () => {
  try {
    console.log("Connecting to MongoDB...");

    // Connect to MongoDB using async/await
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected");

    // Fetching data from "sample" collection
    const fetched_data = await mongoose.connection.db.collection("sample").find({}).toArray();
    const foodCategory = await mongoose.connection.db.collection("foodCategory").find({}).toArray();

    // Set the data globally if needed
    global.sample = fetched_data;
    global.foodCategory = foodCategory;

    console.log("Fetched Data:", global.sample);
    console.log("Food Category Data:", global.foodCategory);

  } catch (err) {
    console.log("Error: ", err);
  }
};

module.exports = mongoDB;
