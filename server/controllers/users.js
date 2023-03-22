import User from "../models/User.js";

export const getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;
    
        let user = await User.findById(id);

        if (!user){
            return res.status(404).json({error: "User not found"});
        }

        user = user.toObject();
        delete user.password;

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

export const getFriendList = async (req, res) => {
    try {
        const { id } = req.params;
    
        const user = await User.findById(id);

        if (!user){
            return res.status(404).json({error: "User not found"});
        }

        delete user.password;

        const friends = await Promise.all(
            user.friends.map(friendId => User.findById(id))
        );

        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupation, location, picturePath}) => {
                return {_id, firstName, lastName, occupation, location, picturePath}
            }
        )

        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

export const addOrRemoveFriend = async (req, res) => {
    try {
        const {id, friendId} = req.params;

        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if(!user){
            return res.status(404).json({error: "User not found"});
        }
        if(!friend){
            return res.status(404).json({error: "Friend not found"});
        }

        if(user.friends.includes(friendId)){
            user.friends = user.friends.filter(item => item !== friendId);
            friend.friends = friend.friends.filter( item => item !== id );
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }

        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map(friendId => User.findById(id))
        );

        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupation, location, picturePath}) => {
                return {_id, firstName, lastName, occupation, location, picturePath}
            }
        )

        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}