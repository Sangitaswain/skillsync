// config/passport.js
import passport from 'passport';
import { Strategy as OAuth2Strategy } from 'passport-google-oauth2';
import User from '../models/user.model.js';

export const initializeGoogleStrategy = () => {  // Changed to named export
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
};

passport.use(new OAuth2Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.VITE_API_URL}${process.env.CALLBACK_URL}`, 
    passReqToCallback: true
}, async (request, accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists by Google ID or email
        let existingUser = await User.findOne({ 
            $or: [
                { googleId: profile.id },
                { email: profile.email }
            ]
        });

        if (existingUser) {
            // Update Google-specific fields if they're missing
            if (!existingUser.googleId) {
                existingUser.googleId = profile.id;
                existingUser.authMethod = 'google';
                await existingUser.save();
            }
            
            // Update last login
            existingUser.lastLogin = new Date();
            await existingUser.save();
            
            return done(null, existingUser);
        }

        // Create new user if doesn't exist
        const newUser = new User({
            first_Name: profile.given_name,
            last_Name: profile.family_name,
            email: profile.email,
            password: profile.id, // Using Google ID as password
            confirm_Password: profile.id,
            isVerified: true, // Google accounts are pre-verified
            gender: "not_specified",
            date_of_birth: new Date(),
            phone_number: "not_specified",
            state_of_residence: "not_specified",
            googleId: profile.id,
            authMethod: 'google',
            lastLogin: new Date()
        });

        await newUser.save();
        return done(null, newUser);
    } catch (error) {
        console.error('Passport strategy error:', error);
        return done(error, null);
    }
}));