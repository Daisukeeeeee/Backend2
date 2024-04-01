// const checkAdminRole = (req, res, next) => {
//   if (req.user.role === "admin") {
//     next(); // Continue to the next middleware or route handler
//   } else {
//     res.status(403).json({
//       success: false,
//       error: "Access denied. Only admin users can create a category.",
//     });
//   }
// };

// module.exports = checkAdminRole;




// const isAdmin = (req, res, next) => {
//   // Check if the user has admin role
//   if (req.user && req.user.role === 'admin') {
//     next(); // User is authorized, proceed to the next middleware/route handler
//   } else {
//     res.status(403).json({ message: 'Forbidden' }); // User doesn't have admin role
//   }
// };
