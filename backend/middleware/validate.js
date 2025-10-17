const Joi = require('joi');

const schemas = {
  signup: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    dateOfBirth: Joi.date(),
    height: Joi.string(),
    weight: Joi.number(),
    gender: Joi.string(),
    activityLevel: Joi.string(),
    fitnessGoal: Joi.string(),
    phoneNumber: Joi.string()
  }),
  
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    isAdmin: Joi.boolean()
  })
};

module.exports = (schema) => {
  return (req, res, next) => {
    const { error } = schemas[schema].validate(req.body);
    
    if (error) {
      return res.status(400).json({ 
        message: 'Validation error', 
        error: error.details[0].message 
      });
    }
    
    next();
  };
};