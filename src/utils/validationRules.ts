import type { CompleteProfileFormData, UpdateProfileFormData, PasswordResetFormData, SigninFormData, SignupFormData, PostInternshipFormData } from "./types";

export interface SignInValidationErrors {
    email: string | null;
    password: string | null; }

export interface ShortlistValidationError {
    datetime: string | null;
    location: string | null; }

export interface StudentSignUpValidationErrors {
    firstname: string | null;
    lastname: string | null;
    email: string | null;
    password: string | null;
    confirmpassword: string | null; }

export interface CompanySignUpValidationErrors {
    companyname: string | null;
    industry: string | null;
    email: string | null;
    password: string | null;
    confirmpassword: string | null; }

export interface StudentCPValidationErrors {
    firstname: string | null;
    lastname: string | null;
    address: string | null;
    password: string | null;
    confirmpassword: string | null; }

export interface StudentEPValidationErrors {
    firstname: string | null;
    lastname: string | null;
    address: string | null;
    about: string | null;
    university: string | null;
    course: string | null;
    level: string | null;
    specialty: string | null; }

export interface CompanyEPValidationErrors {
    companyname: string | null;
    industry: string | null;
    address: string | null;
    about: string | null; }

export interface CompanyCPValidationErrors {
    companyname: string | null;
    industry: string | null;
    address: string | null;
    password: string | null;
    confirmpassword: string | null; }

export interface PostInternshipValidationErrors {
    title: string | null;
    description: string | null;
    responsibilities: string | null, 
    requirements: string | null,
    benefits: string | null
    type: string | null;
    duration: string | null;
    deadline: string | null; }

export interface LinksValidationErrors {
    website: string | null;
    linkedin: string | null;
    github: string | null; }

export interface ResetPasswordValidationErrors {
    password: string | null;
    confirmpassword: string | null; }

const isEmpty = (value: string) => !value || value.trim().length === 0;

const validateEmailDetailed = (email: string) => {
    if (isEmpty(email)) return "Email is required.";
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        if (!/@/.test(trimmed)) return 'Email must contain the "@" symbol.';
        const [local, domain] = trimmed.split("@");
        if (!local) return "Email is missing the local part before '@'.";
        if (!domain) return "Email is missing the domain after '@'.";
        if (!/\./.test(domain)) return "Email domain must contain a dot (e.g. example.com).";
        if (/\s/.test(trimmed)) return "Email cannot contain spaces.";
        return "Email format is invalid."; }
    const domain = trimmed.split("@")[1];
    if (domain.length < 3) return "Email domain is too short.";
    const tld = domain.split(".").pop();
    if (!/^[A-Za-z]{2,}$/.test(tld!)) return "Email top-level domain (TLD) looks invalid.";
    return null;}


