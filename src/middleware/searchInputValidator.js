 const validateSearchInput = (req, res, next) => {
    let {
        author, title: Title, category, tag: tagName, q
      } = req.query;

      if (author) {
        author = author.trim();
        if (author.length < 3) {
          return res.status(400).json({
            status: 400,
            message: 'Your search input must be greater than 3 letters'
          });
        }
    } else if (Title) {
        Title = Title.trim();
        if (Title.length < 3) {
          return res.status(400).json({
            status: 400,
            message: 'Your search input must be greater than 3 letters'
          });
        }
    } else if (category) {
        category = category.trim();
        if (category.length < 3) {
          return res.status(400).json({
            status: 400,
            message: 'Your search input must be greater than 3 letters'
          });
        }
    } else if (tagName) {
        tagName = tagName.trim();
        if (tagName.length < 3) {
          return res.status(400).json({
            status: 400,
            message: 'Your search input must be greater than 3 letters'
          });
        }
    }
    else if (q) {
        q = q.trim();
        if (q.length < 3) {
          return res.status(400).json({
            status: 400,
            message: 'Your search input must be greater than 3 letters'
          });
        }
    }
    return next()
 };

 export default validateSearchInput;
