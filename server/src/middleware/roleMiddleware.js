const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    // console.log("ROLE MIDDLEWARE: Allowed:", allowedRoles, "User Role:", req.user?.role);
    if (!allowedRoles.includes(req.user.role)) {
      // console.log("ROLE MIDDLEWARE: Access Denied for", req.user?.role);
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

export default roleMiddleware;
