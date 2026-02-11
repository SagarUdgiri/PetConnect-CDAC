using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using PetConnectAlmost.DAO;
using PetConnectAlmost.DTOs;

namespace PetConnectAlmost.Services
{
    public class AIService : IAIService
    {
        private readonly string _apiKey;
        private readonly string _model;
        private readonly HttpClient _httpClient;
        private readonly IProductDao _productDao;

        public AIService(IConfiguration configuration, HttpClient httpClient, IProductDao productDao)
        {
            _apiKey = configuration["GeminiAI:ApiKey"];
            _model = configuration["GeminiAI:Model"] ?? "gemini-2.5-flash";
            _httpClient = httpClient;
            _productDao = productDao;
        }

        public async Task<string> GetPetAdviceAsync(IFormFile image)
        {
            string base64Image;
            using (var ms = new MemoryStream())
            {
                await image.CopyToAsync(ms);
                base64Image = Convert.ToBase64String(ms.ToArray());
            }

            var prompt = @"
                You are a veterinary assistant AI.
                Analyze the pet image and return ONLY valid JSON with this exact structure:
                {
                  ""animal_type"": """",
                  ""visible_condition"": """",
                  ""possible_health_observations"": [],
                  ""urgency_level"": ""low | medium | high"",
                  ""care_advice"": [],
                  ""disclaimer"": """"
                }
                Rules:
                - No disease diagnosis
                - Base answers only on visible features
                - No markdown
                - No extra text";

            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new object[]
                        {
                            new { text = prompt },
                            new
                            {
                                inline_data = new
                                {
                                    mime_type = image.ContentType,
                                    data = base64Image
                                }
                            }
                        }
                    }
                }
            };

            return await CallGeminiAsync(requestBody);
        }

        public async Task<string> GetDietAndProductAsync(PetDietRequestDto dietRequestDto)
        {
            var products = await _productDao.GetAllAsync();
            var productListJson = JsonSerializer.Serialize(products.Select(p => new {
                id = p.Id,
                name = p.Name,
                description = p.Description,
                price = p.Price,
                category = p.Category
            }));

            var prompt = $@"
                You are a veterinary nutrition assistant AI for pets in INDIA.
                IMPORTANT GUIDELINES:
                - This is PET nutrition, NOT human diet advice
                - Commercial pet food should be the primary diet
                - Home ingredients are only occasional supplements
                - DO NOT suggest beef or beef products
                - Avoid pork
                - Use pet-safe ingredients commonly available in India
                - Never suggest spices, salt, sugar, or cooked human meals
                - Recommend ONLY from the provided product list
                - Never invent products

                Pet details:
                - Name: {dietRequestDto.PetName}
                - Type: {dietRequestDto.PetType}
                - Breed: {dietRequestDto.Breed ?? "Unknown"}
                - Age (years): {dietRequestDto.AgeYears}
                - Weight (kg): {dietRequestDto.WeightKg}
                - Activity level: {dietRequestDto.ActivityLevel}
                - Goal: {dietRequestDto.Goal}

                Available products (JSON):
                {productListJson}

                Return ONLY valid JSON in this structure:
                {{
                  ""diet_summary"": """",
                  ""recommended_products"": [
                    {{
                      ""product_id"": """",
                      ""product_name"": """",
                      ""reason"": """"
                    }}
                  ],
                  ""feeding_guidelines"": """",
                  ""care_tips"": [],
                  ""disclaimer"": """"
                }}

                Rules:
                - No medical diagnosis
                - No human meal plans
                - No treatment claims
                - Use general nutritional guidelines only
                - Recommended products MUST match provided product list
                - No markdown
                - No extra text";

            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = prompt }
                        }
                    }
                }
            };

            return await CallGeminiAsync(requestBody);
        }

        private async Task<string> CallGeminiAsync(object requestBody)
        {
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/{_model}:generateContent?key={_apiKey}";
            var response = await _httpClient.PostAsJsonAsync(url, requestBody);
            
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new Exception($"Gemini API error: {response.StatusCode} - {errorContent}");
            }

            var result = await response.Content.ReadFromJsonAsync<JsonElement>();
            
            try 
            {
                var text = result.GetProperty("candidates")[0]
                                 .GetProperty("content")
                                 .GetProperty("parts")[0]
                                 .GetProperty("text")
                                 .GetString();

                if (string.IsNullOrEmpty(text)) return "{}";

                // Strip markdown code blocks if present
                if (text.Contains("```json"))
                {
                    text = text.Split("```json")[1].Split("```")[0];
                }
                else if (text.Contains("```"))
                {
                    text = text.Split("```")[1].Split("```")[0];
                }

                return text.Trim();
            }
            catch (Exception ex)
            {
                 throw new Exception("Failed to parse Gemini response: " + ex.Message);
            }
        }
    }
}
