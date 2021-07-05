const Joi=require('joi');

const authschema=Joi.object({
     firstname:Joi.string().min(5).max(50).required(),
     lastname:Joi.string().min(5).max(50),
     email: Joi.string().min(5).max(255).email().lowercase().required(),
     password: Joi.string().min(5).max(20).required()
});

module.exports={
    authschema
}