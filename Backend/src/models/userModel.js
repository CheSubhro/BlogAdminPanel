
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            lowercase: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email',
            ],
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
            minlength: 6,
            select: false, 
        },
        role: {
            type: String,
            enum: ['Administrator', 'Editor', 'Author', 'Contributor'],
            default: 'Author',
        },
        status: {
            type: String,
            enum: ['Active', 'Suspended', 'Blocked'],
            default: 'Active',
        },
        posts: {
            type: Number,
            default: 0,
        },
        avatar: {
            type: String,
            default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
        },
    },
    {
        timestamps: true, 
    }
);

// --- Password Hashing (Updated Middleware) ---
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
      return; 
  }

  try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
      throw error; 
  }
});

// --- Method: Password Match Check  ---
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;