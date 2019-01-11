import { MongoClient } from "mongodb";

const url = process.env.MONGODB_URI || "mongodb://localhost:27017/drawOta1";

const client = new MongoClient(url);

let id = null;

const createClient = callback => {
  client.connect(function(err, client) {
    console.log("connected to mongo");
    const db = client.db();
    const pixelsCol = db.collection("pixels");
    const eventsCol = db.collection("drawEvents");

    const save = data => {
      if (id) {
        pixelsCol.updateOne(
          {
            _id: id
          },
          {
            $set: {
              pixels: data
            }
          }
        );
      } else {
        pixelsCol.insertOne(
          {
            pixels: data
          },
          (err, result) => {
            console.log("insert", err, result);
            if (result && result.insertedId) {
              id = result.insertedId;
            }
          }
        );
      }
    };

    const restore = cb => {
      pixelsCol.findOne({}).then(
        result => {
          console.log("restored", result);
          if (result && result.pixels) {
            id = result._id;
            console.log("restored with id", id);
            cb(result.pixels);
          } else {
            cb(null);
          }
        },
        () => cb(null)
      );
    };

    const logDraw = (x, y, color) => {
      eventsCol.insertOne({
        x,
        y,
        color,
        timeStamp: Date.now()
      });
    };

    callback({
      save,
      restore,
      logDraw
    });
  });
};

export default createClient;
