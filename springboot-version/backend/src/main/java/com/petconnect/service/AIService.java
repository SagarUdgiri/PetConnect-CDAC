package com.petconnect.service;

import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;
import com.petconnect.dto.PetDietRequestDto;

public interface AIService {
	String getPetAdvice(MultipartFile image) throws IOException;

	String getDiet(PetDietRequestDto dietRequestDto);

	String getDietandProduct(PetDietRequestDto dietRequestDto);
}
