exports.sort = (model, defaultSort = {}) => {
    return async (req, res, next) => {
        const sortField = req.query.sortBy || Object.keys(defaultSort)[0];
        const sortOrder = req.query.order || defaultSort[sortField] || 'asc';

        try {
            const results = await model.find().sort({ [sortField]: sortOrder }).exec();
            res.sortedResults = results;
            next();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
};
