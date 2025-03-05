import { ethers } from "ethers";
import MEDICAL_ABI from "../abis/MedicalRecords.json";

// Load Web3 Provider
export const loadProvider = (dispatch) => {
  const connection = new ethers.providers.Web3Provider(window.ethereum);
  dispatch({ type: "PROVIDER_LOADED", connection });
  return connection;
};

// Load Blockchain Network
export const loadNetwork = async (provider, dispatch) => {
  const { chainId } = await provider.getNetwork();
  dispatch({ type: "NETWORK_LOADED", chainId });
  return chainId;
};

// Load User Account
export const loadAccount = async (provider, dispatch) => {
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  const account = ethers.utils.getAddress(accounts[0]);
  dispatch({ type: "ACCOUNT_LOADED", account });

  let balance = await provider.getBalance(account);
  balance = ethers.utils.formatEther(balance);
  dispatch({ type: "ETHER_BALANCE_LOADED", balance });

  return account;
};

// Load Medical Records Contract
export const loadMedical = (provider, address, dispatch) => {
  const medical = new ethers.Contract(address, MEDICAL_ABI, provider);
  dispatch({ type: "MEDICAL_LOADED", medical });
  return medical;
};

// Load All Medical Data
export const loadAllData = async (provider, medical, dispatch) => {
  const block = await provider.getBlockNumber();

  // Fetch all medical records
  const medicalStream = await medical.queryFilter("MedicalRecords__AddRecord", 0, block);
  const medicalRecords = medicalStream.map((event) => event.args);
  dispatch({ type: "ALL_MEDICAL_RECORDS", medicalRecords });

  // Fetch all deleted records
  const deleteStream = await medical.queryFilter("MedicalRecords__DeleteRecord", 0, block);
  const deleteRecords = deleteStream.map((event) => event.args);
  dispatch({ type: "ALL_DELETED_RECORDS", deleteRecords });
};

// Submit a New Medical Record with Image Support
export const submitRecord = async (
  name,
  age,
  gender,
  bloodType,
  allergies,
  diagnosis,
  treatment,
  imageUrl, // ✅ Make sure this matches Solidity contract
  provider,
  medical,
  dispatch
) => {
  dispatch({ type: "NEW_RECORD_LOADED" });

  try {
    const signer = await provider.getSigner();

    console.log("🔄 Submitting transaction...");

    const transaction = await medical.connect(signer).addRecord(
      name,
      age,
      gender,
      bloodType,
      allergies,
      diagnosis,
      treatment,
      imageUrl  // ✅ Ensure this is included
    );

    await transaction.wait();

    console.log("✅ Transaction successful!");
    dispatch({ type: "NEW_RECORD_SUCCESS" });
  } catch (error) {
    console.error("❌ Error submitting record:", error);
    dispatch({ type: "NEW_RECORD_FAIL" });
    alert("Transaction failed: " + (error.reason || error.message));
  }
};

// Delete a Medical Record
export const deleteData = async (medical, recordId, dispatch, provider) => {
  dispatch({ type: "DELETE_REQUEST_INITIALIZED" });

  try {
    const signer = await provider.getSigner();
    console.log("🔄 Sending delete transaction...");
    const transaction = await medical.connect(signer).deleteRecord(recordId);
    await transaction.wait();
    
    console.log("✅ Record deleted!");
    dispatch({ type: "DELETE_REQUEST_SUCCESS", recordId });

  } catch (error) {
    console.error("❌ Error deleting record:", error);
    dispatch({ type: "DELETE_REQUEST_FAILED" });
  }
};

// Subscribe to Contract Events for Real-Time Updates
export const subscribeToEvents = async (medical, dispatch) => {
  console.log("👂 Subscribing to blockchain events...");

  medical.on(
    "MedicalRecords__AddRecord",
    (recordId, timestamp, name, age, gender, bloodType, allergies, diagnosis, treatment, imageUrl, event) => {
      console.log("✅ New medical record added:", { name, imageUrl });

      const medicalOrder = {
        recordId,
        timestamp,
        name,
        age,
        gender,
        bloodType,
        allergies,
        diagnosis,
        treatment,
        imageUrl,
      };
      dispatch({ type: "NEW_RECORD_SUCCESS", medicalOrder });
    }
  );

  medical.on(
    "MedicalRecords__DeleteRecord",
    (recordId, timestamp, name, age, gender, bloodType, allergies, diagnosis, treatment, imageUrl, event) => {
      console.log("❌ Medical record deleted:", { recordId });

      dispatch({ type: "DELETE_REQUEST_SUCCESS", recordId });
    }
  );
};
