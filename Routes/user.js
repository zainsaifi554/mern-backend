import express from 'express';
import HelperFunction from '../HelperFunction/HelperFunction.js';
import User from '../Modals/UserSchema.js';
import middleware from '../Middleware/middleware.js';

const router = express.Router();

router.put('/:id', middleware, async (req, res) => {
    try {
        const userId = req.user._id;
        const updateData = req.body;

        const updataUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        )
        if (!updataUser) return HelperFunction(res, 404, true, null, "User not found");
        HelperFunction(res, 200, false, updataUser, "User updated successfully");
    } catch (err) {
        HelperFunction(res, 500, true, null, "Internal server error");
    }
});

router.delete("/:id", middleware, async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return HelperFunction(res, 401, true, null, "Unauthorized");
        }
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) return HelperFunction(res, 404, true, null, "User Not Found or Already Deleted");

        HelperFunction(res, 200, false, null, "User Deleted Successfully!");
    } catch (error) {
        console.log("Delete Error: " + error);
        HelperFunction(res, 500, true, null, "Error in Deleting User");
    }
});


export default router;