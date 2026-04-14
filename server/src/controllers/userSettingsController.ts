import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { UserSettings } from '../models/UserSettings';
import { User } from '../models/User';

// Get user settings
export const getUserSettings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    
    let settings = await UserSettings.findOne({ user: userId });
    
    if (!settings) {
      // Create default settings if none exist
      settings = await UserSettings.create({ user: userId });
    }
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user settings
export const updateUserSettings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const updates = req.body;
    
    let settings = await UserSettings.findOne({ user: userId });
    
    if (!settings) {
      settings = await UserSettings.create({ user: userId, ...updates });
    } else {
      settings = await UserSettings.findOneAndUpdate(
        { user: userId },
        { ...updates },
        { new: true, runValidators: true }
      );
    }
    
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Update user profile
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const { name, department, year } = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { name, department, year },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Change password
export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const isMatch = await bcrypt.compare(currentPassword, user.password as string);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    user.password = hashedPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
