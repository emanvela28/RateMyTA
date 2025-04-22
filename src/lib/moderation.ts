// src/lib/moderation.ts
import * as leoProfanity from 'leo-profanity'

// Initialize the profanity filter with additional configuration
leoProfanity.loadDictionary('en')
leoProfanity.clearList() // Start with clean slate

// Base profanity dictionary + custom terms
const PROFANITY_LIST = [
  ...leoProfanity.getDictionary('en'), // Start with base English dictionary
  // Phonetic variations and custom terms
  'ben dover', 'mike hawk', 'seymour butts', 'ivana tinkle',
  'mcbutts', 'mcballz', 'saggy dick', 'dixie normous',
  // Common circumventions
  'f u c k', '5h1t', '@$$', 'b!tch', 'd1ck', 'pussyboss',
  // Academic-specific terms
  'terrible teacher', 'worst ta', 'hate this prof', 'failing class'
]

// Load our enhanced dictionary
leoProfanity.add(PROFANITY_LIST)

const flaggedNames = [
    "Ann Al", "Annie Rection", "Aneed Seamen", "Aneed Morehead", "Anita Cox",
    "Anita Hardone", "Anita Hickey", "Anna Borshin", "Ash Hull", "Barry McKockiner",
    "Ben Dover", "Ben Jackinoff", "Ben O. Verbich", "Bo Nehr", "Bob Maddick",
    "Buck Nekkid", "Buster Cherry", "Cam L. Tou", "Chase Cox", "Chit Head",
    "Chubby Cox", "Chuck McCrap", "Cina Himen", "Clint Torres", "Crystal Methven",
    "Dang Lin Wang", "Dawanna Boner", "Dixie Normous", "Dixon Cider", "Dixon Nas",
    "Dolly Teats", "Dr. Burns", "E. Jack Ulayte", "Ernest Stroker", "Fannie Liquin",
    "Fella Longbottom", "Frank Lee Gaye", "Gabe Itch", "Harry Cox", "Harry P. Nus",
    "Harry Richard Seaman", "Harry Sachs", "Haywood Jablowme", "Herman Moans",
    "Holden Mikehawk", "Holden Hishcock", "Huge Jass", "Hugh G. Rection",
    "Ivana Mandic", "Jack Eulation", "Jack Hitoff", "Jack MeHoff", "Jen Nottle",
    "Jenna Tools", "Juan A. Hooker", "Juan Tibone", "Jure Koff", "Kenya Swallow",
    "Kareem M. Pants", "Liz Bian", "Lou Sass", "Luke Atmyas", "Major Wood",
    "Mark Z. Spot", "Maya Buttreeks", "Maye I. Tutchem", "Mia Harddick",
    "Mike Bangs", "Mike Dixon", "Mike Hunt", "Mike Litorous", "Mike Oxlong",
    "Mike Rochburns", "Mike Yushie", "Mona Lott", "Miku Cheese Harry", "Myra Nus",
    "Neil Downs", "Olive Cox", "Oliver Clozoff", "Ophelia Rass", "Parker Vage",
    "Pena Trayshin", "Phil McGroin", "Phillis Wood", "Puma Dickens", "Richard Cummings",
    "Richard Felt", "Richard Head", "Richard Long", "Richard Paradise", "Richard Shaver",
    "Richard Swett", "Richard Tips", "Richard Trickle", "Rusty Kuntz", "Seymour Bush",
    "Seymour Butts", "Stacy Rect", "Steve Sharts", "Tara Dikoff", "Tess Tickles",
    "Vye Agra", "Wayne Kerr", "Wang Liquin", "Willa Benedict", "Willie Fauker",
    "Willie B. Hardigan", "Willie Stroker", "Willis D. Holder", "Woody Harden",
    "York Hunt", "Yuri Nate", "Yusha Sukdeep"
  ].map(name => name.toLowerCase())

// More aggressive normalization
function normalizeForModeration(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD') // Normalize diacritics and similar chars
    .replace(/[^\w\s]|_/g, '') // Remove all symbols
    .replace(/\s+/g, '') // Remove all spaces
    .replace(/[0-9]/g, '') // Remove numbers
    .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII chars
}

// Updated function with name moderation + joke name detection
export function moderateName(name: string): { valid: boolean | 'flagged'; reason?: string } {
    if (!name || typeof name !== 'string') {
      return { valid: false, reason: 'Invalid name format' }
    }
  
    const normalized = normalizeForModeration(name)
    const lowerCaseName = name.trim().toLowerCase()
  
    // Length checks
    if (normalized.length < 2) {
      return { valid: false, reason: 'Name must be at least 2 characters' }
    }
  
    if (normalized.length > 30) {
      return { valid: false, reason: 'Name must be less than 30 characters' }
    }
  
    // Joke/fake name check
    if (flaggedNames.includes(lowerCaseName)) {
      return { valid: false, reason: 'Name flagged as inappropriate or joke name' }
    }
  
    // Common fake name patterns
    const fakeNamePatterns = [
      /(.)\1{2,}/,
      /^[^a-z]*$/,
      /(admin|moderator|support)/i
    ]
  
    if (fakeNamePatterns.some(pattern => pattern.test(name))) {
      return { valid: 'flagged', reason: 'Suspicious name pattern' }
    }
  
    // Profanity
    if (leoProfanity.check(normalized)) {
      return { valid: false, reason: 'Contains inappropriate content' }
    }
  
    return { valid: true }
  }
  

// Enhanced text moderation with thresholds
export async function moderateText(
  text: string,
  options?: { strict?: boolean }
): Promise<{ valid: boolean | 'flagged'; reason?: string }> {
  if (!text || typeof text !== 'string') {
    return { valid: false, reason: 'Invalid text format' }
  }

  const normalized = normalizeForModeration(text)

  // Skip very short text but flag empty
  if (normalized.length === 0) {
    return { valid: false, reason: 'Text cannot be empty' }
  }

  if (normalized.length < 5) {
    return { valid: options?.strict ? 'flagged' : true }
  }

  // Profanity check
  if (leoProfanity.check(normalized)) {
    return { valid: false, reason: 'Contains inappropriate language' }
  }

  // Contextual checks (e.g., all caps, excessive punctuation)
  const originalText = text.trim()
  if (originalText === originalText.toUpperCase() && originalText.length > 10) {
    return { valid: 'flagged', reason: 'Suspicious formatting' }
  }

  // Optional AI moderation
  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await fetch('https://api.openai.com/v1/moderations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({ input: text })
      })

      const data = await response.json()
      const result = data.results?.[0]

      if (result?.flagged) {
        const categories = result.categories
        // Different handling based on severity
        if (categories.hate || categories.violence || categories.self_harm) {
          return { valid: false, reason: 'Prohibited content detected' }
        }
        return { valid: 'flagged', reason: 'Content requires review' }
      }
    } catch (error) {
      console.error('AI moderation failed:', error)
      // Fail open but log the error
      return { valid: 'flagged', reason: 'Moderation system error' }
    }
  }

  return { valid: true }
}

// Additional utility function for bulk moderation
export async function moderateMultipleTexts(
  texts: string[],
  options?: { strict?: boolean }
): Promise<{ valid: boolean | 'flagged'; reason?: string }[]> {
  return Promise.all(texts.map(text => moderateText(text, options)))
}