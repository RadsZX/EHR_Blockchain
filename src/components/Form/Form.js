import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitRecord } from "../../store/interactions";
import "./form.css"; // Import improved CSS

const Form = () => {
  const provider = useSelector((state) => state.provider.connection);
  const medical = useSelector((state) => state.medical.contract);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [allergies, setAllergies] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setImageUrl(""); // Clear manual input field when file is selected
    } else {
      alert("Please select a valid image file!");
      setImage(null);
      setImagePreview(null);
    }
  };

  const uploadImage = async () => {
    if (!image) return null;

    const formData = new FormData();
    formData.append("file", image);

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        return data.imageUrl;
      } else {
        throw new Error("Image upload failed!");
      }
    } catch (error) {
      console.error("❌ Error uploading image:", error);
      setLoading(false);
      alert("Image upload failed. Please try again.");
      return null;
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    let finalImageUrl = imageUrl; // Use manually entered URL if provided

    if (!finalImageUrl && image) {
      finalImageUrl = await uploadImage(); // Upload and use generated URL
      if (!finalImageUrl) {
        return;
      }
    }

    submitRecord(
      name,
      age,
      gender,
      bloodType,
      allergies,
      diagnosis,
      treatment,
      finalImageUrl, // Store either the uploaded or manually entered image URL
      provider,
      medical,
      dispatch
    );

    // Reset form fields
    setName("");
    setAge("");
    setGender("");
    setBloodType("");
    setAllergies("");
    setDiagnosis("");
    setTreatment("");
    setImage(null);
    setImagePreview(null);
    setImageUrl("");
  };

  return (
    <div className="form-container">
      <form onSubmit={submitHandler}>
        <h1>Patient Details</h1>

        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Age:</label>
        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />

        <label>Gender:</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)} required>
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <label>Blood Type:</label>
        <input type="text" value={bloodType} onChange={(e) => setBloodType(e.target.value)} required />

        <label>Allergies:</label>
        <input type="text" value={allergies} onChange={(e) => setAllergies(e.target.value)} required />

        <label>Diagnosis:</label>
        <input type="text" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} required />

        <label>Treatment:</label>
        <input type="text" value={treatment} onChange={(e) => setTreatment(e.target.value)} required />

        <div className="image-section">
          <label>Upload Image:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />

          <label>OR Enter Image URL:</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setImage(null);
              setImagePreview(null); // Clear file preview when manually entering URL
            }}
            placeholder="https://example.com/image.png"
          />
        </div>

        {imagePreview && (
          <div className="image-preview">
            <h3>Image Preview:</h3>
            <img src={imagePreview} alt="Preview" />
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Form;
