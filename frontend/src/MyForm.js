import React, { useState } from 'react';
import axios from 'axios';

function MyForm() {
  const [formData, setFormData] = useState({
    name: '',
    branch: '',
    rno: '',
    image: null // Store the selected image file
  });
  const [confirmation, setConfirmation] = useState(null);

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      // If the change event is for the image input
      console.log("po");
      setFormData({ ...formData, image: e.target.files[0] }); // Store the selected file
      console.log("po");
    } else {
      // If the change event is for other inputs
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // FormData object to send form data including the image file
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('branch', formData.branch);
    formDataToSend.append('rno', formData.rno);
    formDataToSend.append('image', formData.image); // Append the image file

    // Make a POST request to the Express server
    axios.post('http://localhost:8086/submitdata', formDataToSend)
      .then(response => {
        console.log(response.data);
        // Handle success, reset form, update UI, etc.
        // Show confirmation message
        setConfirmation(`Thank you Mr./Mrs. ${formData.name}, Your Data submitted successfully!`);
        // Reset the form
        setFormData({
          name: '',
          branch: '',
          rno: '',
          image: null // Reset image to null
        });
      })
      .catch(error => {
        setConfirmation(`Error submitting data. Please try again. Mr./Mrs. ${formData.name}`);
        console.error('Error submitting form data:', error);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
        <br />
        <label>
          Branch:
          <input type="text" name="branch" value={formData.branch} onChange={handleChange} />
        </label>
        <br />
        <label>
          Roll Number:
          <input type="text" name="rno" value={formData.rno} onChange={handleChange} />
          {/* console.log("po"); */}
        </label>
        <br />
        <label>
        {/* console.log("po"); */}
          Image:
          <input type="file" name="image" onChange={handleChange} accept="image/*" />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      {confirmation && <p>{confirmation}</p>}
    </div>
  );
}

export default MyForm;
