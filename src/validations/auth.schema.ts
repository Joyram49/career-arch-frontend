import { z } from 'zod';
const passwordSchema = z
  .string()
  .trim()
  .min(8, 'Password must be 8 characters long.')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

/* ======================= User registration =========================== */

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, 'First name must be at least 2 charcters long.')
      .max(50, 'First name is too long.'),
    lastName: z
      .string()
      .trim()
      .min(2, 'Last name must be at least 2 characters long.')
      .max(50, 'Last name is too long.'),
    email: z.email('please enter a valid email address'),
    password: passwordSchema,
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      error: 'You must accept the terms and privacy policy',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/* ======================= Organization registration =========================== */
export const registerOrgSchema = z
  .object({
    companyName: z
      .string()
      .trim()
      .min(2, 'Company name must be at least 2 characters long')
      .max(100, 'Company name is too long'),
    email: z.email('Please enter a valid email address'),
    password: passwordSchema,
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      error: 'You must accept the terms and privacy policy',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Password do not match',
    path: ['confirmPassword'],
  });

/* ======================= Login  =========================== */
export const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

/* ======================= Forgot password =========================== */
export const forgotPasswordSchema = z.object({
  email: z.email('Please enter a valid email address'),
});

/* ======================= Reset password =========================== */
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Password do not match',
    path: ['confirmPassword'],
  });

/* ======================= Change password =========================== */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().trim().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    error: 'Password do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must differ from current password',
    path: ['newPassword'],
  });

/* ======================= 2FA OTP =========================== */
export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, 'Code must be exactly 6 digits')
    .regex(/^\d{6}$/, 'Code must contain only digits'),
});

/* ======================= Admin login schema =========================== */
export const adminLoginSchema = z.object({
  email: z.email('enter a valid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

/* ======================= Inferred input values =========================== */
export type RegisterInput = z.infer<typeof registerSchema>;
export type RegisterOrgInput = z.infer<typeof registerOrgSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type OtpInput = z.infer<typeof otpSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
