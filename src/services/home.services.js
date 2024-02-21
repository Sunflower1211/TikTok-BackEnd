const _home = require('../models/home.model');
const _newsfeeds = require('../models/newsfeeds.model');
const _user = require('../models/user.model');
const _posts = require('../models/posts.model');
const { GetRandomElementsFromArray } = require('./ramdom.services');
const { ObjectId } = require('mongodb');

//hàm dùng chung
const getListPosts = async ({ listPosts }) => {
    let data = [];

    for (const item of listPosts) {
        const userPosts = await _user.findOne({ _id: item.posts.userid });
        const posts = {
            ...item.posts,
            account: userPosts.account,
            nickname: userPosts.nickname,
            avatar: userPosts.avatar,
        };
        data.push(posts);
    }

    return data;
};

//trang home
const PutHome = async ({ insertPosts }) => {
    try {
        const user = await _user.find();
        for (const item of user) {
            await _home.create({
                userid: item._id,
                posts: insertPosts,
            });
        }
    } catch (error) {
        console.log(error);
    }
};

const DeleteHome = async ({ postId }) => {
    try {
        const objectId = new ObjectId(postId);
        await _home.deleteMany({ 'posts._id': objectId });
    } catch (error) {
        console.log(error);
    }
};

const ListHome = async ({ userid }) => {
    try {
        const home = await _home.find({ userid: userid, status: false }, { posts: 1, _id: 0 });
        if (!home) {
            return {
                statusCode: 404,
                message: `Not Found newsfeeds`,
            };
        }

        const listPosts = GetRandomElementsFromArray(home, 5);
        let data;

        data = await getListPosts({ listPosts });

        if (data.length <= 0) {
            const listGuest = await ListGuest();
            data = listGuest.data;
        }

        for (const item of data) {
            await _home.updateOne({ _id: item._id }, { status: true });
        }

        return {
            statusCode: 200,
            message: 'success newsfeeds',
            data,
        };
    } catch (error) {
        return {
            error: error,
        };
    }
};

//trang home following
const PutNewsFeeds = async ({ userid, insertPosts }) => {
    try {
        const followers = await _user.findOne({ _id: userid }, { followers: 1 });
        if (followers.followers.length > 0) {
            for (const item of followers.followers) {
                await _newsfeeds.create({
                    userid: item,
                    posts: insertPosts,
                });
            }
            return;
        }
        return;
    } catch (error) {
        console.log(error);
    }
};

const DeleteNewsFeeds = async ({ postId }) => {
    try {
        const objectId = new ObjectId(postId);
        await _newsfeeds.deleteMany({ 'posts._id': objectId });
    } catch (error) {
        console.log(error);
    }
};

const ListNewsFeeds = async ({ userid }) => {
    try {
        const newsfeeds = await _newsfeeds.find({ userid: userid, status: false });
        if (!newsfeeds) {
            return {
                statusCode: 404,
                message: `Not Found newsfeeds`,
            };
        }

        const listPosts = GetRandomElementsFromArray(newsfeeds, 5);

        const data = await getListPosts({ listPosts });

        for (const item of data) {
            await _newsfeeds.updateOne({ _id: item._id }, { status: true });
        }

        return {
            statusCode: 200,
            message: 'success newsfeeds',
            data,
        };
    } catch (error) {
        return {
            error: error,
        };
    }
};

//trang home guest
const ListGuest = async () => {
    try {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const listGuest = await _posts.find({ createdAt: { $gte: oneMonthAgo } });
        const listPosts = GetRandomElementsFromArray(listGuest, 5);

        let data = [];

        for (const item of listPosts) {
            const userPosts = await _user.findOne({ _id: item.userid });
            const posts = {
                ...item._doc,
                account: userPosts.account,
                nickname: userPosts.nickname,
                avatar: userPosts.avatar,
            };
            data.push(posts);
        }

        return {
            statusCode: 200,
            message: 'success',
            data,
        };
    } catch (error) {
        return { error };
    }
};

module.exports = {
    PutHome,
    DeleteHome,
    ListHome,
    PutNewsFeeds,
    DeleteNewsFeeds,
    ListNewsFeeds,
    ListGuest,
};
