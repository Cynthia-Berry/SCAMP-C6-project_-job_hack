const config = {
  ADMIN: 'ADMIN',
	CLIENT: 'CLIENT',
	COMPANY: 'COMPANY',
	COMPANY_ADMIN: 'COMPANY_ADMIN',
  SKILL: 'Skill',
  EDUCATION: 'Education',
  JOB: 'Job',
  QUALIFICATION: 'Qualification',
  CATEGORY: 'Category',
  VACANCY: 'Vacancy',
  APPLICATION: 'Application',
  FIELD_ROLE: 'role',
  FIELD_STATUS: 'status',
  FIELD_VERIFIED: 'userVerified',
  FIELD_RECOMMENDED: 'recommended',
  FILE_IMAGE: 'IMAGE',
  FILE_DOCUMENT: 'DOCUMENT',
  BCRYPT_SALT_RATE: 10,
  JWT_EXPIRE_PERIOD: '2d',
  COUNTER: {
    PENDING: "pending",
    SHORTLIST: "shortlisted",
    INVITE: "invite",
    REJECTED: "rejected",
    APPROVED: "approved"
  }
}

module.exports = config;
