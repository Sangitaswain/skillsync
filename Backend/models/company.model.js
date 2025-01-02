
import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
    CompanyName: {
        type: String, 
        required: [true, 'Company name is required'],
        trim: true,
        minlength: [2, 'Company name must be at least 2 characters'],
        maxlength: [100, 'Company name cannot exceed 100 characters']
    },
    CompanyAdress: {
        type: String, 
        required: [true, 'Company address is required'],
        trim: true
    },
    CompanyEmail: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    
    Password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters']
    },

    ConfirmPassword: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return this.Password === v;
            },
            message: 'Passwords do not match'
        }
    },


    IndustryType: {
        type: String,
        required: [true, 'Industry type is required'],
        trim: true
    },
    WhereisyourHeadquarterlocated: {
        type: String,
        required: [true, 'Headquarters location is required'],
        trim: true
    },
    CompanySize: {
        type: String,
        required: [true, 'Company size is required'],
        
    },
    YearofEstablishment: {
        type: String,
        required: [true, 'Year of establishment is required'],
        validate: {
            validator: function(v) {
                return /^\d{4}$/.test(v) && parseInt(v) <= new Date().getFullYear();
            },
            message: 'Please enter a valid year'
        }
    },
    FirstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        minlength: [2, 'First name must be at least 2 characters'],
        maxlength: [50, 'First name cannot exceed 50 characters']
    },
    LastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        minlength: [2, 'Last name must be at least 2 characters'],
        maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    Designation: {
        type: String,
        required: [true, 'Designation is required'],
        trim: true
    },
    Email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    PhoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
    },
    TypicalRoles: {
        type: String,
        required: [true, 'Typical roles are required'],
        trim: true
    },
    AreasofExpertiseSought: {
        type: String,
        required: [true, 'Areas of expertise are required'],
        trim: true
    },
    Companylogo: {
        type: String,
        trim: true
    },
    CompanyWebsite: {
        type: String,
        trim: true,
        match: [/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, 'Please enter a valid URL']
    },
    LinkedinProfile: {
        type: String,
        trim: true,
        match: [/^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/, 'Please enter a valid LinkedIn URL']
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    verificationToken: String,
    verificationTokenExpire: Date
}, {
    timestamps: true
});


const Company = mongoose.model('Company', companySchema);

export default Company;