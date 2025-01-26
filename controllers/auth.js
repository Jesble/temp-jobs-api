import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnauthenticatedError } from '../errors/index.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  // Body destrukturieren
  // Auf Vorhandene und erforderliche Werte prüfen
  // TODO: Passwort wird im Model gehashed!
  // User erstellen
  // TODO: Token wird ebenfalls im Model erstellt.
  console.log('....');
  const { name, email, password } = req.body;
  // if (!name || !email || !password) {
  //   throw new BadRequestError('Please provide name, email and password');
  // }
  const user = await User.create({ ...req.body });
  const token = user.createJWT(); // Im Model!
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials');
  }

  const isPasswordCorrect = await user.comparePaswoord(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials');
  }
  const token = user.createJWT();

  res.status(StatusCodes.OK).json({ name: { name: user.name }, token });
};
