
import { z } from "zod";

export const supplierRegistrationSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  contactPerson: z.string().min(2, "Contact person name must be at least 2 characters"),
  phone: z.string().optional(),
  country: z.string().min(1, "Please select a country"),
  industry: z.string().min(1, "Please select an industry"),
  certifications: z.array(z.string()).optional(),
  delayHistory: z.string().optional(),
  companySize: z.string().optional(),
  yearsInBusiness: z.string().optional(),
  description: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

export type SupplierRegistrationData = z.infer<typeof supplierRegistrationSchema>;
