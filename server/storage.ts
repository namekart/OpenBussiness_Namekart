import { User, Inquiry, type UserType, type InquiryType, type InsertUser, type InsertInquiry } from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<UserType | undefined>;
  getUserByEmail(email: string): Promise<UserType | undefined>;
  createUser(user: InsertUser): Promise<UserType>;
  createInquiry(inquiry: InsertInquiry): Promise<InquiryType>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<UserType | undefined> {
    const user = await User.findById(id).lean();
    return user as UserType | undefined;
  }

  async getUserByEmail(email: string): Promise<UserType | undefined> {
    const user = await User.findOne({ email }).lean();
    return user as UserType | undefined;
  }

  async createUser(insertUser: InsertUser): Promise<UserType> {
    const user = await User.create(insertUser);
    return user.toJSON() as UserType;
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<InquiryType> {
    const inquiry = await Inquiry.create(insertInquiry);
    return inquiry.toJSON() as InquiryType;
  }
}

export const storage = new DatabaseStorage();
