const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');


module.exports = router;