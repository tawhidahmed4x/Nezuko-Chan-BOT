const { colors } = require('../func/colors.js');

module.exports = (color, message) => {
	// যদি শুধু মেসেজ দেওয়া হয় কালার না থাকে, তবে ডিফল্ট একটা কিউট কালার নেবে
	if (!message) {
		message = color;
		color = "#ff69b4"; // Nezuko Pink Color
	}
	
	const prefix = "🌸 [NEZUKO] => ";
	console.log(colors.hex(color, `${prefix}${message}`));
};