const validateFirstNameDetailed = (firstname: string): string | null => {
    if (isEmpty(firstname)) return "First name is required.";
    const trimmed = firstname.trim();
    if (trimmed.length < 2) return "First name is too short (minimum 2 characters)!";
    if (trimmed.length > 50) return "First name is too long (maximum 50 characters)!";   
    if (/\d/.test(trimmed)) return "First name cannot contain numbers!";
    const namePattern = /^[\p{L}\p{M}'-]+(?:[ -][\p{L}\p{M}'-]+)*$/u;
    if (!namePattern.test(trimmed)) {
        if (/\s{2,}/.test(trimmed)) return "First name cannot contain consecutive spaces!";
        if (/['-]{2,}/.test(trimmed)) return "First name cannot contain consecutive apostrophes or hyphens!";
        if (/^['-]/.test(trimmed)) return "First name cannot start with a hyphen or apostrophe!";
        if (/['-]$/.test(trimmed)) return "First name cannot end with a hyphen or apostrophe!";
        if (/[^ \p{L}\p{M}'-]/u.test(trimmed)) return "First name contains invalid characters (only letters, spaces, hyphens and apostrophes are allowed)!";
        return "First name format is invalid!";}
    if (/^[-' ]+$/.test(trimmed)) return "First name must contain letters!";
    if (trimmed === trimmed.toUpperCase() && trimmed.length > 1) return "First name appears to be all uppercase!";
    return null;};


const validateCompanyNameDetailed = (companyname: string): string | null => {
    if (isEmpty(companyname)) return "Company name is required.";
    const trimmed = companyname.trim();
    if (trimmed.length > 100) return "Company name is too long (maximum 100 characters)!";    
    if (/\d/.test(trimmed)) return "Company name cannot contain numbers!";
    if (/^[-' ]+$/.test(trimmed)) return "Company name must contain letters!";
    return null;};


const validateAboutDetailed = (about: string): string | null => {
    if (isEmpty(about)) return "About is required.";
    const trimmed = about.trim();
    if (trimmed.length < 20) return "Too small (minimum 20 characters)!";
    if (trimmed.length > 440) return "Too long (maximum 440 characters)!";
    return null;};


const validateUniversityDetailed = (university: string): string | null => {
    if (isEmpty(university)) return "University name is required.";
    const trimmed = university.trim();
    if (trimmed.length > 100) return "University name is too long (maximum 100 characters)!";    
    if (/\d/.test(trimmed)) return "University name cannot contain numbers!";
    const namePattern = /^[\p{L}\p{M}'-]+(?:[ -][\p{L}\p{M}'-]+)*$/u;
    if (!namePattern.test(trimmed)) {
        if (/[^ \p{L}\p{M}'-]/u.test(trimmed)) return "University name contains invalid characters (only letters, spaces, hyphens and apostrophes are allowed)!";
        return "University name format is invalid!";}
    if (/^[-' ]+$/.test(trimmed)) return "University name must contain letters!";
    return null;};


const validateCourseDetailed = (course: string): string | null => {
    if (isEmpty(course)) return "Course name is required.";
    const trimmed = course.trim();
    if (trimmed.length > 50) return "Course name is too long (maximum 50 characters)!";    
    if (/\d/.test(trimmed)) return "Course name cannot contain numbers!";
    const namePattern = /^[\p{L}\p{M}'-]+(?:[ -][\p{L}\p{M}'-]+)*$/u;
    if (!namePattern.test(trimmed)) {
        if (/[^ \p{L}\p{M}'-]/u.test(trimmed)) return "Course name contains invalid characters (only letters, spaces, hyphens and apostrophes are allowed)!";
        return "Course name format is invalid!";}
    if (/^[-' ]+$/.test(trimmed)) return "Course name must contain letters!";
    return null;};


const validateLevelDetailed = (level: string): string | null => {
    if (isEmpty(level)) return "Level is required.";
    return null;};


const validateIndustryDetailed = (industry: string): string | null => {
    if (isEmpty(industry)) return "Industry is required.";
    const trimmed = industry.trim();
    if (trimmed.length > 50) return "Industry is too long (maximum 50 characters)!";    
    if (/\d/.test(trimmed)) return "Industry cannot contain numbers!";
    const namePattern = /^[\p{L}\p{M}'-]+(?:[ -][\p{L}\p{M}'-]+)*$/u;
    if (!namePattern.test(trimmed)) {
        if (/[^ \p{L}\p{M}'-]/u.test(trimmed)) return "Industry contains invalid characters (only letters, spaces, hyphens and apostrophes are allowed)!";
        return "Industry format is invalid!";}
    if (/^[-' ]+$/.test(trimmed)) return "Industry must contain letters!";
    return null;};


const validateInternshipTitleDetailed = (title: string): string | null => {
    if (isEmpty(title)) return "Role Title is required.";
    const trimmed = title.trim();
    if (trimmed.length > 50) return "Role Title is too long (maximum 50 characters)!";    
    if (/\d/.test(trimmed)) return "Role Title cannot contain numbers!";
    if (/^[-' ]+$/.test(trimmed)) return "Role Title must contain letters!";
    return null;};


const validateInternshipDescriptionDetailed = (description: string): string | null => {
    if (isEmpty(description)) return "Role Description is required.";
    const trimmed = description.trim();
    if (trimmed.length < 50) return "Role Description is too short (minimum 50 characters)!";
    if (trimmed.length > 440) return "Role Description is too long (maximum 440 characters)!";
    if (/^[-' ]+$/.test(trimmed)) return "Role Description must contain letters!";
    return null;};


const validateInternshipResponsibilitiesDetailed = (responsibilities: string): string | null => {
    if (isEmpty(responsibilities)) return "Responsibilities entry is required.";
    const trimmed = responsibilities.trim();
    if (trimmed.length < 50) return "Responsibilities entry is too short (minimum 50 characters)!";
    if (trimmed.length > 440) return "Responsibilities entry is too long (maximum 440 characters)!";
    if (/^[-' ]+$/.test(trimmed)) return "Responsibilities entry must contain letters!";
    return null;};


const validateInternshipRequirementsDetailed = (requirements: string): string | null => {
    const trimmed = requirements.trim();
    if (trimmed.length > 440) return "Requirements entry is too long (maximum 440 characters)!";
    if (/^[-' ]+$/.test(trimmed)) return "Requirements entry must contain letters!";
    return null;};


const validateInternshipBenefitsDetailed = (benefits: string): string | null => {
    const trimmed = benefits.trim();
    if (trimmed.length > 440) return "Benefits entry is too long (maximum 440 characters)!";
    if (/^[-' ]+$/.test(trimmed)) return "Benefits entry must contain letters!";
    return null;};


const validateInternshipDurationDetailed = (duration: string): string | null => {
    if (isEmpty(duration)) return "Duration is required.";
    const trimmed = duration.trim();
    if (trimmed.length < 5) return "Duration is too short (minimum 5 characters)!";
    if (trimmed.length > 50) return "Duration is too long (maximum 50 characters)!";
    if (/^[-' ]+$/.test(trimmed)) return "Duration must contain letters!";
    return null;};


const validateInternshipTypeDetailed = (type: string): string | null => {
    if (isEmpty(type)) return "Internship type is required.";
    return null;};    


const validateInternshipDeadlineDetailed = (deadline: string): string | null => {
    if (isEmpty(deadline)) return "Deadline is required.";
    const now = new Date();
    const deadlineDate: Date = new Date(deadline);
    if(deadlineDate < now) return "Deadline must be a date after now!"
    return null;};    


const validateSpecialtyDetailed = (specialty: string): string | null => {
    if (isEmpty(specialty)) return "Specialty is required.";
    const trimmed = specialty.trim();
    if (trimmed.length > 50) return "Specialty is too long (maximum 50 characters)!";    
    if (/\d/.test(trimmed)) return "Specialty cannot contain numbers!";
    const namePattern = /^[\p{L}\p{M}'-]+(?:[ -][\p{L}\p{M}'-]+)*$/u;
    if (!namePattern.test(trimmed)) {
        if (/[^ \p{L}\p{M}'-]/u.test(trimmed)) return "Specialty contains invalid characters (only letters, spaces, hyphens and apostrophes are allowed)!";
        return "Specialty format is invalid!";}
    if (/^[-' ]+$/.test(trimmed)) return "Specialty must contain letters!";
    return null;};


const validateAddressDetailed = (address: string): string | null => {
    if (isEmpty(address)) return "Address is required.";
    const trimmed = address.trim();
    if (trimmed.length > 50) return "Address is too long (maximum 50 characters)!";
    if (/\d/.test(trimmed)) return "Address cannot contain numbers!";
    if ((trimmed.match(/,/g) || []).length !== 1) return "Address must be in the format: City, Country";
    const [city, country] = trimmed.split(",").map(part => part.trim());
    if (!city || !country) return "Address must include both city and country (City, Country)";
    const namePattern = /^[\p{L}\p{M}'-]+(?:[ -][\p{L}\p{M}'-]+)*$/u;
    if (!namePattern.test(city)) return "City contains invalid characters!";
    if (!namePattern.test(country)) return "Country contains invalid characters!";
    if (/^[-' ]+$/.test(city) || /^[-' ]+$/.test(country)) return "City and country must contain letters!";
    return null; };



const validateLastNameDetailed = (lastname: string): string | null => {
    if (isEmpty(lastname)) return "Last name is required.";
    const trimmed = lastname.trim();
    if (trimmed.length < 2) return "Last name is too short (minimum 2 characters)!";
    if (trimmed.length > 50) return "Last name is too long (maximum 50 characters)!";   
    if (/\d/.test(trimmed)) return "Last name cannot contain numbers!";
    const namePattern = /^[\p{L}\p{M}'-]+(?:[ -][\p{L}\p{M}'-]+)*$/u;
    if (!namePattern.test(trimmed)) {
        if (/\s{2,}/.test(trimmed)) return "Last name cannot contain consecutive spaces!";
        if (/['-]{2,}/.test(trimmed)) return "Last name cannot contain consecutive apostrophes or hyphens!";
        if (/^['-]/.test(trimmed)) return "Last name cannot start with a hyphen or apostrophe!";
        if (/['-]$/.test(trimmed)) return "Last name cannot end with a hyphen or apostrophe!";
        if (/[^ \p{L}\p{M}'-]/u.test(trimmed)) return "Last name contains invalid characters (only letters, spaces, hyphens and apostrophes are allowed)!";
        return "Last name format is invalid!"; }
    if (/^[-' ]+$/.test(trimmed)) return "Last name must contain letters!";
    if (trimmed === trimmed.toUpperCase() && trimmed.length > 1) return "Last name appears to be all uppercase!";
    return null;};


const validatePasswordDetailed = (password: string) => {
    const commonPasswords = ["password", "123456", "12345678", "qwerty", "letmein"];
    const minLength: number = 8;
    const requireUpper: boolean = true;
    const requireLower: boolean = true;
    const requireDigit: boolean = true;
    const requireSpecial: boolean = true;
    const disallowCommon: boolean = true;
    if (isEmpty(password)) return "Password is required.";
    if (password.length < minLength) return `Password must be at least ${minLength} characters.`;
    if (requireUpper && !/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter (A–Z).";
    if (requireLower && !/[a-z]/.test(password)) return "Password must contain at least one lowercase letter (a–z).";
    if (requireDigit && !/[0-9]/.test(password)) return "Password must contain at least one digit (0–9).";
    if (requireSpecial && !/[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]/.test(password)) return "Password must contain at least one special character (e.g. !@#$%).";
    if (/\s/.test(password)) return "Password cannot contain spaces.";
    if (disallowCommon && commonPasswords.includes(password.toLowerCase())) return "That password is too common — choose a stronger password.";
    if (/([a-zA-Z0-9])\1\1/.test(password)) return "Avoid using the same character three times in a row.";
    return null; }


const validateGitHubLinkDetailed = (url: string): string | null => {
    if (isEmpty(url)) return null;
    const trimmed = url.trim();
    if (trimmed.length > 255) return "GitHub link is too long (maximum 255 characters)!";
    if (/\s/.test(trimmed)) return "GitHub link cannot contain spaces!";
    if (!/^https?:\/\//.test(trimmed)) return "GitHub link must start with http:// or https://";
    const githubPattern = /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9-]+(\/[A-Za-z0-9._-]+)?\/?$/;
    if (!githubPattern.test(trimmed)) {
        if (!/github\.com/.test(trimmed)) return "GitHub link must be from github.com";
        return "GitHub link format is invalid!"; }
    return null; };



const validateConfirmPasswordDetailed = (password: string, confirmpassword: string) => {
    if(password !== confirmpassword) return "Passwords must be the same!"
    return null; }


const validateWebAddressDetailed = (url: string): string | null => {
    if (isEmpty(url)) return null;
    const trimmed = url.trim();
    if (trimmed.length > 2048) return "Web address is too long (maximum 2048 characters)!";
    if (/\s/.test(trimmed)) return "Web address cannot contain spaces!";
    const urlPattern = /^(https?:\/\/)(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
    if (!urlPattern.test(trimmed)) {
        if (!/^https?:\/\//.test(trimmed)) return "Web address must start with http:// or https://";
        if (/[^a-zA-Z0-9\-._~:/?#\[\]@!$&'()*+,;=%]/.test(trimmed)) return "Web address contains invalid characters!";
        return "Web address format is invalid!"; }
    return null; };


const validateLinkedInLinkDetailed = (url: string): string | null => {
    if (isEmpty(url)) return null;
    const trimmed = url.trim();
    if (trimmed.length > 255) return "LinkedIn link is too long (maximum 255 characters)!";
    if (/\s/.test(trimmed)) return "LinkedIn link cannot contain spaces!";
    if (!/^https?:\/\//.test(trimmed)) return "LinkedIn link must start with http:// or https://";
    const linkedinPattern = /^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/[A-Za-z0-9-_%]+\/?(?:\?.*)?$/;
    if (!linkedinPattern.test(trimmed)) {
        if (!/linkedin\.com/.test(trimmed)) return "LinkedIn link must be from linkedin.com";
        return "LinkedIn link format is invalid!"; }
    return null;
};




export const signInValidationRules = (formdata: SigninFormData) => {
    const errors: SignInValidationErrors = { email: null, password: null };
    errors.email = validateEmailDetailed(formdata.email);
    errors.password = validatePasswordDetailed(formdata.password);
    return errors; }



export const studentSignUpValidationRules = (formdata: SignupFormData) => {
    const errors: StudentSignUpValidationErrors = { firstname: null, lastname: null, email: null, password: null, confirmpassword: null };
    errors.email = validateEmailDetailed(formdata.email);
    errors.password = validatePasswordDetailed(formdata.password);
    errors.firstname = validateFirstNameDetailed(formdata.firstname);
    errors.lastname = validateLastNameDetailed(formdata.lastname);
    errors.confirmpassword = validateConfirmPasswordDetailed(formdata.password, formdata.confirmpassword);
    return errors; }


    
export const companySignUpValidationRules = (formdata: SignupFormData) => {
    const errors: CompanySignUpValidationErrors = { companyname: null, industry: null, email: null, password: null, confirmpassword: null };
    errors.email = validateEmailDetailed(formdata.email);
    errors.password = validatePasswordDetailed(formdata.password);
    errors.companyname = validateCompanyNameDetailed(formdata.companyname);
    errors.industry = validateIndustryDetailed(formdata.industry);
    errors.confirmpassword = validateConfirmPasswordDetailed(formdata.password, formdata.confirmpassword);
    return errors; }


    
export const studentCPValidationRules = (formdata: CompleteProfileFormData) => {
    const errors: StudentCPValidationErrors = { firstname: null, lastname: null, address: null, password: null, confirmpassword: null };
    errors.address = validateAddressDetailed(formdata.address);
    errors.password = validatePasswordDetailed(formdata.password);
    errors.firstname = validateFirstNameDetailed(formdata.firstname);
    errors.lastname = validateLastNameDetailed(formdata.lastname);
    errors.confirmpassword = validateConfirmPasswordDetailed(formdata.password, formdata.confirmpassword);
    return errors; }

    
export const studentEPValidationRules = (formdata: UpdateProfileFormData) => {
    const errors: StudentEPValidationErrors = { firstname: null, lastname: null, address: null, specialty: null, university: null, level: null, course: null, about: null };
    errors.address = validateAddressDetailed(formdata.address);
    errors.about = validateAboutDetailed(formdata.about);
    errors.specialty = validateSpecialtyDetailed(formdata.specialty);
    errors.university = validateUniversityDetailed(formdata.university);
    errors.course = validateCourseDetailed(formdata.course);
    errors.level = validateLevelDetailed(formdata.level);
    errors.firstname = validateFirstNameDetailed(formdata.firstname);
    errors.lastname = validateLastNameDetailed(formdata.lastname);
    return errors; }

    
export const companyEPValidationRules = (formdata: UpdateProfileFormData) => {
    const errors: CompanyEPValidationErrors = { companyname: null, industry: null, address: null, about: null };
    errors.address = validateAddressDetailed(formdata.address);
    errors.about = validateAboutDetailed(formdata.about);
    errors.companyname = validateCompanyNameDetailed(formdata.companyname);
    errors.industry = validateIndustryDetailed(formdata.industry);
    return errors; }


    
export const companyCPValidationRules = (formdata: CompleteProfileFormData) => {
    const errors: CompanyCPValidationErrors = { companyname: null, industry: null, address: null, password: null, confirmpassword: null };
    errors.address = validateAddressDetailed(formdata.address);
    errors.password = validatePasswordDetailed(formdata.password);
    errors.companyname = validateCompanyNameDetailed(formdata.companyname);
    errors.industry = validateIndustryDetailed(formdata.industry);
    errors.confirmpassword = validateConfirmPasswordDetailed(formdata.password, formdata.confirmpassword);
    return errors; }


    
export const postInternshipValidationRules = (formdata: PostInternshipFormData) => {
    const errors: PostInternshipValidationErrors = { title: null, description: null,responsibilities: null, requirements: null, benefits: null, type: null, duration: null, deadline: null };
    errors.title = validateInternshipTitleDetailed(formdata.title);
    errors.description = validateInternshipDescriptionDetailed(formdata.description);
    errors.responsibilities = validateInternshipResponsibilitiesDetailed(formdata.responsibilities);
    errors.requirements = validateInternshipRequirementsDetailed(formdata.requirements);
    errors.benefits = validateInternshipBenefitsDetailed(formdata.benefits);
    errors.type = validateInternshipTypeDetailed(formdata.type);
    errors.duration = validateInternshipDurationDetailed(formdata.duration);
    errors.deadline = validateInternshipDeadlineDetailed(formdata.deadline);
    return errors; }

    
export const LinksValidationRules = (formdata: CompleteProfileFormData) => {
    const errors: LinksValidationErrors = { website: null, github: null, linkedin: null };
    errors.website = validateWebAddressDetailed(formdata.website);
    errors.github = validateGitHubLinkDetailed(formdata.github);
    errors.linkedin = validateLinkedInLinkDetailed(formdata.linkedin);
    return errors; }



export const forgotPasswordValidationRules = (email: string) => {
    const error = validateEmailDetailed(email);
    return error; }



export const resetPasswordValidationRules = (formdata: PasswordResetFormData) => {
    const errors: ResetPasswordValidationErrors = { password: null, confirmpassword: null };
    errors.password = validatePasswordDetailed(formdata.password);
    errors.confirmpassword = validateConfirmPasswordDetailed(formdata.password, formdata.confirmpassword);
    return errors; }