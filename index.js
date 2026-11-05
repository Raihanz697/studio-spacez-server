import express from "express";
import cors from "cors";
import "dotenv/config";
import { MongoClient, ObjectId } from "mongodb";

const app = express();
const port = process.env.PORT || 8000;

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
  }
}

const mongoClient = await connectToMongoDB();
const db = mongoClient.db("studiospace");

// Collections
const studiosCollection = db.collection("studios");
const bookingsCollection = db.collection("bookings");

// Health check
app.get("/", (req, res) => {
  res.send({ message: "StudioSpace Server is running!" });
});

// ================= STUDIOS APIS =================

// ১. Shob studios paowa (Explore Studios page)
app.get("/studios", async (req, res) => {
  try {
    const result = await studiosCollection.find().toArray();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch studios" });
  }
});

// ২. Specific studio details (Studio Details page)
app.get("/studios/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await studiosCollection.findOne(query);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: "Studio not found" });
  }
});

// ৩. Notun studio create (Add Studio page)
app.post("/studios", async (req, res) => {
  try {
    const studioData = req.body;
    const result = await studiosCollection.insertOne(studioData);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to add studio" });
  }
});

// ================= BOOKINGS APIS =================

// ৪. User-er booking list paowa (My Bookings page)
app.get("/bookings", async (req, res) => {
  try {
    const email = req.query.email;
    const query = email ? { userEmail: email } : {};
    const result = await bookingsCollection.find(query).toArray();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch bookings" });
  }
});

// ৫. Notun booking save kora (Reserve Modal theke)[cite: 3]
app.post("/bookings", async (req, res) => {
  try {
    const bookingData = req.body;
    const result = await bookingsCollection.insertOne(bookingData);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to save booking" });
  }
});

// ৬. Booking cancel kora (Cancel Modal theke)[cite: 3]
app.delete("/bookings/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await bookingsCollection.deleteOne(query);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to delete booking" });
  }
});


app.get("/seed-studios", async (req, res) => {
  try {
    const dummyStudios = [
      {
        name: "Lumina Daylight Studio",
        category: "Photography",
        location: "Downtown, Dhaka",
        pricePerHour: 45,
        deposit: 100,
        maxCrew: 15,
        rating: 4.9,
        reviewsCount: 38,
        image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop",
        description: "Floor-to-ceiling windows providing natural, diffused daylight for fashion shoots.",
        createdAt: new Date().toISOString(),
      },
      {
        name: "Echo Chamber Sound Lab",
        category: "Music",
        location: "Gulshan 2, Dhaka",
        pricePerHour: 60,
        deposit: 150,
        maxCrew: 10,
        rating: 4.8,
        reviewsCount: 52,
        image: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?q=80&w=800&auto=format&fit=crop",
        description: "Treated acoustics with SSL consoles, Neumann microphones, and premium monitoring.",
        createdAt: new Date().toISOString(),
      },
      {
        name: "Apex Motion & Dance Studio",
        category: "Dance",
        location: "Dhanmondi, Dhaka",
        pricePerHour: 35,
        deposit: 80,
        maxCrew: 25,
        rating: 4.7,
        reviewsCount: 29,
        image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop",
        description: "Sprung hardwood flooring, full-length mirror walls, and surround sound integration.",
        createdAt: new Date().toISOString(),
      },
      {
        name: "VibeCast Podcast Loft",
        category: "Podcast",
        location: "Banani, Dhaka",
        pricePerHour: 40,
        deposit: 100,
        maxCrew: 8,
        rating: 5.0,
        reviewsCount: 44,
        image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop",
        description: "Multi-camera 4K podcast setup with Shure SM7B mics and customizable RGB backdrops.",
        createdAt: new Date().toISOString(),
      },
      {
        name: "Clay & Canvas Creative Den",
        category: "Art",
        location: "Uttara, Dhaka",
        pricePerHour: 28,
        deposit: 50,
        maxCrew: 12,
        rating: 4.6,
        reviewsCount: 19,
        image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop",
        description: "Spacious fine art and pottery studio with pottery wheels, easels, and kiln access.",
        createdAt: new Date().toISOString(),
      },
      {
        name: "Neon Vault 4K Cinema Soundstage",
        category: "Photography",
        location: "Mirpur DOHS, Dhaka",
        pricePerHour: 135,
        deposit: 150,
        maxCrew: 30,
        rating: 4.9,
        reviewsCount: 61,
        image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop",
        description: "Pre-lit green screen cyclorama wall with ceiling rigging and DMX lighting console.",
        createdAt: new Date().toISOString(),
      },
    ];

    // আগের ফাঁকা বা ডুপ্লিকেট পরিষ্কার করতে চাইলে:
    await studiosCollection.deleteMany({});
    
    // ৬টি স্টুডিও ইনসার্ট করা
    const result = await studiosCollection.insertMany(dummyStudios);
    res.status(200).send({
      message: "6 Studios seeded successfully into MongoDB!",
      insertedCount: result.insertedCount,
    });
  } catch (error) {
    res.status(500).send({ message: "Failed to seed studios", error: error.message });
  }
});

app.listen(port, () => {
  console.log(`StudioSpace server listening on port ${port}`);
});