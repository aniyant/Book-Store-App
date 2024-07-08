exports.filter = (model, fields) => {
    return async (req, res, next) => {
        const query = {};
        fields.forEach(field => {
            if (req.query[field]) {
                query[field] = req.query[field];
            }
        });

        try {
            const results = await model.find(query).exec();
            res.filteredResults = results;
            next();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
};
