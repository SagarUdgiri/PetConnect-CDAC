package com.petconnect.service;

import com.petconnect.dto.PetCreateDto;
import com.petconnect.dto.PetDto;
import com.petconnect.entity.Pet;
import java.util.List;

public interface PetService {
    PetDto registerPet(PetCreateDto petDto, Long userId);

    List<PetDto> getAllPets();

    PetDto getPetById(Long id);

    List<PetDto> getPetsByUserId(Long userId);

    PetDto updatePet(Long id, PetCreateDto petData);

    void deletePet(Long petId);

    PetDto mapToPetDto(Pet pet);
}
