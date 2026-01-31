
import { db } from "../lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

async function deleteHotels() {
  console.log("Starting deletion of all hotels...");
  try {
    const querySnapshot = await getDocs(collection(db, "hotels"));
    
    if (querySnapshot.empty) {
        console.log("No hotels found to delete.");
        return;
    }

    const deletePromises = querySnapshot.docs.map((document) => {
      console.log(`Deleting hotel: ${document.id} - ${document.data().name}`);
      return deleteDoc(doc(db, "hotels", document.id));
    });

    await Promise.all(deletePromises);
    console.log(`Successfully deleted ${deletePromises.length} hotels.`);
  } catch (error) {
    console.error("Error deleting hotels:", error);
  }
}

deleteHotels();
