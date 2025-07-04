import { z } from "zod";

export const supplierRegistrationSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  contactPerson: z.string().min(2, "Contact person must be at least 2 characters"),
  phone: z.string().optional().refine((val) => {
    if (!val) return true;
    const cleaned = val.replace(/[^\d]/g, "");
    return /^\+?[\d\s\-()]{7,}$/.test(val) && cleaned.length >= 7;
  }, "Please enter a valid phone number"),
  companyHouse: z.string().optional(),
  address: z.string().min(5, "Please enter a complete address"),
  country: z.string().min(1, "Please select a country"),
  industry: z.string().min(1, "Please select an industry"),
  otherIndustry: z.string().optional(),
  otherIndustryText: z.string().optional(),
  certifications: z.array(z.string()).optional(),
  otherCertification: z.string().optional(),
  companySize: z.string().min(1, "Please select company size"),
  yearsInBusiness: z
    .string()
    .min(1, "Years in business is required")
    .regex(/^\d+$/, "Only numerical values are allowed")
    .refine(val => {
      const num = Number(val);
      return Number.isInteger(num) && num > 0;
    }, "Enter a valid number of years (must be greater than 0)"),
  turnoverTime: z
    .string()
    .min(1, "Turnover time is required")
    .regex(/^\d+$/, "Only numerical values are allowed")
    .refine(val => {
      const num = Number(val);
      return Number.isInteger(num) && num > 0;
    }, "Enter a valid turnover time in days (must be greater than 0)"),
  description: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to the terms and conditions")
});

export const supplierInviteSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  contactPerson: z.string().min(2, "Contact person must be at least 2 characters"),
  companyHouse: z.string().optional(),
  address: z.string().min(5, "Please enter a complete address"),
  phone: z.string().optional().refine((val) => {
    if (!val) return true;
    const cleaned = val.replace(/[^\d]/g, "");
    return /^\+?[\d\s\-()]{7,}$/.test(val) && cleaned.length >= 7;
  }, "Please enter a valid phone number"),
  industry: z.string().min(1, "Please select an industry"),
  country: z.string().min(1, "Please select a country"),
  otherIndustry: z.string().optional(),
  otherIndustryText: z.string().optional(),
  certifications: z.array(z.string()).optional(),
  otherCertification: z.string().optional(),
  companySize: z.string().optional(),
  yearsInBusiness: z.string().optional(),
  turnoverTime: z.string().optional(),
  description: z.string().optional(),
  agreeToTerms: z.boolean().optional(),
});

export type SupplierRegistrationFormData = z.infer<typeof supplierRegistrationSchema>;
export type SupplierInviteFormData = z.infer<typeof supplierInviteSchema>;
