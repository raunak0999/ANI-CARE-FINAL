import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || ""
});

export interface CareRecommendationResponse {
  nutrition: {
    title: string;
    description: string;
    tips: string[];
  };
  grooming: {
    title: string;
    description: string;
    tips: string[];
  };
  health: {
    title: string;
    description: string;
    tips: string[];
  };
}

export async function generateCareRecommendations(
  petName: string, 
  age: string, 
  breed: string, 
  size?: string
): Promise<CareRecommendationResponse> {
  try {
    const prompt = `As a professional veterinarian and pet care expert, provide comprehensive care recommendations for a pet with the following details:

Name: ${petName}
Age: ${age}
Breed: ${breed}
Size: ${size || 'Not specified'}

Please provide specific, actionable recommendations in these three categories:
1. Nutrition - Diet, feeding schedule, foods to avoid
2. Grooming - Brushing, bathing, nail care, professional grooming
3. Health - Exercise needs, common health concerns, preventive care

Format your response as JSON with this exact structure:
{
  "nutrition": {
    "title": "Nutrition Guide",
    "description": "Brief description based on the pet's details",
    "tips": ["tip1", "tip2", "tip3", "tip4"]
  },
  "grooming": {
    "title": "Grooming Schedule", 
    "description": "Brief description customized for breed",
    "tips": ["tip1", "tip2", "tip3", "tip4"]
  },
  "health": {
    "title": "Health Monitoring",
    "description": "Brief description for age-specific health",
    "tips": ["tip1", "tip2", "tip3", "tip4"]
  }
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional veterinarian with expertise in pet care, nutrition, and training. Provide accurate, helpful advice for pet owners."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result as CareRecommendationResponse;
  } catch (error) {
    console.error("OpenAI API error:", error);
    
    // Fallback recommendations based on pet details
    return generateFallbackRecommendations(petName, age, breed, size);
  }
}

function generateFallbackRecommendations(
  petName: string, 
  age: string, 
  breed: string, 
  size?: string
): CareRecommendationResponse {
  const breedLower = breed.toLowerCase();
  const isLargeBreed = breedLower.includes('retriever') || breedLower.includes('labrador') || breedLower.includes('german') || breedLower.includes('rottweiler');
  const isSmallBreed = breedLower.includes('poodle') || breedLower.includes('chihuahua') || breedLower.includes('yorkie') || breedLower.includes('shih');
  const isPuppy = age.includes('Puppy') || age.includes('0-1');
  const isSenior = age.includes('Senior') || age.includes('7+');

  return {
    nutrition: {
      title: `Nutrition Guide for ${petName}`,
      description: `Customized feeding recommendations for your ${age.toLowerCase()} ${breed}`,
      tips: [
        isPuppy ? "Feed high-quality puppy food 3-4 times daily" : "Feed adult dog food twice daily at regular times",
        isLargeBreed ? "Choose large breed formula to support joint health" : "Select size-appropriate kibble for easy chewing",
        "Provide fresh water available at all times",
        isSenior ? "Consider senior formula with joint support supplements" : "Monitor weight and adjust portions as needed"
      ]
    },
    grooming: {
      title: `Grooming Schedule for ${petName}`,
      description: `Breed-specific grooming routine for your ${breed}`,
      tips: [
        breedLower.includes('retriever') || breedLower.includes('collie') ? "Brush daily to prevent matting of double coat" : "Brush 2-3 times weekly to reduce shedding",
        "Bathe every 4-6 weeks or when dirty",
        "Trim nails every 2-3 weeks to prevent overgrowth",
        isLargeBreed ? "Clean ears weekly to prevent infections" : "Check and clean ears bi-weekly"
      ]
    },
    health: {
      title: `Health Monitoring for ${petName}`,
      description: `Age and breed-specific health care for your ${age.toLowerCase()} ${breed}`,
      tips: [
        isPuppy ? "Schedule puppy vaccination series and spay/neuter consultation" : "Maintain annual vet checkups and vaccinations",
        isLargeBreed ? "Monitor for hip dysplasia and joint issues" : "Watch for dental problems common in smaller breeds",
        isSenior ? "Increase vet visits to twice yearly for senior wellness exams" : "Provide daily exercise appropriate for age and breed",
        "Watch for breed-specific health concerns and discuss with your vet"
      ]
    }
  };
}

export async function generateChatResponse(message: string, petContext?: string): Promise<string> {
  try {
    const systemPrompt = `You are AniCare AI Assistant, a professional pet care expert. You provide helpful, accurate advice about pet nutrition, training, health, grooming, and behavior. 

${petContext ? `Context about user's pet: ${petContext}` : ''}

Keep responses helpful, friendly, and concise. If the question is about serious health concerns, always recommend consulting a veterinarian.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't process your request. Please try asking again.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    
    // Fallback responses based on common pet care questions
    return generateFallbackChatResponse(message, petContext);
  }
}

function generateFallbackChatResponse(message: string, petContext?: string): string {
  const messageLower = message.toLowerCase();
  
  if (messageLower.includes('food') || messageLower.includes('nutrition') || messageLower.includes('feed')) {
    return "For proper nutrition, feed your pet high-quality food appropriate for their age and size. Puppies need 3-4 meals daily, while adults do well with 2 meals. Always provide fresh water and avoid feeding table scraps or foods toxic to pets like chocolate, grapes, or onions.";
  }
  
  if (messageLower.includes('training') || messageLower.includes('behavior') || messageLower.includes('obedience')) {
    return "Start with basic commands like 'sit', 'stay', and 'come' using positive reinforcement. Keep training sessions short (10-15 minutes) and consistent. Reward good behavior immediately with treats and praise. For behavioral issues, consider consulting a professional dog trainer.";
  }
  
  if (messageLower.includes('health') || messageLower.includes('sick') || messageLower.includes('vet')) {
    return "Regular veterinary checkups are essential for your pet's health. Watch for changes in appetite, energy levels, or bathroom habits. If you notice any concerning symptoms, contact your veterinarian promptly. Annual vaccinations and preventive care help keep your pet healthy.";
  }
  
  if (messageLower.includes('grooming') || messageLower.includes('brush') || messageLower.includes('bath')) {
    return "Regular grooming keeps your pet healthy and comfortable. Brush your pet regularly to prevent matting and reduce shedding. Bathe when necessary with pet-specific shampoo. Don't forget to trim nails, clean ears, and brush teeth regularly for optimal health.";
  }
  
  if (messageLower.includes('exercise') || messageLower.includes('walk') || messageLower.includes('play')) {
    return "Exercise needs vary by breed, age, and size. Most dogs need at least 30 minutes to 2 hours of activity daily. This can include walks, playtime, and mental stimulation. Puppies and senior pets may need modified exercise routines. Always adjust activity based on your pet's individual needs.";
  }
  
  return `Thank you for your question about pet care. ${petContext ? 'Based on your pet\'s profile, ' : ''}I recommend consulting with a veterinarian for personalized advice. In the meantime, ensure your pet has proper nutrition, regular exercise, and lots of love. Feel free to ask about specific topics like feeding, training, or health concerns.`;
}
