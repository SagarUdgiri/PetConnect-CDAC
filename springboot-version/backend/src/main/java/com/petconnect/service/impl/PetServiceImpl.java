package com.petconnect.service.impl;

import com.petconnect.dto.PetCreateDto;
import com.petconnect.dto.PetDto;
import com.petconnect.entity.Pet;
import com.petconnect.entity.User;
import com.petconnect.repository.PetRepository;
import com.petconnect.repository.UserRepository;
import com.petconnect.service.PetService;
import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PetServiceImpl implements PetService {
    private final PetRepository petRepository;
    private final UserRepository userRepository;
    private final ModelMapper mapper;

    @Override
    public PetDto registerPet(PetCreateDto petDto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Pet pet=mapper.map(petDto, Pet.class);
        pet.setUser(user);
        return mapToPetDto(petRepository.save(pet));
    }

    @Override
    public List<PetDto> getAllPets() {
        return petRepository.findAll().stream()
                .map(this::mapToPetDto)
                .collect(Collectors.toList());
    }

    @Override
    public PetDto getPetById(Long id) {
        return mapToPetDto(getPetEntity(id));
    }

    private Pet getPetEntity(Long id) {
        return petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet not found"));
    }

    @Override
    public List<PetDto> getPetsByUserId(Long userId) {
        return petRepository.findByUserId(userId).stream()
                .map(this::mapToPetDto)
                .collect(Collectors.toList());
    }

    @Override
    public PetDto updatePet(Long id, PetCreateDto petData) {
        Pet pet = getPetEntity(id);
        pet.setPetName(petData.getPetName());
        pet.setSpecies(petData.getSpecies());
        pet.setBreed(petData.getBreed());
        pet.setAge(petData.getAge());
        pet.setImageUrl(petData.getImageUrl());
        return mapToPetDto(petRepository.save(pet));
    }

    @Override
    public void deletePet(Long petId) {
        petRepository.deleteById(petId);
    }

    @Override
    public PetDto mapToPetDto(Pet pet) {
        return PetDto.builder()
                .id(pet.getId())
                .name(pet.getPetName())
                .breed(pet.getBreed())
                .type(pet.getSpecies())
                .age(pet.getAge())
                .imageUrl(pet.getImageUrl())
                .userId(pet.getUser().getId())
                .ownerName(pet.getUser().getFullName())
                .build();
    }
}
