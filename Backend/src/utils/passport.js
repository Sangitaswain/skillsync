// passport.js
import passport from 'passport';
import { Strategy as OAuth2Strategy } from 'passport-google-oauth2';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export const initializeGoogleStrategy = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });

    passport.use(new OAuth2Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.VITE_API_URL}${process.env.CALLBACK_URL}`,
        passReqToCallback: true
    }, async (request, accessToken, refreshToken, profile, done) => {
        try {
            // First check if user exists with the Google ID
            let user = await User.findOne({ googleId: profile.id });
            
            if (user) {
                user.lastLogin = new Date();
                await user.save();
                return done(null, user);
            }

            // Then check if user exists with email
            user = await User.findOne({ email: profile.email });

            if (user) {
                // If user exists with email but no Google ID
                if (!user.googleId) {
                    user.googleId = profile.id;
                    user.googleProfilePicture = profile.picture;
                    user.googleDisplayName = profile.displayName;
                    user.authProvider = 'google';
                    user.lastLogin = new Date();
                    await user.save();
                }
                return done(null, user);
            }

            // Create new user if no existing user found
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(crypto.randomBytes(16).toString('hex'), salt);

            const newUser = new User({
                first_Name: profile.given_name,
                last_Name: profile.family_name,
                email: profile.email,
                password: hashedPassword,
                confirm_Password: hashedPassword,
                isVerified: true,
                googleId: profile.id,
                googleProfilePicture: profile.picture,
                googleDisplayName: profile.displayName,
                authProvider: 'google',
                lastLogin: new Date()
            });

            await newUser.save();
            return done(null, newUser);

        } catch (error) {
            console.error('Passport strategy error:', error);
            return done(error, null);
        }
    }));
};