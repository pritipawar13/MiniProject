const Joi=require('joi');

const authschema=Joi.object({
     name:Joi.string().min(5).max(50).required(),
     lastname:Joi.string().min(5).max(50).required(),
     email: Joi.string().min(5).max(255).email().lowercase().required(),
     password: Joi.string().min(5).max(20).required()
});

module.exports={
    authschema
}