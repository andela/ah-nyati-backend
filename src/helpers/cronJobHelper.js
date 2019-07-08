import cron from 'node-cron';
import Sequelize from 'sequelize';
import { Blacklist } from '../db/models';

/**
  *
  *@description Finds and deactivate an expired token
  * @static
  * @param {object} res
  * @returns {array}  array of number
  * @memberof findAndDeactivateAllExpiredToken function
  */
export const findAndDeactivateAllExpiredToken = async (res) => {
  const { Op } = Sequelize;
  const date = new Date();
  const expiredDate = date.setDate(date.getDate() - 1);

  try {
    const updatedRows = await Blacklist.update(
      {
        isActive: false
      },
      {
        where: {
          createdAt: {
            [Op.lte]: expiredDate
          }
        }
      }
    );
    return updatedRows;
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'problem deleteting expired token',
    });
  }
};

/**
  *
  *@description Call the findAndDeactivateAllExpiredToken function
  * @static
  * @returns {function}  findAndDeactivateAllExpiredToken function
  * @memberof eraseExpiredToken function
  */
const eraseExpiredToken = () => {
  cron.schedule('0 0 * * *', () => {
    findAndDeactivateAllExpiredToken();
  });
};

export default eraseExpiredToken;
