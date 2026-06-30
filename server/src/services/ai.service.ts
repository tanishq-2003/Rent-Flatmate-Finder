import prisma from '../utils/prisma';
import { env } from '../config/env';
import { Listing, Profile } from '@prisma/client';

export class AIService {
  async calculateCompatibility(tenantId: string, listingId: string) {
    const tenant = await prisma.user.findUnique({
      where: { id: tenantId },
      include: { profile: true },
    });

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!tenant || !tenant.profile || !listing) return null;

    let score = 0;
    let explanation = '';
    let computedBy = 'RULE';

    try {
      if (env.OPENAI_API_KEY) {
        // Attempt LLM generation
        const llmResult = await this.callLLM(tenant.profile, listing);
        score = llmResult.score;
        explanation = llmResult.explanation;
        computedBy = 'AI';
      } else {
        throw new Error('No API Key');
      }
    } catch (error) {
      // Fallback to Rule-based Scoring
      const ruleResult = this.calculateRuleBasedScore(tenant.profile, listing);
      score = ruleResult.score;
      explanation = ruleResult.explanation;
    }

    // Save or update score
    return prisma.compatibilityScore.upsert({
      where: {
        tenantId_listingId: {
          tenantId,
          listingId,
        },
      },
      update: {
        score,
        explanation,
        computedBy,
      },
      create: {
        tenantId,
        listingId,
        score,
        explanation,
        computedBy,
      },
    });
  }

  private async callLLM(profile: Profile, listing: Listing) {
    // In a real implementation, we'd use the OpenAI SDK here
    // For this example without installing the SDK, we'll do a basic fetch or return mock
    
    // MOCK LLM response for demonstration
    // Since we don't have a real API key in the environment usually during setup
    return {
      score: 85,
      explanation: `The tenant's budget fits the rent. Preferred location ${profile.preferredLocations.join(', ')} matches ${listing.city}.`,
    };
  }

  private calculateRuleBasedScore(profile: Profile, listing: Listing) {
    let score = 0;
    let explanation = '';

    // Budget match (max 40)
    if (profile.budgetMax && profile.budgetMin) {
      if (listing.rent >= profile.budgetMin && listing.rent <= profile.budgetMax) {
        score += 40;
        explanation += 'Rent perfectly fits budget. ';
      } else if (listing.rent <= profile.budgetMax * 1.2) {
        score += 30;
        explanation += 'Rent is slightly above budget. ';
      } else {
        score += 10;
        explanation += 'Rent is outside budget range. ';
      }
    } else {
      score += 20; // default if no budget set
    }

    // Location match (max 40)
    if (profile.preferredLocations && profile.preferredLocations.length > 0) {
      const match = profile.preferredLocations.some(loc => 
        listing.city.toLowerCase().includes(loc.toLowerCase()) || 
        listing.location.toLowerCase().includes(loc.toLowerCase())
      );
      if (match) {
        score += 40;
        explanation += 'Location is a perfect match. ';
      } else {
        score += 10;
        explanation += 'Location is not in preferred list. ';
      }
    } else {
      score += 20;
    }

    // Move-in match (max 20)
    if (profile.moveInDate) {
      const diffTime = Math.abs(listing.availableDate.getTime() - profile.moveInDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays <= 7) {
        score += 20;
        explanation += 'Move-in dates align perfectly.';
      } else if (diffDays <= 14) {
        score += 15;
        explanation += 'Move-in dates are close.';
      } else {
        score += 5;
        explanation += 'Move-in dates differ significantly.';
      }
    } else {
      score += 10;
    }

    return { score, explanation };
  }
}

export const aiService = new AIService();
