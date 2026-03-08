const admin = require("firebase-admin")
const fs = require("fs")

const serviceAccount = require("./serviceAccountKey.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()

const data = JSON.parse(fs.readFileSync("../../data/wargames.json", "utf8"))

async function importData() {
  for (const game of data) {
    await db.collection("wargames").doc(game.id).set(game)
    console.log("Imported:", game.name)
  }

  console.log("Import finished")
}

importData()