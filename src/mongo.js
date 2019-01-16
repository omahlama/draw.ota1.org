import { MongoClient } from "mongodb";

const url = process.env.MONGODB_URI || "mongodb://localhost:27017/drawOta1";

const client = new MongoClient(url);

let id = null;

async function createClient() {
  await client.connect();
  console.log("connected to mongo");
  const db = client.db();
  const pixelsCol = db.collection("pixels");
  const eventsCol = db.collection("drawEvents");

  async function save(data) {
    if (id) {
      try {
        await pixelsCol.updateOne(
          {
            _id: id
          },
          {
            $set: {
              pixels: data,
              timeStamp: Date.now()
            }
          }
        );
      } catch (e) {
        console.error("Error saving pixels", e);
      }
    } else {
      try {
        const result = await pixelsCol.insertOne({
          pixels: data,
          timeStamp: Date.now()
        });
        console.log("insert", result);
        if (result && result.insertedId) {
          id = result.insertedId;
        }
      } catch (e) {
        console.error("Error saving pixels (update)", e);
      }
    }
  }

  async function restore() {
    try {
      const result = await pixelsCol.findOne({ pixels: { $ne: null }});
      if (result && result.pixels) {
        const eventsAfterPixels = await eventsCol.find({
          timeStamp: { $gt: result.timeStamp}
        }).sort({ timeStamp: 1});

        id = result._id;
        console.log("restored with id", id);
        return { pixels: result.pixels, events: eventsAfterPixels };
      } else {
        const eventsAfterPixels = await eventsCol.find({}).sort({ timeStamp: 1});
        return { pixels: null, events: eventsAfterPixels};
      }
    } catch (e) {
      console.error("Error restoring", e);
      return { pixels: null, events: []};
    }
  }

  async function logDraw(x, y, color) {
    await eventsCol.insertOne({
      x,
      y,
      color,
      timeStamp: Date.now()
    });
  }

  return {
    save,
    restore,
    logDraw
  };
}

export default createClient;
