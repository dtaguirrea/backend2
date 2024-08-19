import Joi from "joi"

export const userDto= Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    age: Joi.number().required(),
    password: Joi.string().required(),
    role: Joi.string().required()
})

export const userDataTransformationDTO = (user) => {
    return {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role
    };
};