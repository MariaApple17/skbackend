import bcrypt from 'bcrypt';

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

export const hashPassword = async (password) => {
  if (!password) {
    throw new Error('Password is required');
  }

  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password, hash) => {
  if (!password || !hash) {
    return false;
  }

  return bcrypt.compare(password, hash);
};
