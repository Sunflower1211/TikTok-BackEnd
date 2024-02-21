//tìm kiếm
const { SearchLessAccount, SearchMoreAccount } = require('../services/search.services');

class Search {
    async searchAccount(req, res, next) {
        const { q, type } = req.query;
        const query = q.trim();

        if (!query) {
            return res.json({ data: [] });
        }

        if (type === 'less') {
            const { data, error } = await SearchLessAccount({ query });
            if (error) {
                next(error);
            }

            return res.json({ data: data });
        } else {
            const { data, error } = await SearchMoreAccount({ query });
            if (error) {
                next(error);
            }
            return res.json({ data: data });
        }
    }
}

module.exports = new Search();
