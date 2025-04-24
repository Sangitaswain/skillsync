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
        callbackURL: process.env.NODE_ENV === 'production' 
            ? `${process.env.PRODUCTION_URL}/api/auth/google/callback` 
            : 'http://localhost:5005/api/auth/google/callback',
        passReqToCallback: true
    }, async (request, accessToken, refreshToken, profile, done) => {
        try {
            console.log('Google auth profile data:', {
                id: profile.id,
                email: profile.email,
                name: profile.displayName
            });

            // First check if user exists with the Google ID
            let user = await User.findOne({ googleId: profile.id });
            
            if (user) {
                console.log('Found existing user with Google ID:', user.email);
                user.lastLogin = new Date();
                await user.save();
                return done(null, user);
            }

            // Check if user exists with the same email
            user = await User.findOne({ email: profile.email });

            if (user) {
                console.log('Found existing user with same email:', user.email);
                // If user exists with email but no Google ID, link the accounts
                if (!user.googleId) {
                    user.googleId = profile.id;
                    user.googleProfilePicture = profile.picture;
                    user.googleDisplayName = profile.displayName;
                    user.authProvider = 'google';
                    user.lastLogin = new Date();
                    await user.save();
                    console.log('Linked Google ID to existing account:', user.email);
                }
                return done(null, user);
            }

            console.log('Creating new user from Google profile');
            // Create new user if no existing user found
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(crypto.randomBytes(16).toString('hex'), salt);

            const newUser = new User({
                first_Name: profile.given_name || profile.name.givenName || 'Google',
                last_Name: profile.family_name || profile.name.familyName || 'User',
                email: profile.email,
                password: hashedPassword,
                confirm_Password: hashedPassword,
                isVerified: true,
                googleId: profile.id,
                googleProfilePicture: profile.picture || profile.photos?.[0]?.value,
                googleDisplayName: profile.displayName,
                authProvider: 'google',
                lastLogin: new Date()
            });

            await newUser.save();
            console.log('New Google user created:', newUser.email);
            return done(null, newUser);

        } catch (error) {
            console.error('Passport strategy error:', error);
            return done(error, null);
        }
    }));
};