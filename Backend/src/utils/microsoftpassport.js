import passport from 'passport';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export const initializeMicrosoftStrategy = () => {
    passport.use(new MicrosoftStrategy({
        clientID: process.env.MICROSOFT_CLIENT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        callbackURL: `${process.env.VITE_API_URL}/api/auth/microsoft/callback`,
        scope: ['user.read', 'profile', 'email', 'openid'],
        tenant: 'common',
        passReqToCallback: true
    }, async (req, accessToken, refreshToken, profile, done) => {
        try {
            console.log('Microsoft auth profile:', {
                id: profile.id,
                emails: profile.emails,
                displayName: profile.displayName
            });

            let existingUser = await User.findOne({
                $or: [
                    { microsoftId: profile.id },
                    { email: profile.emails?.[0]?.value }
                ]
            });

            if (existingUser) {
                console.log('Existing user found:', existingUser.email);
                
                // Update Microsoft-specific fields if they're missing
                if (!existingUser.microsoftId) {
                    existingUser.microsoftId = profile.id;
                    existingUser.authProvider = 'microsoft';
                    await existingUser.save();
                    console.log('Updated existing user with Microsoft ID');
                }
                
                existingUser.lastLogin = new Date();
                await existingUser.save();
                
                return done(null, existingUser);
            }

            console.log('Creating new user from Microsoft profile');
            const salt = await bcrypt.genSalt(10);
            const securePassword = crypto.randomBytes(16).toString('hex');
            const hashedPassword = await bcrypt.hash(securePassword, salt);

            const newUser = new User({
                first_Name: profile.name?.givenName || profile.displayName.split(' ')[0],
                last_Name: profile.name?.familyName || profile.displayName.split(' ')[1] || '',
                email: profile.emails[0].value,
                password: hashedPassword,
                confirm_Password: hashedPassword,
                isVerified: true,
                gender: "not_specified",
                date_of_birth: new Date(),
                phone_number: "not_specified",
                state_of_residence: "not_specified",
                microsoftId: profile.id,
                authProvider: 'microsoft',
                lastLogin: new Date()
            });

            await newUser.save();
            console.log('New user created:', newUser.email);
            return done(null, newUser);
        } catch (error) {
            console.error('Microsoft strategy error:', error);
            return done(error, null);
        }
    }));

    // Add serialization methods
    passport.serializeUser((user, done) => {
        console.log('Serializing user:', user.id);
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            console.log('Deserialized user:', user?.email);
            done(null, user);
        } catch (error) {
            console.error('Deserialize error:', error);
            done(error, null);
        }
    });
};