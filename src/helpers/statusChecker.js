const statusChecker = {
  async statusChecker(req, res, status, error, data) {
    switch (status) {
      case 200: // success
        res.status(200);
        return res.json({
          status: 200,
          data,
        });
      case 404: // not found
        res.status(404);
        return res.json({
          status: 404,
          data: error,
        });
      case 400: // Bad request
        res.status(400);
        return res.json({
          status: 400,
          data: error,
        });
      default:
        // do nothing
        break;
    }
  },
};

export default statusChecker;
