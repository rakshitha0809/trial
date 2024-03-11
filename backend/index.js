const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const AWS = require('aws-sdk');
const fs = require('fs');

const app = express();
const PORT = 8086;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

AWS.config.update({
  accessKeyId: 'YOUR_ACCESS_KEY_ID',
  secretAccessKey: 'YOUR_SECRET_ACCESS_KEY'
});
const s3 = new AWS.S3();

mongoose.connect("YOUR_MONGODB_CONNECTION_STRING")
  .then(() => {
    console.log(`MongoDB Connected on MongoDB Cluster`);
  })
  .catch((err) => {
    console.log(`MongoDB Not Connected Problem: ${err}`);
  });

const studentSchema = new mongoose.Schema({
  name: String,
  branch: String,
  rno: Number,
  image: String
});
const Student = mongoose.model('Student', studentSchema);

// Endpoint to upload data along with image to MongoDB and S3
app.post('/submitdata', upload.single('image'), async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).send('No file uploaded.');
      }
  
      const params = {
        Bucket: 'YOUR_S3_BUCKET_NAME',
        Key: file.originalname,
        Body: file.buffer // Use req.file.buffer directly
      };
  
      const s3Data = await s3.upload(params).promise();
      console.log('File uploaded successfully to S3:', s3Data.Location);
  
      const newStudent = new Student({
        name: req.body.name,
        branch: req.body.branch,
        rno: req.body.rno,
        image: s3Data.Location
      });
      await newStudent.save();
  
      res.status(200).send('File uploaded successfully.');
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).send('Error uploading image.');
    }
  });

// Endpoint to fetch data from MongoDB
app.get('/getdata', async (req, res) => {
  try {
    const data = await Student.find({});
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is connected on ${PORT}`);
});
