
import { DropdownOption } from './types';

export const PLATFORM_OPTIONS: DropdownOption[] = [
  { value: 'Website Blog Post', label: 'Website Blog Post' },
  { value: 'LinkedIn Article', label: 'LinkedIn Article' },
  { value: 'Instagram Caption', label: 'Instagram Caption' },
  { value: 'TikTok Script', label: 'TikTok Script' },
  { value: 'Facebook Post', label: 'Facebook Post' },
  { value: 'eCommerce Product Description', label: 'eCommerce Product Description' },
  { value: 'Twitter / X Post', label: 'Twitter / X Post' },
  { value: 'Pinterest Pin Description', label: 'Pinterest Pin Description' },
  { value: 'YouTube Video Script', label: 'YouTube Video Script' },
  { value: 'Email Newsletter', label: 'Email Newsletter' },
  { value: 'Reddit Post', label: 'Reddit Post' },
  { value: 'Quora Answer', label: 'Quora Answer' },
  { value: 'Medium Story', label: 'Medium Story' },
  { value: 'Press Release', label: 'Press Release' },
  { value: 'Ad Copy (Google/Facebook)', label: 'Ad Copy (Google/Facebook)' },
  { value: 'Podcast Script', label: 'Podcast Script' },
];

export const TONE_OPTIONS: DropdownOption[] = [
  { value: 'Professional', label: 'Professional' },
  { value: 'Formal & Academic', label: 'Formal & Academic' },
  { value: 'Authoritative & Confident', label: 'Authoritative & Confident' },
  { value: 'Conversational', label: 'Conversational' },
  { value: 'Casual & Friendly', label: 'Casual & Friendly' },
  { value: 'Empathetic & Supportive', label: 'Empathetic & Supportive' },
  { value: 'Inspirational & Motivational', label: 'Inspirational & Motivational' },
  { value: 'Storytelling', label: 'Storytelling' },
  { value: 'Nostalgic', label: 'Nostalgic' },
  { value: 'Witty & Humorous', label: 'Witty & Humorous' },
  { value: 'Playful & Creative', label: 'Playful & Creative' },
  { value: 'Sarcastic & Ironic', label: 'Sarcastic & Ironic' },
  { value: 'Persuasive & Compelling', label: 'Persuasive & Compelling' },
  { value: 'Urgent & Direct', label: 'Urgent & Direct' },
  { value: 'Minimalist & To-the-point', label: 'Minimalist & To-the-point' },
];

export const WORD_COUNT_OPTIONS: DropdownOption[] = [
  { value: '50', label: 'Under 50 words (Tweet)' },
  { value: '150', label: 'Under 150 words (Short Post)' },
  { value: '300', label: 'Around 300 words (Quick Update)' },
  { value: '500', label: 'Around 500 words (Standard Post)' },
  { value: '1000', label: 'Around 1000 words (Article)' },
  { value: '1500', label: 'Around 1500 words (Long Article)' },
  { value: '2000', label: 'Around 2000 words (Deep Dive)' },
  { value: '2500', label: 'Around 2500 words (Guide)' },
];

export const PERSONA_OPTIONS: DropdownOption[] = [
  { value: 'Thought Leader', label: 'Thought Leader' },
  { value: 'Industry Expert', label: 'Industry Expert' },
  { value: 'Founder / CEO', label: 'Founder / CEO' },
  { value: 'Comedian / Entertainer', label: 'Comedian / Entertainer' },
  { value: 'Journalist / Reporter', label: 'Journalist / Reporter' },
  { value: 'Storyteller', label: 'Storyteller' },
  { value: 'Educator / Teacher', label: 'Educator / Teacher' },
  { value: 'Coach / Mentor', label: 'Coach / Mentor' },
  { value: 'Enthusiast / Hobbyist', label: 'Enthusiast / Hobbyist' },
  { value: 'Skeptic / Critic', label: 'Skeptic / Critic' },
  { value: 'Friendly Peer', label: 'Friendly Peer' },
  { value: 'Inspirational Figure', label: 'Inspirational Figure' },
];

export const PROMOTION_LEVEL_OPTIONS: DropdownOption[] = [
  { value: '0', label: '0% - No Promotion' },
  { value: '10', label: '10% - Subtle Mention' },
  { value: '25', label: '25% - Balanced Promotion' },
  { value: '50', label: '50% - Clearly Promotional' },
  { value: '75', label: '75% - Heavily Promotional' },
];

// New constants for Topic Idea Generator
export const AUDIENCE_OPTIONS: DropdownOption[] = [
  { value: 'General Public', label: 'General Public' },
  { value: 'Beginners / Newcomers', label: 'Beginners / Newcomers' },
  { value: 'Intermediate Users', label: 'Intermediate Users' },
  { value: 'Industry Experts / Professionals', label: 'Industry Experts / Professionals' },
  { value: 'Executives / C-Suite', label: 'Executives / C-Suite' },
  { value: 'Small Business Owners', label: 'Small Business Owners' },
  { value: 'Marketing Managers', label: 'Marketing Managers' },
  { value: 'Developers / Engineers', label: 'Developers / Engineers' },
  { value: 'Students', label: 'Students' },
  { value: 'Parents', label: 'Parents' },
  { value: 'Hobbyists / Enthusiasts', label: 'Hobbyists / Enthusiasts' },
  { value: 'Investors / Shareholders', label: 'Investors / Shareholders' },
];

export const CONTENT_ANGLE_OPTIONS: DropdownOption[] = [
  { value: 'How-to Guide', label: 'How-to Guide' },
  { value: 'Listicle (e.g., "Top 10...")', label: 'Listicle (e.g., "Top 10...")' },
  { value: 'Common Mistakes to Avoid', label: 'Common Mistakes to Avoid' },
  { value: 'Myth-Busting / Debunking', label: 'Myth-Busting / Debunking' },
  { value: 'Case Study / Success Story', label: 'Case Study / Success Story' },
  { value: 'Trend Analysis / Predictions', label: 'Trend Analysis / Predictions' },
  { value: 'Comparison (X vs. Y)', label: 'Comparison (X vs. Y)' },
  { value: 'Beginner\'s Guide (101)', label: 'Beginner\'s Guide (101)' },
  { value: 'Ultimate Guide (Deep Dive)', label: 'Ultimate Guide (Deep Dive)' },
  { value: 'Contrarian Take / Unpopular Opinion', label: 'Contrarian Take / Unpopular Opinion' },
  { value: 'Review / Analysis', label: 'Review / Analysis' },
  { value: 'Behind the Scenes', label: 'Behind the Scenes' },
];

export const HOOK_STYLE_OPTIONS: DropdownOption[] = [
  { value: 'Question-Based', label: 'Ask a Question' },
  { value: 'Data-Driven / Statistical', label: 'Use a Surprising Stat' },
  { value: 'Emotional Storytelling', label: 'Tell an Emotional Story' },
  { value: 'Bold Statement / Contrarian', label: 'Make a Bold Statement' },
  { value: 'Problem / Solution Focused', label: 'Focus on a Problem/Solution' },
  { value: 'Historical Context', label: 'Provide Historical Context' },
  { value: 'Future-Looking / Predictive', label: 'Look to the Future' },
  { value: 'Humorous / Witty', label: 'Use Humor' },
  { value: 'Relatable Scenario', label: 'Describe a Relatable Scenario' },
];

export const NUM_IDEAS_OPTIONS: DropdownOption[] = [
    { value: '5', label: '5 Ideas' },
    { value: '10', label: '10 Ideas' },
    { value: '15', label: '15 Ideas' },
];
