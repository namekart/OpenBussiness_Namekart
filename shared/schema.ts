import { z } from "zod";
import mongoose from "mongoose";

// --- Validations for API Inputs ---

export const insertUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const insertInquirySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type LoginRequest = z.infer<typeof loginSchema>;

// --- Mongoose Schemas & Models ---

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

// Convert _id to id for seamless replacement
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc: any, ret: any) {
    delete ret._id;
  }
});

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true });

inquirySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc: any, ret: any) {
    delete ret._id;
  }
});

// Avoid OverwriteModelError in hot reloading
export const User = mongoose.models.User || mongoose.model("User", userSchema);
export const Inquiry = mongoose.models.Inquiry || mongoose.model("Inquiry", inquirySchema);

export type UserType = mongoose.InferSchemaType<typeof userSchema> & { id: string };
export type InquiryType = mongoose.InferSchemaType<typeof inquirySchema> & { id: string };
