// Auth controller — register, login, refresh access token, and logout logic.
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateTokens');
const {
  validateName,
  validateEmail,
  validatePassword,
} = require('../utils/validators');

// Cookie options for the refresh token
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

// Helper: hash a refresh token before storing in DB
const hashToken = async (token) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(token, salt);
};

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate name
    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
      throw new ApiError(400, nameValidation.error);
    }

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      throw new ApiError(400, emailValidation.error);
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      throw new ApiError(400, passwordValidation.error);
    }

    const existingUser = await User.findOne({ email: emailValidation.value });
    if (existingUser) {
      throw new ApiError(409, 'Email already registered');
    }

    const user = await User.create({
      name: nameValidation.valid ? name.trim() : name,
      email: emailValidation.value,
      password,
    });

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store hashed refresh token
    const hashedRefresh = await hashToken(refreshToken);
    user.refreshTokens = [hashedRefresh];
    await user.save({ validateModifiedOnly: true });

    // Send refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);

    res.status(201).json({
      success: true,
      accessToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      throw new ApiError(400, emailValidation.error);
    }

    // Validate password presence
    if (!password) {
      throw new ApiError(400, 'Password is required');
    }

    const user = await User.findOne({ email: emailValidation.value }).select(
      '+password +refreshTokens'
    );
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store hashed refresh token (append to array)
    const hashedRefresh = await hashToken(refreshToken);
    user.refreshTokens.push(hashedRefresh);
    await user.save({ validateModifiedOnly: true });

    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);

    res.status(200).json({
      success: true,
      accessToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/refresh — validate refresh cookie, rotate it, issue new access token.
const refresh = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      throw new ApiError(401, 'No refresh token provided');
    }

    // Verify JWT signature
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }

    const user = await User.findById(decoded.id).select('+refreshTokens');
    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    // Check that the token matches one of the stored hashes
    let tokenIndex = -1;
    for (let i = 0; i < user.refreshTokens.length; i++) {
      const isValid = await bcrypt.compare(token, user.refreshTokens[i]);
      if (isValid) {
        tokenIndex = i;
        break;
      }
    }

    if (tokenIndex === -1) {
      // Token reuse detected — clear all refresh tokens (security measure)
      user.refreshTokens = [];
      await user.save({ validateModifiedOnly: true });
      throw new ApiError(401, 'Refresh token is invalid — all sessions revoked');
    }

    // Rotate: remove old, issue new
    user.refreshTokens.splice(tokenIndex, 1);

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    const hashedRefresh = await hashToken(newRefreshToken);
    user.refreshTokens.push(hashedRefresh);
    await user.save({ validateModifiedOnly: true });

    res.cookie('refreshToken', newRefreshToken, REFRESH_COOKIE_OPTIONS);

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/logout — clears the cookie and invalidates the stored refresh token.
const logout = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id).select('+refreshTokens');

        if (user) {
          // Remove the matching hashed token
          const remaining = [];
          for (const hashed of user.refreshTokens) {
            const isMatch = await bcrypt.compare(token, hashed);
            if (!isMatch) remaining.push(hashed);
          }
          user.refreshTokens = remaining;
          await user.save({ validateModifiedOnly: true });
        }
      } catch {
        // Token may already be expired — that's fine, just clear the cookie
      }
    }

    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict', path: '/' });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, refresh, logout };
