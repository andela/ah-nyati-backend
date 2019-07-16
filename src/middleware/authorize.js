import { User } from '../db/models';

const authorize = (roles) => {

  return (async (req, res, next) => {
    const id = req.user;

    const { role } = await User.findOne({
      where: {
        id
      }
    });

    const isPermitted = roles.includes(role);
    if (!isPermitted) {
      return res.status(403).json({
        status: 403,
        message: `You don't have permission to perform this request`
      });
    }
    return next();
  });

};

export default authorize;
