import * as Joi from 'joi';

export const envValidation = Joi.object({
  MONGO_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  PORT: Joi.number().default(3000),
  RESEND_API_KEY: Joi.string().required(),
  FRONTEND_URL: Joi.string().uri().default('http://localhost:4200'),
  EMAIL_FROM: Joi.string().default('Battle Link <onboarding@resend.dev>'),
});
