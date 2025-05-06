import user from "../models/user.js";

const categories = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you have the user ID from the token in req.user
        const userData = await user.findById(userId).select('newsPreferences');
        
        if (!userData) {
        return res.status(404).json({ message: 'User not found' });
        }
    
        res.status(200).json(userData.newsPreferences);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

export { categories };