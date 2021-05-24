let {sessions,users, sendEventsToAll} = require('./server')
const Realm = require("realm");

async function main() {
  try {
    const observableCollections = ["advisers", "messages", "queue-messages"];

    const app = new Realm.App({ id: "realm-test-nareb" });

    const credentials = Realm.Credentials.emailPassword('felipe.mantilla@kbe.ai','Keybe2021')
    // You can log in with any set of credentials using `app.logIn()`
    const user = await app.logIn(credentials);
    console.log(`Logged in with the user id: ${user.id}`);

    const mongodb = app.currentUser.mongoClient("mongodb-atlas");

    const filter = {
      // 'fullDocument.roomId': new Realm.BSON.ObjectId(this.selectedRoom)
      // // 'fullDocument.appUUID': this.roomInfo.appUUID,
      // // 'fullDocument.userGuest': this.roomInfo.userGuest
    };

    observableCollections.forEach(async (collection) => {
      try {
        createObserver(mongodb, collection, filter);
      } catch (error) {
        console.log(error.message);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
}

main();

async function createObserver(mongodb, collection, filter) {
  console.log(`Creating watcher for ${collection}`);
  try {
    const collectionToObserve = mongodb.db("keybe-conversations").collection(collection);
    for await (const changes of collectionToObserve.watch({ filter })) {
      console.log(changes);
      handleEvents(collection, changes)
    }
  } catch (error) {
    console.log(error.message);
  }
}

async function handleEvents(collection, changes) {
  sendEventsToAll(collection, changes)
}

// setTimeout(() => {
//     users.push({firstName:'hola', lastName:'mundo'})
//     sendEventsToAll({firstName:'hola', lastName:'mundo'})
// }, 5000);
