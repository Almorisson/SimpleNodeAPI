const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

let userSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true,
		select: false
	},
    role: {
        type: String,
        default: "subscriber"
    }
});

userSchema.methods.encryptPassword = async (password) => {
	const salt = await bcrypt.genSalt(12);
	const hashedPassword = await bcrypt.hash(password, salt);
	return hashedPassword;
};

// Compare two passwords - a hashed one and a non-hashed
userSchema.methods.comparePassword = async function(nonHashedPassword) {
	const result = bcrypt.compare(nonHashedPassword, this.password);
	return result;
};

module.exports = mongoose.model('User', userSchema);
