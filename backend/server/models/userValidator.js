const z = require('zod')

//validates when new user creates an account
const newUserValidation = data => { 
  const registerValidationSchema = z.object({
    username : z.string().min(6, 'Username must be 6 characters or more'),
    email: z.string().email('Please Input a valid email'),
    password: z.string().min(8, 'Password must be 8 or more characters').trim(),
    country: z.string().min(2, "Your country must consist of 2 or more characters.").optional(),
    phoneNumber: z.string().min(12, 'A phone number must consist of exactly 12 characters. 10 Numbers and 2 dashes: ###-###-####.').optional(),
    phoneNumber: z.string().max(12, 'A phone number must consist of exactly 12 characters. 10 Numbers and 2 dashes: ###-###-####.').optional(),
    pronoun: z.string().max(30, 'Pronouns can\'t be longer than 30 characters to prevent people from writing whole sentences in them.').optional(),
  });
  
  return registerValidationSchema.safeParse(data)
};

//validate user request when logging in
const userLoginValidation = data => {
  const loginValidationSchema = z.object({
    username : z.string().min(6, 'Username must be 6 characters or more'),
    password: z.string().min(8, 'Password must be 8 or more characters').trim(),
  });
  return loginValidationSchema.safeParse(data)
};

module.exports.newUserValidation = newUserValidation;
module.exports.userLoginValidation = userLoginValidation;