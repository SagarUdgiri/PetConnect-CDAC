using PetConnectAlmost.Repositories;
using PetConnectAlmost.Models;

namespace PetConnectAlmost.Services
{
    public class PetService : IPetService
    {
        private readonly IPetRepository _petRepository;

        public PetService(IPetRepository petRepository)
        {
            _petRepository = petRepository;
        }

        public async Task<IEnumerable<Pet>> GetAllPetsAsync()
        {
            return await _petRepository.GetAllAsync();
        }

        public async Task<Pet?> GetPetByIdAsync(long id)
        {
            return await _petRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Pet>> GetByUserIdAsync(long userId)
        {
            return await _petRepository.GetByUserIdAsync(userId);
        }

        public async Task<Pet> RegisterPetAsync(PetRegisterRequest request, long userId)
        {
            var pet = new Pet
            {
                PetName = request.PetName,
                Species = request.Species,
                Breed = request.Breed,
                Age = request.Age,
                ImageUrl = request.ImageUrl,
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            return await _petRepository.AddAsync(pet);
        }

        public async Task UpdatePetAsync(long id, PetRegisterRequest request)
        {
            var pet = await _petRepository.GetByIdAsync(id);
            if (pet == null)
            {
                throw new KeyNotFoundException("Pet not found");
            }

            pet.PetName = request.PetName;
            pet.Species = request.Species;
            pet.Breed = request.Breed;
            pet.Age = request.Age;
            pet.ImageUrl = request.ImageUrl;
            pet.UpdatedAt = DateTime.UtcNow;

            await _petRepository.UpdateAsync(pet);
        }

        public async Task DeletePetAsync(long id)
        {
            await _petRepository.DeleteAsync(id);
        }
    }
}
