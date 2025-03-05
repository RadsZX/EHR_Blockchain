const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MedicalRecords", () => {
  let user1, medical, transactionResponse, transactionReceipt;

  beforeEach(async () => {
    const [deployer, account1] = await ethers.getSigners();
    user1 = account1;

    const Medical = await ethers.getContractFactory("MedicalRecords");
    medical = await Medical.connect(user1).deploy();
  });

  describe("Deployment", () => {
    it("The contract is deployed successfully", async () => {
      expect(await medical.address).to.not.equal(0);
    });
  });

  describe("Add Record", () => {
    beforeEach(async () => {
      transactionResponse = await medical.addRecord(
        "Wastron", // _name
        22, // _age
        "Male", // _gender
        "B positive", // _bloodType
        "Dengue", // _allergies
        "Dengue", // _diagnosis
        "Dengue", // _treatment
        "ipfs://some-image-url" // _imageUrl (Added the missing 8th argument)
      );
      transactionReceipt = await transactionResponse.wait();
    });

    it("Emits an Add Record event", async () => {
      const event = transactionReceipt.events[0];
      expect(event.event).to.equal("MedicalRecords__AddRecord");

      const args = event.args;
      expect(args.timestamp).to.not.equal(0);
      expect(args.name).to.equal("Wastron");
      expect(args.age).to.equal(22);
      expect(args.gender).to.equal("Male");
      expect(args.bloodType).to.equal("B positive");
      expect(args.allergies).to.equal("Dengue");
      expect(args.diagnosis).to.equal("Dengue");
      expect(args.treatment).to.equal("Dengue");
      expect(args.imageUrl).to.equal("ipfs://some-image-url"); // Check the new field
    });

    it("The getRecords function is working", async () => {
      const recordId = await medical.getRecordId();
      const [
        timestamp,
        name,
        age,
        gender,
        bloodType,
        allergies,
        diagnosis,
        treatment,
        imageUrl,
      ] = await medical.getRecord(recordId);

      expect(recordId).to.equal(1);
      expect(timestamp).to.not.equal(0);
      expect(name).to.equal("Wastron");
      expect(age).to.equal(22);
      expect(gender).to.equal("Male");
      expect(bloodType).to.equal("B positive");
      expect(allergies).to.equal("Dengue");
      expect(diagnosis).to.equal("Dengue");
      expect(treatment).to.equal("Dengue");
      expect(imageUrl).to.equal("ipfs://some-image-url"); // Verify the new argument
    });
  });

  describe("Delete Record", () => {
    beforeEach(async () => {
      transactionResponse = await medical.addRecord(
        "Wastron",
        22,
        "Male",
        "B positive",
        "Dengue",
        "Dengue",
        "Dengue",
        "ipfs://some-image-url"
      );
      transactionReceipt = await transactionResponse.wait();

      transactionResponse = await medical.deleteRecord(1);
      transactionReceipt = await transactionResponse.wait();
    });

    it("The record is deleted", async () => {
      expect(await medical.getDeleted(1)).to.be.equal(true);
    });

    it("Emits a Delete Record event", async () => {
      const event = transactionReceipt.events[0];
      expect(event.event).to.equal("MedicalRecords__DeleteRecord");

      const args = event.args;
      expect(args.timestamp).to.not.equal(0);
      expect(args.name).to.equal("Wastron");
      expect(args.age).to.equal(22);
      expect(args.gender).to.equal("Male");
      expect(args.bloodType).to.equal("B positive");
      expect(args.allergies).to.equal("Dengue");
      expect(args.diagnosis).to.equal("Dengue");
      expect(args.treatment).to.equal("Dengue");
      expect(args.imageUrl).to.equal("ipfs://some-image-url"); // Ensure it carries over
    });
  });
});
