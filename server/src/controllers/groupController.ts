import { Request, Response } from 'express';
import { Group } from '../models/Group';

const generateCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const createGroup = async (req: Request, res: Response) => {
  const { name, maxMembers, location, timeSlot, date, seatIds } = req.body;
  const user = (req as any).user;

  try {
    let code: string;
    let isUnique = false;
    // Generate a unique code
    do {
      code = generateCode();
      const existing = await Group.findOne({ code });
      if (!existing) isUnique = true;
    } while (!isUnique);

    const group = await Group.create({
      name,
      code,
      maxMembers: maxMembers || 4,
      creatorId: user._id,
      memberIds: [user._id], // Creator is automatically a member
      ...(location && timeSlot && date ? { nextMeeting: { location, timeSlot, date } } : {}),
      seatIds: seatIds || []
    });

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const joinGroup = async (req: Request, res: Response) => {
  const { code } = req.body;
  const user = (req as any).user;

  try {
    const group = await Group.findOne({ code: code.toUpperCase() });
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (group.memberIds.includes(user._id)) {
      return res.status(400).json({ message: 'You are already in this group' });
    }

    if (group.memberIds.length >= group.maxMembers) {
      return res.status(400).json({ message: 'Group is full' });
    }

    group.memberIds.push(user._id);
    await group.save();

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserGroups = async (req: Request, res: Response) => {
  const user = (req as any).user;
  
  try {
    const groups = await Group.find({ memberIds: user._id }).populate('memberIds', 'name email avatar role');
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllGroupsAdmin = async (req: Request, res: Response) => {
  try {
    const groups = await Group.find({}).populate('memberIds', 'name email avatar role').populate('creatorId', 'name email avatar');
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
