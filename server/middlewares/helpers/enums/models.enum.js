const Genders = Object.freeze({
	MALE: 'male',
	FEMALE: 'female',
	OTHER: 'other',
});

const Portfolio = Object.freeze({
	WEBSITE: 'WEBSITE',
	GITHUB: 'GITHUB',
	BITBUCKET: 'BITBUCKET',
	STACKOVERFLOW: 'STACKOVERFLOW',
	LINKEDIN: 'LINKEDIN',
	FIGMA: 'FIGMA',
	DRIBBLE: 'DRIBBLE',
});

const documentType = Object.freeze({
	CV: 'CV',
	PORTFOLIO: 'PORTFOLIO',
	COVER_LETTER: 'COVER_LETTER',
	CERTIFICATION: 'CERTIFICATION',
	OTHERS: 'OTHERS',
});

const WorkType = Object.freeze({
  ONSITE: 'ONSITE',
  HYBRID: 'HYBRID',
  REMOTE: 'REMOTE'
});

const JobStatus = Object.freeze({
	PENDING: 'PENDING',
	SHORTLIST: 'SHORTLIST',
	INVITE: 'INVITE',
	APPROVED: 'APPROVED',
	REJECTED: 'REJECTED',
});

module.exports = {Genders, Portfolio, documentType, WorkType, JobStatus};

