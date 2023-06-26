const express = require('express');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Travel', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Define a schema for the form data
const formSchema = new mongoose.Schema({
  whereTo: {
    type: String,
    required: true
  },
  howMany: {
    type: Number,
    required: true
  },
  arrivals: {
    type: Date,
    required: true
  },
  leaving: {
    type: Date,
    required: true
  },
  details: String
});

// Create a model based on the schema
const Form = mongoose.model('Form', formSchema);

// Create an Express application
const app = express();

// Enable parsing of JSON data in the request body
app.use(express.json());

// Enable parsing of URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Handle form submission
app.post('/submit-form', async (req, res) => {
  // Validate the submitted data
  const errors = validateForm(req.body);

  // If there are any errors, return an error response
  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  // Create a new form instance based on the submitted data
  const form = new Form(req.body);

  // Save the form data to MongoDB
  await form.save();

  // Log the form submission
  console.log('Form submitted:', form);

  // Return a success response
  res.status(200).json({
    message: 'Form submitted successfully',
    form: form
  });
});

// Define a function to validate the submitted form data
function validateForm(data) {
  const errors = [];

  // Validate the whereTo field
  if (!data.whereTo) {
    errors.push('whereTo is required');
  }

  // Validate the howMany field
  if (!data.howMany) {
    errors.push('howMany is required');
  }

  // Validate the arrivals field
  if (!data.arrivals) {
    errors.push('arrivals is required');
  }

  // Validate the leaving field
  if (!data.leaving) {
    errors.push('leaving is required');
  }

  // Return the list of errors
  return errors;
}

// Start the server
app.listen(3000, () => console.log('Server is listening on port 3000'));
