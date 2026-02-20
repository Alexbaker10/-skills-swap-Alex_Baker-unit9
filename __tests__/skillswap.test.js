const { filterSkillsByCategory } = require('../skillswap-functions');

describe('filterSkillsByCategory', () => {
  const skills = [
    { title: 'Python', category: 'Programming', price: 20 },
    { title: 'Guitar', category: 'Music', price: 15 },
  ];

  it('filters skills by specific category', () => {
    expect(filterSkillsByCategory(skills, 'Programming')).toEqual([skills[0]]);
  });

  it('returns all skills when category is All', () => {
    expect(filterSkillsByCategory(skills, 'All')).toEqual(skills);
  });

  it('returns an empty array when no matches are found', () => {
    expect(filterSkillsByCategory(skills, 'Cooking')).toEqual([]);
  });
});

const { filterSkillsByCategory, calculateTotalCost } = require('../skillswap-functions');

describe('calculateTotalCost', () => {
  it('calculates the cost correctly', () => {
    expect(calculateTotalCost(20, 2)).toBe(40);
  });
  it('handles free sessions (price 0)', () => {
    expect(calculateTotalCost(0, 3)).toBe(0);
  });
  it('handles zero hours', () => {
    expect(calculateTotalCost(20, 0)).toBe(0);
  });
  it('handles decimal hours', () => {
    expect(calculateTotalCost(25, 1.5)).toBe(37.5);
  });
});

const { filterSkillsByCategory, calculateTotalCost, matchSkillsToUser } = require('../skillswap-functions');

describe('matchSkillsToUser', () => {
    const skills = [
        { title: 'Python Tutoring', category: 'Programming', price: 20 },
        { title: 'JavaScript Help', category: 'Programming', price: 25 },
        { title: 'Resume Review', category: 'Career', price: 0 }
    ];

    it('matches by category and filters by max price', () => {
        const needs = { category: 'Programming', maxPrice: 20 };
        expect(matchSkillsToUser(needs, skills)).toEqual([skills[0]]);
    });

    it('returns an empty array for no matches', () => {
        const needs = { category: 'Cooking', maxPrice: 100 };
        expect(matchSkillsToUser(needs, skills)).toEqual([]);
    });

    it('includes free skills correctly', () => {
        const needs = { category: 'Career', maxPrice: 0 };
        expect(matchSkillsToUser(needs, skills)).toEqual([skills[2]]);
    });
});